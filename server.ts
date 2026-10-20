import express from "express";
import path from "path";
import net from "net";
import dotenv from "dotenv";
import multer from "multer";
import XLSX from "xlsx";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { buildClimateForecastFromRows, buildTrainingPayloadFromRows } from "./forecast";

dotenv.config();

const app = express();
const preferredPort = Number(process.env.PORT || 3000);

const getAvailablePort = async (startPort: number): Promise<number> => {
  const checkPort = (port: number): Promise<number> =>
    new Promise((resolve, reject) => {
      const tester = net.createServer();

      tester.once("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          resolve(checkPort(port + 1));
          return;
        }

        reject(error);
      });

      tester.listen(port, "0.0.0.0", () => {
        tester.close(() => resolve(port));
      });
    });

  return checkPort(startPort);
};

app.use(express.json({ limit: "20mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

const normalizeColumnName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const detectClimateColumnType = (columnName: string) => {
  const normalized = normalizeColumnName(columnName);

  if (/(date|time|timestamp|datetime|day|month|year|period)/.test(normalized)) return "date";
  if (/(temp|temperature|t2m|airtemp|avg_temp|max_temp|min_temp|surface_temp)/.test(normalized)) return "temperature";
  if (/(precip|rain|rainfall|ppt|rr|wet|storm)/.test(normalized)) return "precipitation";
  if (/(humidity|rh|relative_humidity|specific_humidity)/.test(normalized)) return "humidity";
  if (/(wind|speed|gust|u10|v10|velocity)/.test(normalized)) return "wind";
  if (/(lat|latitude)/.test(normalized)) return "latitude";
  if (/(lon|lng|long|longitude)/.test(normalized)) return "longitude";
  if (/(region|country|area|zone|location|site)/.test(normalized)) return "region";
  return "other";
};

const parseDateValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  const asDate = new Date(String(value));
  if (!Number.isNaN(asDate.getTime())) return asDate;
  return null;
};

const analyzeDatasetBuffer = (buffer: Buffer, fileName: string) => {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
    raw: false,
  });

  if (!rows.length) {
    throw new Error("The uploaded file is empty or does not contain any rows.");
  }

  const columns = Object.keys(rows[0]);
  const climateColumns = columns
    .filter((column) => detectClimateColumnType(column) !== "other")
    .map((column) => ({
      name: column,
      type: detectClimateColumnType(column),
    }));

  const dateColumn = columns.find((column) => detectClimateColumnType(column) === "date") || null;

  const dateValues = dateColumn
    ? rows
        .map((row) => parseDateValue(row[dateColumn]))
        .filter((value): value is Date => value !== null)
    : [];

  const missingByColumn = columns.map((column) => {
    const missing = rows.filter((row) => {
      const value = row[column];
      return value === null || value === undefined || String(value).trim() === "";
    }).length;

    return {
      column,
      missing,
      missingRate: rows.length ? (missing / rows.length) * 100 : 0,
    };
  });

  const issues: string[] = [];
  const totalMissing = missingByColumn.reduce((sum, item) => sum + item.missing, 0);
  if (totalMissing > 0) {
    issues.push(`${totalMissing} blank cells detected across the dataset.`);
  }
  if (!dateColumn) {
    issues.push("No date-like column detected; date validation could not be completed.");
  }
  if (dateValues.length === 0 && dateColumn) {
    issues.push("Date column found but no valid date values could be parsed.");
  }
  if (climateColumns.length === 0) {
    issues.push("No obvious climate metrics were detected in the column names.");
  }

  const dateRange = dateValues.length
    ? {
        earliest: new Date(Math.min(...dateValues.map((date) => date.getTime()))).toISOString(),
        latest: new Date(Math.max(...dateValues.map((date) => date.getTime()))).toISOString(),
      }
    : null;

  const previewRows = rows.slice(0, 8).map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, value === null || value === undefined ? "" : String(value)])
    )
  );

  return {
    fileName,
    rows,
    rowCount: rows.length,
    columns,
    climateColumns,
    previewRows,
    validation: {
      status: issues.length === 0 ? "valid" : totalMissing > 0 || dateValues.length === 0 ? "warning" : "warning",
      missingTotal: totalMissing,
      missingByColumn,
      issues,
      dateRange,
    },
  };
};

// Initialize AI client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. If you are using Hugging Face instead, add HUGGINGFACE_API_KEY to your environment and update the AI route to use it."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Scientific AI Climate Analysis & Insights Endpoint
app.post("/api/climate-analysis", async (req, res) => {
  try {
    const { region, metricType, forecastPeriod, query, customParameters } = req.body;

    const ai = getAiClient();
    
    const prompt = `You are EcoPredict AI's Lead Senior Climate Scientist specializing in West African tropical meteorology, hydrological modeling, and neural climate forecasting.
    
Analyze the following request for the region: "${region || "West Africa Overall"}":
Metric Focus: ${metricType || "Temperature & Precipitation Variability"}
Forecast Period: ${forecastPeriod || "2026 - 2035"}
User Scientific Query / Notes: ${query || "Provide high-precision neural climate prediction, anomaly analysis, and policy resilience recommendations."}
Custom Model Parameters: ${JSON.stringify(customParameters || {})}

Provide a comprehensive, highly scientific structured report with:
1. Executive Summary & Confidence Intervals (MAE, RMSE estimates)
2. Regional Climate Impact (Sahel drought risks, Coastal precipitation, Monsoonal dynamics)
3. Neural Network Model Assessment (ANN vs PyTorch Deep Spatial-Temporal predictions)
4. Actionable Agricultural & Policy Recommendations for West African Resilience

Keep the response articulate, structured with clear Markdown headers, and grounded in rigorous environmental data science.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      report: response.text,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Error in climate analysis API:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to generate climate analysis report.",
    });
  }
});

app.post("/api/process-dataset", upload.single("file"), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded." });
    }

    const fileBuffer = req.file.buffer;
    const dataset = analyzeDatasetBuffer(fileBuffer, req.file.originalname);

    return res.json({
      success: true,
      dataset,
    });
  } catch (error: any) {
    console.error("Dataset processing failed:", error);
    return res.status(400).json({
      success: false,
      error: error.message || "Failed to process dataset.",
    });
  }
});

app.post("/api/generate-forecast", async (req, res) => {
  try {
    const {
      rows,
      columns = [],
      climateColumns = [],
      datasetName = "Uploaded dataset",
      region = "West Africa",
    } = req.body || {};

    const forecast = buildClimateForecastFromRows(
      Array.isArray(rows) ? rows : [],
      Array.isArray(columns) ? columns : [],
      Array.isArray(climateColumns) ? climateColumns : [],
      datasetName,
      region
    );

    if (forecast.success === false) {
      return res.status(400).json({
        success: false,
        error: forecast.error,
      });
    }

    return res.json({
      success: true,
      forecast,
    });
  } catch (error: any) {
    console.error("Forecast generation failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate climate forecast.",
    });
  }
});

app.post("/api/train-model", async (req, res) => {
  try {
    const {
      rows,
      columns = [],
      climateColumns = [],
      datasetName = "Uploaded dataset",
      region = "West Africa",
      algorithm = "Artificial Neural Network (ANN)",
      hyperparameters = {},
    } = req.body || {};

    const trainingResult = buildTrainingPayloadFromRows(
      Array.isArray(rows) ? rows : [],
      Array.isArray(columns) ? columns : [],
      Array.isArray(climateColumns) ? climateColumns : [],
      datasetName,
      region,
      algorithm,
      hyperparameters
    );

    if (trainingResult.success === false) {
      return res.status(400).json({
        success: false,
        error: trainingResult.error,
      });
    }

    return res.json(trainingResult);
  } catch (error: any) {
    console.error("Training payload generation failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to build training payload.",
    });
  }
});

// AI Model Parameter Optimizer Endpoint
app.post("/api/optimize-model", async (req, res) => {
  try {
    const { modelType, datasetSize, targetMetric } = req.body;
    const ai = getAiClient();

    const prompt = `As EcoPredict AI Neural Optimization Engine, recommend hyperparameter tuning, layer structure, learning rate schedules, and spatial normalization techniques for:
Model Architecture: ${modelType || "Adaptive Hybrid Conv-LSTM / PyTorch Transformer"}
Dataset Scale: ${datasetSize || "High-resolution satellite + ground station sensor streams"}
Optimization Target: ${targetMetric || "Minimize MAE in monsoon onset dates"}

Return concise JSON format with:
{
  "learningRate": number,
  "batchSize": number,
  "epochsRecommended": number,
  "layersConfig": string,
  "regularization": string,
  "scientificRationale": string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json({
      success: true,
      optimization: JSON.parse(response.text || "{}"),
    });
  } catch (err: any) {
    console.error("Error in model optimization API:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Optimization engine failed.",
    });
  }
});

async function startServer() {
  const port = await getAvailablePort(preferredPort);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`EcoPredict AI server running on http://0.0.0.0:${port}`);
    if (port !== preferredPort) {
      console.log(`Port ${preferredPort} was unavailable; switched to ${port}.`);
    }
  });
}

startServer();

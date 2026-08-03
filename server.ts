import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoPredict AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

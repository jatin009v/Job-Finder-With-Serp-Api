import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // allows frontend to access this server

const API_KEY = "29f755e43476053e38d934692b8821eeba90336740920d71c15273d193649f56";

app.get("/api/jobs", async (req, res) => {
  const query = req.query.q;
  const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(
    query
  )}&api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("🔎 API Response Keys:", Object.keys(data)); // ✅ log keys
    console.log("🧠 Jobs Count:", data.jobs_results?.length || 0);
    res.json({ jobs_results: data.jobs_results || [] });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"));

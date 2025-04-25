const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Environment Variables
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "gemini_logs_db";
const COLLECTION_NAME = "inference_timings";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

app.get("/process-all-texts", async (req, res) => {
  try {
    const { data } = await axios.get("http://localhost:8000/all-cleaned-texts");

    if (!data.data || !Array.isArray(data.data)) {
      return res.status(400).json({ message: "Invalid data structure from API" });
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    for (const entry of data.data) {
      const { user_email, cleaned_text } = entry;
      const start = Date.now();

      const response = await axios.post(
        `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: cleaned_text }]
            }
          ]
        }
      );
      

      const end = Date.now();
      const timeTakenMs = end - start;

      await collection.insertOne({
        user_email,
        input_text: cleaned_text,
        response: response.data,
        time_taken_ms: timeTakenMs,
        created_at: new Date()
      });

      await sendMail(user_email, timeTakenMs);
    }

    await client.close();
    res.json({ message: "✅ Processing complete." });

  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

async function sendMail(email, timeTakenMs) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  });

  const mailOptions = {
    from: GMAIL_USER,
    to: email,
    subject: "Gemini Model Inference Time",
    text: `Hello,\n\nYour text was processed in ${timeTakenMs}ms using the Gemini model.\n\nThanks!`
  };

  await transporter.sendMail(mailOptions);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

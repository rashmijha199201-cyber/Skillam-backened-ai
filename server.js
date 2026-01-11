import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

/* ✅ CORS FIX */
app.use(cors());
app.options("*", cors());
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
  res.send("Skillam GPT Backend is running ✅");
});

/* Chat endpoint */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message missing" });
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",   // ✅ CURRENT SUPPORTED MODEL
          messages: [
            {
              role: "system",
              content:
                "You are Skillam Institute AI counselor. Answer politely about courses, fees, admissions, and careers."
            },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await openaiRes.json();

    if (!data.choices) {
      return res.status(500).json({
        reply: "OpenAI error. Check API key."
      });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "Server error. Please try again."
    });
  }
});

/* ✅ RENDER PORT FIX */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Skillam GPT backend running on port " + PORT);
});

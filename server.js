import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("Skillam GPT Backend is running 🚀");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are Skillam Institute AI counselor. Answer politely about courses, fees, admissions, careers, and student guidance. Location: Kanpur."
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await openaiResponse.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ reply: "AI response error" });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      reply: "Server error. Please try again."
    });
  }
});

// ✅ IMPORTANT: Dynamic port for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Skillam GPT backend running on port " + PORT);
});

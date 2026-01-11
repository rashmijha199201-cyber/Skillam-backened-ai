import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch(
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
              "You are Skillam Institute AI counselor. Answer politely about courses, fees, admissions, and careers."
          },
          { role: "user", content: userMessage }
        ]
      })
    }
  );

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

app.listen(3000, () => console.log("Skillam GPT backend running"));

import axios from "axios";
import EmailHistory from "../models/emailHistory.js";
import dotenv from "dotenv";

dotenv.config();

export const generateEmail = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    if (prompt.length < 10) {
      return res.status(400).json({
        message: "Prompt is to short. Please provide a more detailed prompt.",
      });
    }

    if (prompt.length > 1000) {
      return res.status(400).json({
        message: "Prompt is too long. Please provide a shorter prompt.",
      });
    }

    // 1. Correct Groq chat endpoint // corrected
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: `Generate a concise cold email, LinkedIn DM, and follow-up email.
Return only a valid JSON object with exactly these string fields:
subject, emailBody, linkedInDM, followUpEmail.
Keep the emailBody and followUpEmail under 150 words each, and linkedInDM under 60 words.`,
          },
          { role: "user", content: prompt },
        ],
        // 2. Enforces JSON output from LLaMA // the format should be in json
        response_format: { type: "json_object" },
        max_completion_tokens: 3000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    if (
      !response.data ||
      !response.data.choices ||
      response.data.choices.length === 0
    ) {
      return res
        .status(500)
        .json({ message: "Invalid response from groq API" });
    }

    // 3. Parse JSON string from content
    const rawContent = response.data.choices[0].message.content;
    const parsedContent = JSON.parse(rawContent);

    const emailData = {
      subject: parsedContent.subject || "",
      emailBody: parsedContent.emailBody || "",
      linkedInDM: parsedContent.linkedInDM || "",
      followUpEmail: parsedContent.followUpEmail || "",
    };

    if (!emailData.subject || !emailData.emailBody) {
      return res
        .status(500)
        .json({ message: "Incomplete email data generated" });
    }

    // 4. Save to database
    const emailHistory = await EmailHistory.create({
      user: req.user._id,
      prompt: prompt.trim(),
      subject: emailData.subject,
      emailBody: emailData.emailBody,
      linkedInDM: emailData.linkedInDM,
      followUpEmail: emailData.followUpEmail,
    });

    // 5. Send successful response
    return res.status(200).json({
      message: "Email generated successfully",
      emailHistory,
    });
  } catch (err) {
    console.error("Groq Generation Error:", err.response?.data || err.message);
    return res.status(500).json({
      message: "Error generating email",
      error: err.response?.data?.error?.message || err.message,
    });
  }
};

export const getHistory = async (req , res) => {
  try{
    const history = await EmailHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ message: "Email history fetched successfully", history });
  }catch(err){
    return res.status(500).json({ message: "Error fetching email history", error: err.message });
  }
}

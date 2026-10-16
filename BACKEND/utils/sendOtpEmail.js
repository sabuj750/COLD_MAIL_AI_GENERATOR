import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const sendOtpEmail = async ({ to, subject, text }) => {
  const { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } = process.env;

  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
    throw new Error("Brevo email settings are missing");
  }

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: BREVO_SENDER_NAME || "AI Cold Mail Generator",
        email: BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      textContent: text,
    },
    {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
};

export default sendOtpEmail;

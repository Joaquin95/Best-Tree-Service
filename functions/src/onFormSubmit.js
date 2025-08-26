import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import sgMail from "@sendgrid/mail";
import cors from "cors";

initializeApp();

const corsHandler = cors({
  origin: ["http://localhost:3000", "https://best-tree-service.vercel.app"],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});


export const onFormSubmit = onRequest(
  { region: "us-central1"},
  async (req, res) => {
    await new Promise((resolve, reject) =>
      corsHandler(req, res, (err) => (err ? reject(err) : resolve()))
    );
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      console.error("Missing SendGrid key");
      return res.status(500).json({ error: "Server misconfiguration" });
    }


    try {
      sgMail.setApiKey(sendgridApiKey);
      await sgMail.send({
        to: process.env.SENDGRID_SMS_GATEWAY,
        from: "Mintinvestments95@gmail.com",
        subject: "New Estimate Request",
        text: JSON.stringify(req.body, null, 2),
      });

      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Email send error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

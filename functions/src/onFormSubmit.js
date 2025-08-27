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
  { region: "us-central1" },
  async (req, res) => {
    await new Promise((resolve, reject) =>
      corsHandler(req, res, (err) => (err ? reject(err) : resolve()))
    );
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const smsGateway = process.env.SENDGRID_SMS_GATEWAY;

    if (!sendgridApiKey || !smsGateway) {
      console.error("❌ Missing required env vars", {
        SENDGRID_API_KEY: !!sendgridApiKey,
        SENDGRID_SMS_GATEWAY: !!smsGateway,
      });
      return res.status(500).json({ error: "Server misconfiguration" });
    }
    console.log("🔑 SG key present?", !!sendgridApiKey);
    sgMail.setApiKey(sendgridApiKey);
    console.log("📱 SMS gateway:", smsGateway);
    // 3) Send the message
    try {
      const [response] = await sgMail.send({
        to: smsGateway,
        from: "Joaquinmorales5613@gmail.com",
        subject: "New Estimate Request J.M",
        text: "Hello, you have a new estimate request. Details:",
      });
      console.log("SendGrid 202 status:", response.statusCode);
      console.log("SG headers:", response.headers);

      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Email send error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

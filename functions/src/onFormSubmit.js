import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import sgMail from "@sendgrid/mail";
import cors from "cors";
import * as functions from "firebase-functions";

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

   const sendgridApiKey = functions.config().sendgrid.apikey;

    if (!sendgridApiKey) {
      console.error("❌ Missing sendgrid.apikey in functions config");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: no API key set" });
    }


    console.log("SG key present:", !!sendgridApiKey);
    sgMail.setApiKey(sendgridApiKey);

    // 2) Validate recipient (your SMS gateway / email)
  const smsGateway     = functions.config().sendgrid.sms_gateway;

    if (!smsGateway) {
      console.error("❌ Missing SENDGRID_SMS_GATEWAY");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: no recipient set" });
    }
    console.log("📨  Will send SMS-gateway email  to:", smsGateway);

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

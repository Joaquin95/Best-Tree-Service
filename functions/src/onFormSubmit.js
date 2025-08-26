import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import fetch from "node-fetch";
import sgMail from "@sendgrid/mail";
import cors from "cors";

initializeApp();

const corsHandler = cors({
  origin: ["http://localhost:3000", "https://best-tree-service.vercel.app"],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});

const SENDGRID_KEY = defineSecret("SENDGRID_API_KEY");
const RECAPTCHA_KEY = defineSecret("RECAPTCHA_SECRET");

export const onFormSubmit = onRequest(
  {
    region: "us-central1",
    secrets: [SENDGRID_KEY, RECAPTCHA_KEY],
  },
  async (req, res) => {
    // 1) Run CORS on every request to inject Access-Control-Allow-Origin, etc.
    await new Promise((resolve, reject) =>
      corsHandler(req, res, (err) => (err ? reject(err) : resolve()))
    );
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    const sendgridApiKey = SENDGRID_KEY.value();
    const recaptchaSecret = RECAPTCHA_KEY.value();
    if (!sendgridApiKey || !recaptchaSecret) {
      console.error("Missing secrets");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    try {
      // 1) Verify reCAPTCHA
      const verify = await fetch(
        `https://www.google.com/recaptcha/api/siteverify` +
          `?secret=${recaptchaSecret}` +
          `&response=${req.body.recaptchaToken}`,
        { method: "POST" }
      );
      const vJson = await verify.json();
      if (!vJson.success) {
        console.warn("reCAPTCHA failed", vJson);
        return res.status(403).json({ error: "reCAPTCHA failed" });
      }

      // 2) Send email
      sgMail.setApiKey(sendgridApiKey);
      await sgMail.send({
        to: process.env.SENDGRID_SMS_GATEWAY,
        from: "Mintinvestments95@gmail.com",
        subject: "New Estimate quote J.M",
        text: JSON.stringify(req.body, null, 2),
      });

      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Submission error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

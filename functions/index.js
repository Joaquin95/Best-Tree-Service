import "dotenv/config";
import fetch from "node-fetch";
import { onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import sgMail from "@sendgrid/mail";

initializeApp();

export const onFormSubmit = onCall(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "256MB",
    secrets: ["SENDGRID_APIKEY", "SENDGRID_SMS_GATEWAY", "RECAPTCHA_SECRET"],
  },
  async (data, context) => {
    const APIKEY = process.env.SENDGRID_APIKEY;
    const SMS_GATEWAY = process.env.SENDGRID_SMS_GATEWAY;
    const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
    const token = data.recaptchaToken;

    if (!APIKEY || !SMS_GATEWAY) {
      logger.error("Missing SendGrid secrets", {
        SENDGRID_APIKEY: Boolean(APIKEY),
        SENDGRID_SMS_GATEWAY: Boolean(SMS_GATEWAY),
        RECAPTCHA_SECRET: !!RECAPTCHA_SECRET,
      });
      throw new Error("SendGrid credentials not found in secrets");
    }
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`,
      { method: "POST" }
    );
    const verifyJson = await verifyRes.json();

    if (
      !verifyJson.success ||
      (verifyJson.score !== undefined && verifyJson.score < 0.5)
    ) {
      logger.warn("reCAPTCHA failed", verifyJson);
      throw new Error("reCAPTCHA validation failed");
    }

    sgMail.setApiKey(APIKEY);
    logger.info("Form submission received", { data, uid: context.auth?.uid });
    try {
      logger.info("Sending email via SendGrid", {
        to: SMS_GATEWAY,
        from: "Mintinvestments95@gmail.com",
      });
      await sgMail.send({
        to: SMS_GATEWAY,
        from: "Mintinvestments95@gmail.com",
        subject: "New Estimate quote J.M",
        text: `New Estimate quote J.M:\n${JSON.stringify(data, null, 2)}`,
      });
      logger.info("SendGrid message sent successfully");
      return { status: "success" };
    } catch (err) {
      logger.error("SendGrid error", {
        message: err.message,
        stack: err.stack,
      });
      throw new Error("Notification failed");
    }
  }
);

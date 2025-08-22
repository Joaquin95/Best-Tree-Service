/**
 * functions/index.js
 * Option A: v2 SDK with dedicated v2 logger
 */

const { onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2/logger");
require("dotenv").config();

const sgMail           = require("@sendgrid/mail");
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SMS_GATEWAY_EMAIL = process.env.SMS_GATEWAY_EMAIL;

// Immediately fail if critical env vars are missing
if (!SENDGRID_API_KEY || !SMS_GATEWAY_EMAIL) {
  logger.error("Missing required environment variables", {
    SENDGRID_API_KEY: Boolean(SENDGRID_API_KEY),
    SMS_GATEWAY_EMAIL: Boolean(SMS_GATEWAY_EMAIL),
  });
  throw new Error(
    "Environment variables SENDGRID_API_KEY and SMS_GATEWAY_EMAIL are required"
  );
}

// Configure SendGrid
sgMail.setApiKey(SENDGRID_API_KEY);

exports.onFormSubmit = onCall(
  { region: "us-central1", timeoutSeconds: 60 },
  async (data, context) => {
    logger.info("Form submission received", { data, uid: context.auth?.uid });

    // Your business logic here: send email, transform data, queue SMS, etc.
    const msg = {
      to: SMS_GATEWAY_EMAIL,
      from: "no-reply@yourdomain.com",
      subject: "New Lead from Website",
      text: `You have a new lead: ${JSON.stringify(data)}`,
    };

    try {
      await sgMail.send(msg);
      logger.info("Notification email sent successfully");
      return { status: "success" };
    } catch (err) {
      logger.error("Failed to send email", err);
      throw new Error("Notification delivery failed");
    }
  }
);
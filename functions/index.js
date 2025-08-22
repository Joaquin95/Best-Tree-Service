import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SMS_GATEWAY_EMAIL = process.env.SMS_GATEWAY_EMAIL;

if (!SENDGRID_API_KEY || !SMS_GATEWAY_EMAIL) {
  logger.error("Missing required environment variables", {
    SENDGRID_API_KEY: Boolean(SENDGRID_API_KEY),
    SMS_GATEWAY_EMAIL: Boolean(SMS_GATEWAY_EMAIL),
  });
  throw new Error(
    "Environment variables SENDGRID_API_KEY and SMS_GATEWAY_EMAIL are required"
  );
}

sgMail.setApiKey(SENDGRID_API_KEY);

export const onFormSubmit = onCall(
  {
    region: "us-central1",
    timeoutSeconds: 60,
  },
  async (data, context) => {
    logger.info("Form submission received", {
      data,
      uid: context.auth?.uid,
    });

    const msg = {
      to: SMS_GATEWAY_EMAIL,
      from: "Mintinvestments95@gmail.com",
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
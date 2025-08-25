import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import fetch from "node-fetch";
import sgMail from "@sendgrid/mail";

initializeApp();

export const onFormSubmit = functions.https.onCall(async (data, context) => {
  const APIKEY = process.env.SENDGRID_APIKEY;
  const SMS_GATEWAY = process.env.SENDGRID_SMS_GATEWAY;
  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

  const { name, email, phone, address, message, recaptchaToken } = data;

  if (!APIKEY || !SMS_GATEWAY || !RECAPTCHA_SECRET) {
    console.error("Missing SendGrid or reCAPTCHA secrets");
    throw new functions.https.HttpsError("internal", "Server misconfiguration");
  }

  const verifyRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`,
    { method: "POST" }
  );
  const verifyJson = await verifyRes.json();

  if (
    !verifyJson.success ||
    (verifyJson.score !== undefined && verifyJson.score < 0.5)
  ) {
    console.warn("reCAPTCHA failed", verifyJson);
    throw new functions.https.HttpsError(
      "permission-denied",
      "reCAPTCHA failed"
    );
  }

  sgMail.setApiKey(APIKEY);
  try {
    await sgMail.send({
      to: SMS_GATEWAY,
      from: "Mintinvestments95@gmail.com",
      subject: "New Estimate quote J.M",
      text: `New Estimate quote J.M:\n${JSON.stringify(
        { name, email, phone, address, message },
        null,
        2
      )}`,
    });
  } catch (err) {
    console.error("SendGrid error:", err);
    throw new functions.https.HttpsError("internal", "Notification failed");
  }

  return { status: "success" };
});

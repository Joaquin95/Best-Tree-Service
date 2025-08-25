import * as functions from "firebase-functions";
import sgMail from "@sendgrid/mail";


const { apikey, sms_gateway } = functions.config().sendgrid || {};

if (!apikey || !sms_gateway) {
  functions.logger.error("Missing SENDGRID config", { apikey, sms_gateway });
  throw new Error(
    'Run: firebase functions:config:set sendgrid.apikey="…" sendgrid.sms_gateway="…"'
  );
}

sgMail.setApiKey(apikey);

export const onFormSubmit = functions
  .region("us-central1")
  .runWith({ timeoutSeconds: 60 })
  .https.onCall(async (data, context) => {
    functions.logger.info("Form submission received", { data, uid: context.auth?.uid });

    const msg = {
      to: sms_gateway,
      from: "Mintinvestments95@gmail.com",
      subject: "New Lead from Website",
      text: `New lead data:\n${JSON.stringify(data, null, 2)}`,
    };

    try {
      await sgMail.send(msg);
      functions.logger.info("Email sent");
      return { status: "success" };
    } catch (err) {
      functions.logger.error("SendGrid error", err);
      throw new functions.https.HttpsError("internal", "Email delivery failed");
    }
  });
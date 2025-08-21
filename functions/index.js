const functions = require("firebase-functions");
const sgMail   = require("@sendgrid/mail");
const logger   = require("firebase-functions/logger");
require("dotenv").config();  // only for local dev

// Use Firebase config in prod, fallback to .env locally
const sendgridKey = functions.config().sendgrid?.key ||
                    process.env.SENDGRID_API_KEY;
const smsGateway  = functions.config().sms?.gateway  ||
                    process.env.SMS_GATEWAY_EMAIL;

sgMail.setApiKey(sendgridKey);

exports.onFormSubmit = functions
  .region("us-central1")
  .https.onCall(async (data, context) => {
    const { name, email, phone, address, message } = data;

    logger.info("Form submission received", { name, email, phone });

    if (!name || !email || !phone || !address) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "All fields are required"
      );
    }

    // Email alert
    await sgMail.send({
      to:   "Mintinvestments95@gmail.com",
      from: "Mintinvestments95@gmail.com",
      subject: "New Tree Service Quote Request - J.M.",
      text: `Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}
Message: ${message}`,
    });

    // Email-to-SMS alert
    await sgMail.send({
      to:      smsGateway,
      from:    "Mintinvestments95@gmail.com",
      subject: "",
      text:    `New quote: ${name}, ${phone}, ${address} J.M`,
    });

    return { status: "success" };
  });
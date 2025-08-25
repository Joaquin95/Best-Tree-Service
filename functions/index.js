import 'dotenv/config';
import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import sgMail from '@sendgrid/mail';


initializeApp();

export const onFormSubmit = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 60,
    memory: '256MB',
    secrets: ['SENDGRID_APIKEY', 'SENDGRID_SMS_GATEWAY']
  },
  async (data, context) => {
    const APIKEY = process.env.SENDGRID_APIKEY;
    const SMS_GATEWAY = process.env.SENDGRID_SMS_GATEWAY;

    if (!APIKEY || !SMS_GATEWAY) {
      logger.error('Missing SendGrid secrets', {
        SENDGRID_APIKEY: Boolean(APIKEY),
        SENDGRID_SMS_GATEWAY: Boolean(SMS_GATEWAY)
      });
      throw new Error('SendGrid credentials not found in secrets');
    }

    sgMail.setApiKey(APIKEY);
    logger.info('Form submission received', { data, uid: context.auth?.uid });

    try {
      await sgMail.send({
        to: SMS_GATEWAY,
        from: 'Mintinvestments95@gmail.com',
        subject: 'New Estimate quote J.M',
        text: `New Estimate quote J.M:\n${JSON.stringify(data, null, 2)}`
      });
      logger.info('SendGrid message sent successfully');
      return { status: 'success' };
    } catch (err) {
      logger.error('SendGrid error', err);
      throw new Error('Notification failed');
    }
  }
);

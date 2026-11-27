const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
    });
  }
  return transporter;
};

/**
 * Sends an email through Brevo's API if configured, else SMTP. With neither:
 *  - the message is only printed to the server console (nothing is sent)
 * Returns { delivered: boolean }.
 */
const sendViaBrevo = async ({ to, subject, text }) => {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': config.brevo.apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: config.brevo.senderName, email: config.brevo.senderEmail },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Brevo API error ${res.status}: ${detail.slice(0, 300)}`);
  }
};

const sendMail = async ({ to, subject, text }) => {
  if (config.brevoConfigured) {
    await sendViaBrevo({ to, subject, text });
    return { delivered: true };
  }
  if (!config.smtpConfigured) {
    console.log(`\n[mail:dev] To: ${to}\n[mail:dev] Subject: ${subject}\n[mail:dev] ${text}\n`);
    return { delivered: false };
  }
  await getTransporter().sendMail({ from: config.smtp.from, to, subject, text });
  return { delivered: true };
};

/** Fire-and-forget notification: a mail problem must never break the API request. */
const notifyQuietly = (to, subject, text) => {
  sendMail({ to, subject, text }).catch((err) => console.warn('[mail] notification failed:', err.message));
};

module.exports = { sendMail, notifyQuietly };

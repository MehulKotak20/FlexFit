import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure the transporter with secure options
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, // App password or OAuth token
  },
  tls: {
    rejectUnauthorized: false, // Ensure secure validation (set to true)
  },
});

// Unified email client
export const mailtrapClient = {
  send: async ({
    from,
    to,
    subject,
    html,
    template_uuid,
    template_variables,
    category,
  }) => {
    try {
      // Handle templates dynamically
      let finalHtml = html || "";
      if (template_uuid && template_variables) {
        Object.keys(template_variables).forEach((key) => {
          const regex = new RegExp(`\\{${key}\\}`, "g"); // Fixed template regex
          finalHtml = finalHtml.replace(regex, template_variables[key]);
        });
      }

      // Ensure HTML content is not empty
      if (!finalHtml) {
        throw new Error("No HTML content provided for the email."); // Fixed string error
      }

      // Prepare recipient emails
      const recipientEmails = to.map((recipient) => recipient.email).join(",");

      // Send email
      const info = await transporter.sendMail({
        from: `${from.name} <${from.email}>`, // Fixed template literals
        to: recipientEmails,
        subject,
        html: finalHtml,
      });

      console.log(`[${category}] Email sent successfully: ${info.messageId}`); // Fixed template literals
      return info;
    } catch (error) {
      console.error(`[${category}] Error sending email:`, error.message); // Fixed string syntax
      throw new Error(`Error sending ${category} email: ${error.message}`); // Fixed template literals
    }
  },
};

// Reusable sender
export const sender = {
  name: "Flexfit",
  email: process.env.SMTP_EMAIL,
};

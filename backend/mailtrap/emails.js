import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
  } from "./emailTemplates.js";
  import { mailtrapClient, sender } from "./nodemailer.config.js";
  
  // Send verification email
  export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];
  
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Verify Your Email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace(
          "{verificationCode}",
          verificationToken
        ),
        category: "Email Verification",
      });
  
      console.log("Verification email sent successfully:", response);
    } catch (error) {
      console.error("Error sending verification email:", error.message);
      throw new Error("Failed to send verification email");
    }
  };
  
  // Send welcome email
  export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];
  
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Welcome to Flexfit!",
        html:WELCOME_EMAIL_TEMPLATE,
        category: "Welcome Email",
      });
  
      console.log("Welcome email sent successfully:", response);
    } catch (error) {
      console.error("Error sending welcome email:", error.message);
      throw new Error("Failed to send welcome email");
    }
  };
  
  // Send password reset email
  export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];
  
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Reset Your Password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        category: "Password Reset",
      });
  
      console.log("Password reset email sent successfully:", response);
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      throw new Error("Failed to send password reset email");
    }
  };
  
  // Send password reset success email
  export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];
  
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Password Reset Successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        category: "Password Reset Success",
      });
  
      console.log("Password reset success email sent successfully:", response);
    } catch (error) {
      console.error("Error sending password reset success email:", error.message);
      throw new Error("Failed to send password reset success email");
    }
  };
  
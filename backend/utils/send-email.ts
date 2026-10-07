import nodemailer from "nodemailer";

const createTransporter = () => {
  const user = process.env.USER_EMAIL;
  const pass = process.env.USER_PASSWORD?.replace(/\s+/g, "");

  if (!user || !pass) {
    throw new Error("USER_EMAIL and USER_PASSWORD are required for email sending");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
};

export const sendPasswordResetOtp = async (
  to: string,
  otp: string,
): Promise<void> => {
  const from = process.env.USER_EMAIL;

  if (!from) {
    throw new Error("USER_EMAIL is not configured");
  }

  const transporter = createTransporter();

  await transporter.verify();

  await transporter.sendMail({
    from,
    to,
    subject: "Todo App password reset code",
    text: `Your Todo App password reset code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
        <h2 style="margin:0 0 12px">Reset your Todo password</h2>
        <p style="color:#475569">Use the one-time code below to continue:</p>
        <div style="margin:24px 0;padding:18px;border-radius:14px;background:#f1f5f9;text-align:center;font-size:32px;font-weight:800;letter-spacing:8px">
          ${otp}
        </div>
        <p style="color:#64748b">This code expires in 10 minutes. If you did not request a password reset, you can ignore this email.</p>
      </div>
    `,
  });
};

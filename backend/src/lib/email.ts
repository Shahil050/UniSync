import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

export async function sendVerificationEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your UniSync email",
    text: `Click the link below to verify your account. It expires in 24 hours.\n\n${verifyUrl}`,
    html: `
      <p>Click the button below to verify your UniSync account.</p>
      <p>This link expires in <strong>24 hours</strong>.</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;border-radius:6px;text-decoration:none;">
        Verify email
      </a>
      <p>Or copy this URL into your browser:<br/>${verifyUrl}</p>
    `,
  });
}
import nodemailer from "nodemailer";
import { getEnv } from "./env";

type MailBody = {
  from: string;
  to: string;
  name: string;
  subject: string;
  message: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: getEnv("MAIL_USER"),
    pass: getEnv("MAIL_PASS")
  }
});

export const sendMail = async (mail: MailBody) => {
  const sended = await transporter.sendMail({
    from: `${mail.name} <${mail.from}>`,
    to: mail.to,
    subject: mail.subject,
    text: mail.message
  });

  return sended;
};

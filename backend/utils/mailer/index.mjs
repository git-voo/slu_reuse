import nodemailer from "nodemailer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const sendMail = async (receiver, subject, message) => {
  if (!receiver || typeof receiver !== "object" || !receiver.email) {
    return {
      status: 400,
      message:
        "Invalid receiver. An object with a valid email property is required."
    }
  }

  if (!subject || typeof subject !== "string") {
    return {
      status: 400,
      message: "Subject is required and must be a string."
    }
  }

  if (!message || typeof message !== "string") {
    return {
      status: 400,
      message: "Message body is required and must be a string."
    }
  }

  const templatepath = path.join(__dirname, "template.html")
  let htmlTemplate = fs.readFileSync(templatepath, "utf-8")

  htmlTemplate = htmlTemplate.replace("{{userName}}", receiver?.name ?? "User")
  htmlTemplate = htmlTemplate.replace("{{subject}}", subject)
  htmlTemplate = htmlTemplate.replace("{{messageBody}}", message)

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SLU_REUSE_SUPPORT_EMAIL,
        pass: process.env.SLU_REUSE_SUPPORT_EMAIL_PASSWORD
      }
    })

    const mailOptions = {
      from: process.env.SLU_REUSE_SUPPORT_EMAIL,
      to: receiver.email,
      subject,
      html: htmlTemplate
    }

    const info = await transporter.sendMail(mailOptions) 
    return { status: 200, message: info.response }
  } catch (error) {
    return { status: error.status ?? 500, message: error.toString() }
  }
}

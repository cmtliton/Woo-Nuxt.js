import * as nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, message: "Method not allowed" });
  }

  try {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    if (!body.name || !body.phone || !body.message) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields",
      });
    }

    const recipientEmail = "emcfurnitureengineering@gmail.com";
    const brandColor = "#3b2822"; // EMC Furniture Brown

    // উন্নত মানের HTML ইমেল ডিজাইন
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .header { background-color: ${brandColor}; color: #ffffff; padding: 30px; text-align: center; }
    .header h2 { margin: 0; letter-spacing: 2px; text-transform: uppercase; font-size: 22px; }
    .content { padding: 30px; background-color: #ffffff; }
    .section { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0; }
    .section-title { font-weight: bold; color: ${brandColor}; margin-bottom: 12px; font-size: 16px; text-transform: uppercase; }
    .info-row { margin: 8px 0; font-size: 15px; }
    .info-label { font-weight: bold; color: #666; width: 100px; display: inline-block; }
    .message-box { background-color: #f9f6f5; padding: 15px; border-radius: 8px; border-left: 4px solid ${brandColor}; margin-top: 10px; font-style: italic; }
    .footer { background-color: #f4f4f4; color: #888; padding: 15px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Project Inquiry Received</h2>
      <p style="margin-top:10px; opacity:0.8;">EMC Furniture & Engineering</p>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-title">Client Details</div>
        <div class="info-row"><span class="info-label">Name:</span> ${body.name}</div>
        <div class="info-row"><span class="info-label">Phone:</span> ${body.phone}</div>
        <div class="info-row"><span class="info-label">Subject:</span> ${body.subject || "No Subject"}</div>
        <div class="info-row"><span class="info-label">Source:</span> Website Contact Form</div>
      </div>
      
      <div class="section">
        <div class="section-title">Requirements / Message</div>
        <div class="message-box">
          ${body.message.replace(/\n/g, "<br>")}
        </div>
      </div>
      
      <div style="font-size: 13px; color: #999; text-align: right;">
        Inquiry Date: ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}
      </div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} EMC Furniture & Engineering | Savar, Dhaka.
    </div>
  </div>
</body>
</html>
    `.trim();

    // Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: config.smtpHost || "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });

    await transporter.sendMail({
      from: `"EMC Web Inquiry" <${config.smtpUser}>`,
      to: recipientEmail,
      subject: `New Inquiry: ${body.subject || body.name}`,
      html: emailHtml,
    });

    return { success: true, message: "Inquiry sent successfully" };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Email system error",
    });
  }
});

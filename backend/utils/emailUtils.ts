import nodemailer from 'nodemailer';
import { 
    SMTP_HOST, 
    SMTP_PORT, 
    SMTP_USER, 
    SMTP_PASS, 
    EMAIL_FROM 
} from '../config/env';

export const sendQuoteEmail = async (
    toEmail: string,
    toName: string,
    quoteUrl: string,
    destination: string
): Promise<boolean> => {
    if (!SMTP_USER || !SMTP_PASS) {
        console.warn('[emailUtils] SMTP credentials missing. Falling back to console logging.');
        console.log('\n[MOCK EMAIL]');
        console.log(`To: ${toName} <${toEmail}>`);
        console.log(`Subject: Your customized trip to ${destination} is ready!`);
        console.log(`Link: ${quoteUrl}\n`);
        return true;
    }

    // Create a transporter using fixed SMTP names
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT),
        secure: SMTP_PORT === '465', // true for 465, false for 587
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    const htmlBody = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Your VoyageGen Quote</title>
        <style>
          body { margin: 0; padding: 0; background: #09090b; font-family: 'Segoe UI', Arial, sans-serif; }
          .wrapper { max-width: 600px; margin: 40px auto; background: #18181b; border-radius: 20px; overflow: hidden; border: 1px solid #27272a; }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 40px 32px; text-align: center; }
          .header h1 { margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
          .body { padding: 36px 32px; }
          .greeting { color: #f4f4f5; font-size: 18px; font-weight: 600; margin: 0 0 12px; }
          .text { color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 28px; }
          .highlight { background: #101312; border: 1px solid #10b981; border-radius: 12px; padding: 20px 24px; margin: 0 0 28px; }
          .highlight p { margin: 0; color: #6ee7b7; font-size: 14px; font-weight: 500; }
          .highlight span { font-weight: 700; color: #10b981; font-size: 16px; }
          .btn { display: block; width: fit-content; margin: 0 auto 32px; background: linear-gradient(135deg, #10b981, #059669); color: #000 !important; text-decoration: none; font-weight: 800; font-size: 16px; padding: 16px 40px; border-radius: 12px; letter-spacing: 0.3px; }
          .footer { border-top: 1px solid #27272a; padding: 20px 32px; text-align: center; }
          .footer p { margin: 0; color: #52525b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>&#9992;&#65039; VoyageGen</h1>
            <p>Premium Travel Quotation</p>
          </div>
          <div class="body">
            <p class="greeting">Hi ${toName},</p>
            <p class="text">
              Great news! Your personalized travel quote for <strong style="color:#f4f4f5">${destination}</strong> is ready.
              Our travel expert has crafted a custom itinerary just for you.
            </p>
            <div class="highlight">
              <p>&#128205; Destination: <span>${destination}</span></p>
            </div>
            <p class="text">Click the button below to view your full quote, including the detailed itinerary, pricing, and booking options.</p>
            <a href="${quoteUrl}" class="btn">View My Quote</a>
            <p class="text" style="font-size:13px; margin-top: 16px;">
              Or copy this link: <a href="${quoteUrl}" style="color:#10b981;">${quoteUrl}</a>
            </p>
          </div>
          <div class="footer">
            <p>&#169; ${new Date().getFullYear()} VoyageGen &mdash; All rights reserved</p>
            <p style="margin-top:6px;">You received this because a travel agent shared a quote with you.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
        await transporter.sendMail({
            from: EMAIL_FROM || `"VoyageGen" <${SMTP_USER}>`,
            to: toEmail,
            subject: `Your customized trip to ${destination} is ready! ✈️`,
            html: htmlBody,
        });

        console.log(`[emailUtils] Email sent successfully to ${toEmail}`);
        return true;
    } catch (err) {
        console.error('[emailUtils] Error sending email:', err);
        return false;
    }
};

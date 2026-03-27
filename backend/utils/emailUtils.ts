import Mailjet from 'node-mailjet';
import { MAILJET_API_KEY, MAILJET_API_SECRET } from '../config/env';

// Initialize Mailjet client if keys are present
const mailjet = (MAILJET_API_KEY && MAILJET_API_SECRET) 
    ? new Mailjet({ apiKey: MAILJET_API_KEY, apiSecret: MAILJET_API_SECRET }) 
    : null;

export const sendQuoteEmail = async (
    toEmail: string, 
    toName: string, 
    quoteUrl: string, 
    destination: string
) => {
    if (!mailjet) {
        console.warn('⚠️ Mailjet API keys are missing in .env. Falling back to console logging.');
        console.log(`\n📧 [MOCK EMAIL]`);
        console.log(`To: ${toName} <${toEmail}>`);
        console.log(`Subject: Your customized trip to ${destination} is ready!`);
        console.log(`Body: Hello ${toName}, your curated quote for ${destination} is ready. View it here: ${quoteUrl}\n`);
        return true;
    }

    try {
        const request = await mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "noreply@voyagegen.com", // Replace with your verified sender email in Mailjet
                            Name: "VoyageGen"
                        },
                        To: [
                            {
                                Email: toEmail,
                                Name: toName
                            }
                        ],
                        Subject: `Your customized trip to ${destination} is ready!`,
                        TextPart: `Hello ${toName},\n\nYour curated quote for your trip to ${destination} is ready! Please review it by clicking the link below:\n\n${quoteUrl}\n\nBest,\nThe VoyageGen Team`,
                        HTMLPart: `
                            <div style="font-family: sans-serif; max-w-lg mx-auto p-6 bg-gray-50 text-gray-800">
                                <h2>Hello ${toName},</h2>
                                <p>Your curated itinerary and travel quote for <strong>${destination}</strong> is ready for your review!</p>
                                <br/>
                                <a href="${quoteUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View Your Quote</a>
                                <br/><br/>
                                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                                <p><a href="${quoteUrl}">${quoteUrl}</a></p>
                                <br/>
                                <p>Best regards,<br/><strong>The VoyageGen Team</strong></p>
                            </div>
                        `
                    }
                ]
            });

        console.log('✅ Email sent successfully via Mailjet:', request.body);
        return true;
    } catch (error) {
        console.error('❌ Error sending email via Mailjet:', error);
        throw new Error('Failed to send email');
    }
};

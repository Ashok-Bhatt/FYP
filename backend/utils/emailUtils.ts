import { WEB3FORMS_ACCESS_KEY } from '../config/env';

export const sendQuoteEmail = async (
    toEmail: string,
    toName: string,
    quoteUrl: string,
    destination: string
): Promise<boolean> => {
    if (!WEB3FORMS_ACCESS_KEY) {
        console.warn('Web3Forms access key is missing in .env. Falling back to console logging.');
        console.log('\n[MOCK EMAIL]');
        console.log(`To: ${toName} <${toEmail}>`);
        console.log(`Subject: Your customized trip to ${destination} is ready!`);
        console.log(`Body: Hello ${toName}, your curated quote for ${destination} is ready. View it here: ${quoteUrl}\n`);
        return true;
    }

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                name: 'VoyageGen Team',
                from_name: 'VoyageGen',
                email: 'noreply@voyagegen.com',
                subject: `Your customized trip to ${destination} is ready!`,
                message: `Hello ${toName},\n\nYour curated quote for your trip to ${destination} is ready! Please review it by clicking the link below:\n\n${quoteUrl}\n\nBest,\nThe VoyageGen Team`,
                recipient_email: toEmail,
                quote_link: quoteUrl,
                destination,
            }),
        });

        const rawBody = await response.text();
        let result: { success?: boolean; message?: string } | null = null;

        try {
            result = JSON.parse(rawBody) as { success?: boolean; message?: string };
        } catch {
            console.error('Web3Forms returned a non-JSON response:', rawBody.slice(0, 200));
            return false;
        }

        if (response.ok && result.success) {
            console.log('Email sent successfully via Web3Forms');
            return true;
        }

        console.error('Web3Forms API error:', {
            status: response.status,
            message: result.message || 'Unknown Web3Forms error',
        });
        return false;
    } catch (error) {
        console.error('Error sending email via Web3Forms:', error);
        return false;
    }
};

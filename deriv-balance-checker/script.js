const appId = 63379;  // Deriv App ID
const redirectUri = window.location.href.split('?')[0];  // Current URL without query parameters

document.getElementById('authorize').addEventListener('click', () => {
    const authUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${appId}&l=EN&brand=deriv&redirect_uri=${redirectUri}`;
    window.location.href = authUrl;
});

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
    fetchBalance(token);
}

function fetchBalance(apiToken) {
    const ws = new WebSocket(`wss://frontend.binaryws.com/websockets/v3?app_id=${appId}`);

    ws.onopen = () => {
        console.log('Connected to the Deriv WebSocket API');
        ws.send(JSON.stringify({ "authorize": apiToken }));
    };

    ws.onmessage = (message) => {
        const data = JSON.parse(message.data);

        if (data.msg_type === 'authorize') {
            console.log('Authorization successful');
            ws.send(JSON.stringify({ "balance": 1 }));
        }

        if (data.msg_type === 'balance') {
            const balance = data.balance;
            document.getElementById('balance').textContent = `Balance: ${balance.balance} ${balance.currency}`;
            document.getElementById('account-type').textContent = `Account Type: ${balance.type}`;
        }

        if (data.error) {
            console.error('Error:', data.error.message);
            document.getElementById('balance').textContent = `Error: ${data.error.message}`;
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from the Deriv WebSocket API');
    };
}

document.getElementById('authorize-button').addEventListener('click', function() {
    // Redirect to Deriv OAuth authorization page
    window.location.href = 'https://api.deriv.com/oauth2/authorize?response_type=token&client_id=YOUR_CLIENT_ID&redirect_uri=https://tonnierich.github.io/deriv-balance-checker/';
});

// Function to extract the access token from the URL fragment
function getAccessToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}

// Function to fetch and display balance information
function fetchBalance() {
    const accessToken = getAccessToken();
    if (accessToken) {
        fetch('https://api.deriv.com/api/v1/account/balance', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('balance').innerText = `Balance: $${data.balance}`;
        })
        .catch(error => console.error('Error fetching balance:', error));
    }
}

// Fetch and display balance on page load if access token is present
window.onload = function() {
    fetchBalance();
};

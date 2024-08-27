let userInfo, auth;
const eventLog = [];

document.getElementById('loginform').addEventListener('submit', async function (event) {
    event.preventDefault();
    try {
        const userData = await login(event);

        if (userData?.error) {
            alert('Error when logging in, please try again.');
            return;
        }

        // Extract authorization header and username
        auth = userData?.data?.token;
        userInfo = userData?.data?.name;

        // Hide login form and show listener
        document.getElementById('loginform').style.display = 'none';
        document.getElementById('listener').style.display = 'block';

        // Start fetching events
        fetchEvents(lastRoomEventId, auth)
    } catch (error) {
        console.error('something went wrong: ', error);
    }
});

// Function to handle login
async function login() {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const timestamp = new Date().getTime();

    const requestBody = {
        provider: 'integrated',
        userId: username,
        password: password,
        state: {
            provider: 'integrated',
            id: '',
            clientObjectId: '',
            timestamp: timestamp
        }
    };

    try {
        const response = await fetch('http://localhost:9452/server/api/v3/login', {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        return await response.json();

    } catch (error) {
        console.error('something went wrong: ', error);
    }
}

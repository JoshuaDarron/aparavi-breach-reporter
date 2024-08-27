let userInfo, auth;
const eventLog = [];

const getToken = () => localStorage.getItem('auth');

document.getElementById('loginButton').addEventListener('click', async function (event) {
    event.preventDefault();
    try {
        const userData = await login(event);

        if (userData?.error) {
            alert('Error when logging in, please try again.');
        }

        // Extract authorization header and username
        auth = userData?.data?.token;
        userInfo = userData?.data?.name;

        // Hide login form and show listener
        document.getElementById('loginPage').classList.add('pageHidden');
        document.getElementById('homePage').classList.remove('pageHidden');

        localStorage.setItem('auth', auth);
    } catch (error) {
        console.error('something went wrong: ', error);
    }
});

// Function to handle login
async function login() {
    const username = document.getElementById('loginInputs1').value;
    const password = document.getElementById('loginInputs2').value;

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
        const response = await fetch('http://localhost:3000/server/api/v3/login', {
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
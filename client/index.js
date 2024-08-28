let userInfo, auth, nodeId;
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
        nodeId = userData?.data?.homeId;

        // Get potential nodes the user can select and their respective classifications
        const children = await getChildren(nodeId, auth)
        const classifications = await getClassifications(auth)

        // Hide login form and show home page
        document.getElementById('loginform').style.display = 'none';
        document.getElementById('home').style.display = 'block';


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

// Function to fetch children
async function getChildren(node, authorization) {
    const nodeTypes = ['appagt', 'agent', 'appliance'] // Are these the right classIds?
    let children = []
    try {
        const response = await fetch(`http://localhost:9452/server/api/v3/database/children?parentId=${node}&%7B%22containersOnly%22:true,%22recursive%22:false%7D`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': '*/*',
                'Authorization': authorization 
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data?.data?.objects) {
                for (let child of data.data.objects) {
                    if (nodeTypes.includes(child.classId)) {
                        children.push(child)
                    }
                }
            }
        }
        
        return children;

    } catch (error) {
        console.error('something went wrong when fetching children')
    }
}

// Function to get classification info
async function getClassifications(objectId, authorization) {
    try {
        const response = await fetch(`http://localhost:9452/server/api/v3/database/property?objectId=${objectId}&propertyId=PID_POLICY&options=%7B%7D`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': '*/*',
                'Authorization': authorization 
            }
        });

        return await response.json();

    } catch (error) {
        console.error('something went wrong when fetching classifications')
    }

}

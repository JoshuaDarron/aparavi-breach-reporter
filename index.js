let userInfo, auth, nodeId, nodeName, children, classifications;

let childrenMap = {};
let activeChild = '';

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
        nodeId = userData?.data?.homeId;

        // Hide login form and show listener
        document.getElementById('loginPage').classList.add('pageHidden');
        document.getElementById('homePage').classList.remove('pageHidden');

        children = await getChildren(nodeId, getToken());

        console.log('children', children);

        localStorage.setItem('auth', auth);
    } catch (error) {
        console.error('something went wrong: ', error);
    }
});

const childSelector = document.getElementById("childSelect");

document.getElementById('submitButton').addEventListener('click', async function (event) {
    event.preventDefault();
    try {
        const contentDiv = document.getElementById('content-id');
        contentDiv.innerHTML = '';
        const classificationsResponse = await getClassifications(childSelector.value, getToken());
        classifications = classificationsResponse;

        let requestContent = await searchRequest();

        let requestTitle = childrenMap[childSelector.value];

        const response = await fetch('http://localhost:8081/report', {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: requestTitle, content: requestContent })
        });

        const res = await response.json();
        console.log(res);
        
        
        contentDiv.innerHTML = res.content;
        
    } catch (error) {
        console.error('something went wrong: ', error);
    }
});


childSelector.addEventListener('change', async function (event) {
    activeChild = childSelector.value
    const classificationsResponse = await getClassifications(childSelector.value, getToken());
    classifications = classificationsResponse;
    console.log('classificationsResponse', classificationsResponse);
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

        children.forEach((child, index) => {
            if (index === 0) {
                activeChild = child.objectId;
            }
            childrenMap[child.objectId] = child.name;
            let option = document.createElement("option");
            option.text = child.name;
            option.value = child.objectId;
            var select = document.getElementById("childSelect");
            select.appendChild(option);
        });
        
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

        let foo = await response.json();
        let classificationsInherited = foo.data.classifications.inherited;
        if (classificationsInherited) {
            return foo.data.classifications.inheritedValues.classifications;
        }
        return foo.data.classifications.values.classifications;

    } catch (error) {
        console.error('something went wrong when fetching classifications')
    }
}

async function getClassificationHitCount(authorization) {

    const requestBody = {
        select: 'SELECT classificationHitRule;',
        options: {
            appendAdditionalColumnsFromQuery: false,
            objectLimit: 25000
        }
    };

    try {
        const response = await fetch(`http://localhost:9452/server/api/v3/database/query`, {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Content-Type': 'application/json',
                'Authorization': authorization 
            },
            body: JSON.stringify(requestBody)

        });

        return await response.json();

    } catch (error) {
        console.error('something went wrong when fetching classification hit count')
    }

}

const searchRequest = async () => {
    let subString = '';
    classifications.forEach((classification, index) => {
        if (index + 1 === classifications.length) {
            subString = subString + `'${classification.name}'`
        } else {
            subString = subString + `'${classification.name}', `
        }
    })

    console.log(classifications.map(el => el.name));

    const requestBody = {
        // "select": `SET @@DEFAULT_COLUMNS=objectId,instanceId,classId,parentPath,name,size,createTime,modifyTime,service,metadataObject,isDeleted,classification;SET @@ADD_DEFAULT_COLUMNS=TRUE;\nSET @@DISABLE_AGGREGATION=TRUE;\nSELECT name,classification FROM STORE('/${childrenMap[childSelector.value]}/')  WHERE (classification IN (${subString})) ORDER BY name,objectId,instanceId`,
        "select": `SELECT classification, name FROM STORE('/${childrenMap[childSelector.value]}/') WHERE (classification IN (${subString}));`,
        "options": {
            "objectLimit": 25000
        }
    }

    
    try {
        const response = await fetch(`http://localhost:9452/server/api/v3/database/query`, {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Content-Type': 'application/json',
                'Authorization': getToken()
            },
            body: JSON.stringify(requestBody)
        });

        let foobarbaz = await response.json();

        let list1 = foobarbaz.data.objects;

        let totals = {

        };

        list1.forEach(
            classification => {
                if (totals[classification.classification]) {
                    totals[classification.classification] = totals[classification.classification] + 1;
                } else {
                    totals[classification.classification] = 1;
                }
            }
        );

        console.log('totals', totals);

        return totals;
    } catch(err) {
        console.error(err)
    }
}
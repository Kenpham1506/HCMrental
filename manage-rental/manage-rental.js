const CLIENT_ID = '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com';
const SHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';
const SCRIPT_URL = 'YOUR_DEPLOYED_SCRIPT_URL'; // Replace with your deployed Google Apps Script web app URL

let auth2;
let userEmail;

function initClient() {
    gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: CLIENT_ID
        }).then(() => {
            auth2 = gapi.auth2.getAuthInstance();
            auth2.isSignedIn.listen(updateSigninStatus);
        });
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        const user = auth2.currentUser.get();
        userEmail = user.getBasicProfile().getEmail();
        fetchUserProperties();
    }
}

function onSignIn(googleUser) {
    userEmail = googleUser.getBasicProfile().getEmail();
    fetchUserProperties();
}

function fetchUserProperties() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const properties = data.values;
            const userProperties = properties.filter(row => row[7] === userEmail); // Assuming email is in column 8 (index 7)
            displayProperties(userProperties);
        })
        .catch(error => console.error('Error fetching properties:', error));
}

function displayProperties(properties) {
    const propertyList = document.getElementById('property-list');
    propertyList.innerHTML = '';

    properties.forEach((property, index) => {
        const [name, address, price, imageUrl, description, host, phone, email, district, activeDate] = property;
        const propertyDiv = document.createElement('div');
        propertyDiv.classList.add('property');

        propertyDiv.innerHTML = `
            <h3>${name || 'No name'}</h3>
            <p><strong>Address:</strong> ${address || 'No address'}</p>
            <p><strong>Price:</strong> ${price || 'No price'}</p>
            <p><strong>Description:</strong> ${description || 'No description'}</p>
            <p><strong>Host:</strong> ${host || 'No host'}</p>
            <p><strong>Phone:</strong> ${phone || 'No phone'}</p>
            <p><strong>Email:</strong> ${email || 'No email'}</p>
            <img src="${imageUrl || 'https://via.placeholder.com/150'}" alt="${name || 'No name'}">
            <p><strong>Active Date:</strong> ${activeDate || 'No date'}</p>
            <button onclick="editProperty(${index})">Edit</button>
        `;

        propertyList.appendChild(propertyDiv);
    });
}

function editProperty(index) {
    const propertyList = document.getElementById('property-list');
    const propertyForm = document.getElementById('property-form');
    const form = document.getElementById('update-form');
    const propertyName = form.querySelector('#property-name');
    const propertyActiveDate = form.querySelector('#property-active-date');
    const propertyStatus = form.querySelector('#property-status');
    const rentedDateContainer = form.querySelector('#rented-date-container');
    const propertyEndDate = form.querySelector('#property-end-date');
    const propertyIndex = form.querySelector('#property-index');

    propertyList.style.display = 'none';
    propertyForm.style.display = 'block';

    // Load the selected property's data into the form
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const properties = data.values;
            const property = properties[index];
            const [name, , , , , , , , , activeDate] = property;

            propertyName.value = name;
            propertyActiveDate.value = activeDate || '';
            propertyStatus.value = activeDate ? 'Active' : 'Rented';
            propertyEndDate.value = activeDate || '';

            rentedDateContainer.style.display = propertyStatus.value === 'Rented' ? 'block' : 'none';
            propertyIndex.value = index;
        });
}

document.getElementById('update-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const propertyName = document.getElementById('property-name').value;
    const propertyActiveDate = document.getElementById('property-active-date').value;
    const propertyStatus = document.getElementById('property-status').value;
    const propertyEndDate = document.getElementById('property-end-date').value;
    const propertyIndex = document.getElementById('property-index').value;

    const data = {
        index: parseInt(propertyIndex),
        activeDate: propertyStatus === 'Rented' ? propertyEndDate : propertyActiveDate
    };

    fetch(SCRIPT_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        alert('Property updated successfully!');
        document.getElementById('property-form').style.display = 'none';
        document.getElementById('property-list').style.display = 'block';
        fetchUserProperties();
    })
    .catch(error => console.error('Error updating property:', error));
});

document.getElementById('property-status').addEventListener('change', function () {
    const rentedDateContainer = document.getElementById('rented-date-container');
    rentedDateContainer.style.display = this.value === 'Rented' ? 'block' : 'none';
});

// Initialize Google API client
gapi.load('client:auth2', initClient);

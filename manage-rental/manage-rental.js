const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s';
const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';
const RANGE = 'Sheet1!A2:J'; // Adjust range to include the 'Active' column

let userEmail = '';

function handleCredentialResponse(response) {
    const user = response.credential;
    const jwt = parseJwt(user);
    userEmail = jwt.email;
    document.getElementById('sign-out-btn').style.display = 'block';
    fetchRentals();
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    
    return JSON.parse(jsonPayload);
}

function onSignOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        userEmail = '';
        document.getElementById('sign-out-btn').style.display = 'none';
        document.getElementById('rental-list').innerHTML = '';
    });
}

function fetchRentals() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const listings = data.values;
            const userListings = listings.filter(row => row[7] === userEmail); // Assuming column 8 (index 7) is for email
            displayRentals(userListings);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayRentals(rentals) {
    const rentalList = document.getElementById('rental-list');
    rentalList.innerHTML = '';

    rentals.forEach((rental, index) => {
        const [name, address, price, imageUrl, description, host, phoneNumber, email, district, active] = rental;

        const rentalDiv = document.createElement('div');
        rentalDiv.className = 'rental-item';

        rentalDiv.innerHTML = `
            <h2>${name || 'No name'}</h2>
            <p><strong>Address:</strong> ${address || 'No address'}</p>
            <p><strong>Price:</strong> ${price || 'No price'}</p>
            <p><strong>Description:</strong> ${description || 'No description'}</p>
            <p><strong>Host:</strong> ${host || 'No host'}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber || 'No phone number'}</p>
            <p><strong>Email:</strong> <a href="mailto:${email || '#'}">${email || 'No email'}</a></p>
            <img src="${imageUrl || 'https://via.placeholder.com/200'}" alt="${name || 'No name'}" style="width: 200px; height: auto;">
            <p><strong>Status:</strong> <span id="status-${index}"></span></p>
            <button onclick="updateRental(${index})">Update Status</button>
        `;

        rentalList.appendChild(rentalDiv);
        updateStatus(rental[9], index); // Assuming the 'Active' column is at index 9
    });
}

function updateStatus(activeDate, index) {
    const statusElement = document.getElementById(`status-${index}`);
    const now = new Date();
    const activeDateObj = new Date(activeDate);
    const diffDays = Math.ceil((now - activeDateObj) / (1000 * 60 * 60 * 24));

    if (activeDate) {
        if (diffDays <= 7) {
            statusElement.innerHTML = `<span class="dot green"></span> Active`;
        } else if (diffDays <= 30) {
            statusElement.innerHTML = `<span class="dot orange"></span> Pending`;
        } else {
            statusElement.innerHTML = `<span class="dot red"></span> Inactive`;
        }
    } else {
        statusElement.innerHTML = 'No Status';
    }
}

function updateRental(index) {
    const newStatus = prompt('Enter new status: (active/rented)');
    const newDate = prompt('Enter the end date (yyyy-mm-dd) or leave blank for current date');

    if (newStatus) {
        const endDate = newDate || new Date().toISOString().split('T')[0];
        const range = `Sheet1!J${index + 2}`; // Adjust for correct row in Sheet

        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW&key=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [[endDate]],
            }),
        })
        .then(response => response.json())
        .then(() => {
            fetchRentals();
        })
        .catch(error => console.error('Error updating data:', error));
    }
}

// Initialize Google Sign-In
window.onload = function () {
    google.accounts.id.initialize({
        client_id: '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.prompt(); // Show the Google login button
};

document.getElementById('sign-out-btn').addEventListener('click', onSignOut);

const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s';
const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';
const RANGE = 'Sheet1!A2:I'; // Adjust range to include all necessary columns

let userEmail = '';

function initClient() {
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com',
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest"],
            scope: 'https://www.googleapis.com/auth/spreadsheets'
        }).then(() => {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        userEmail = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
        document.getElementById('g_id_signin').style.display = 'none';
        fetchRentals();
    } else {
        document.getElementById('rental-list').innerHTML = '<p>Please sign in to manage your rentals.</p>';
    }
}

function fetchRentals() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rentals = data.values.filter(row => row[7] === userEmail); // Filter by email
            displayRentals(rentals);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayRentals(rentals) {
    const rentalList = document.getElementById('rental-list');
    rentalList.innerHTML = '';

    rentals.forEach((rental, index) => {
        const [name, address, price, imageUrl, description, host, phoneNumber, email, activeDate] = rental;

        const rentalDiv = document.createElement('div');
        rentalDiv.style.border = '1px solid #ddd';
        rentalDiv.style.padding = '10px';
        rentalDiv.style.marginBottom = '10px';

        rentalDiv.innerHTML = `
            <h2>${name || 'No name'}</h2>
            <p><strong>Address:</strong> ${address || 'No address'}</p>
            <p><strong>Price:</strong> ${price || 'No price'}</p>
            <p><strong>Description:</strong> ${description || 'No description'}</p>
            <p><strong>Host:</strong> ${host || 'No host'}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber || 'No phone number'}</p>
            <p><strong>Email:</strong> <a href="mailto:${email || '#'}">${email || 'No email'}</a></p>
            <p><strong>Status:</strong> <span class="status-dot" style="background-color: ${getStatusColor(activeDate)};"></span> ${getStatusText(activeDate)}</p>
            <button onclick="updateRental('${name}', '${activeDate}')">Update Rental</button>
        `;

        rentalList.appendChild(rentalDiv);
    });
}

function getStatusColor(dateString) {
    const today = new Date();
    const activeDate = new Date(dateString);
    const diffDays = Math.ceil((activeDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return 'green';
    if (diffDays <= 30) return 'orange';
    return 'red';
}

function getStatusText(dateString) {
    const today = new Date();
    const activeDate = new Date(dateString);
    const diffDays = Math.ceil((activeDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return 'Active';
    if (diffDays <= 30) return 'Pending';
    return 'Inactive';
}

function updateRental(name, currentActiveDate) {
    const status = prompt('Enter new status ("active" or "rented"):').toLowerCase();
    if (status === 'active') {
        updateActiveDate(name, new Date().toISOString().split('T')[0]); // Set to current date
    } else if (status === 'rented') {
        const endDate = prompt('Enter end date (YYYY-MM-DD):');
        updateActiveDate(name, endDate);
    } else {
        alert('Invalid status. Please enter "active" or "rented".');
    }
}

function updateActiveDate(name, date) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A2:I?key=${API_KEY}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const values = data.values;
            const rowIndex = values.findIndex(row => row[0] === name && row[7] === userEmail) + 2; // Row index in Google Sheets
            const range = `Sheet1!I${rowIndex}`;

            fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
                },
                body: JSON.stringify({ range, values: [[date]] })
            })
                .then(response => response.json())
                .then(() => {
                    alert('Rental updated successfully.');
                    fetchRentals();
                })
                .catch(error => console.error('Error updating data:', error));
        })
        .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', initClient);

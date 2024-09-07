let userEmail = '';

function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);
    userEmail = data.email;

    document.getElementById('status').innerHTML = `Logged in as ${userEmail}`;
    loadUserRentals();  // Load the user's rental properties based on their email
}

async function loadUserRentals() {
    if (!userEmail) {
        document.getElementById('status').innerHTML = 'Please sign in to manage your rentals.';
        return;
    }

    const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s'; // Replace with your actual API key
    const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE'; // Replace with your actual Sheet ID
    const RANGE = 'Sheet1!A2:J'; // Modify this to fit your sheet's structure

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const properties = data.values.filter(property => property[7] === userEmail);  // Filter by email column
        displayUserRentals(properties);
    } catch (error) {
        console.error('Error fetching rental properties:', error);
        document.getElementById('status').innerHTML = 'Error fetching your properties. Please try again later.';
    }
}

function displayUserRentals(properties) {
    const container = document.getElementById('rental-properties');
    container.innerHTML = '';  // Clear any previous listings

    if (properties.length === 0) {
        container.innerHTML = '<p>You have no rental properties.</p>';
        return;
    }

    properties.forEach((property, index) => {
        const [propertyName, address, price, imageUrl, description, host, phone, email, district, activeDate] = property;

        const propertyDiv = document.createElement('div');
        propertyDiv.classList.add('property-item');
        propertyDiv.innerHTML = `
            <h3>${propertyName}</h3>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Price:</strong> ${price}</p>
            <p><strong>Active Date:</strong> ${activeDate || 'Not set'}</p>
            <button onclick="setActiveDate(${index})">Set to Active</button>
            <button onclick="setRented(${index})">Set to Rented</button>
        `;
        container.appendChild(propertyDiv);
    });
}

function setActiveDate(index) {
    updateActiveDate(index, new Date().toISOString().split('T')[0]);  // Set to today's date
}

function setRented(index) {
    const futureDate = prompt('Enter the rental end date (YYYY-MM-DD):');
    if (futureDate) {
        updateActiveDate(index, futureDate);
    }
}

async function updateActiveDate(index, date) {
    const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s';  // Replace with your actual API key
    const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';  // Replace with your actual Sheet ID

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!J${index + 2}?valueInputOption=RAW&key=${API_KEY}`;
    const body = {
        values: [[date]]
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            alert('Rental status updated.');
            loadUserRentals();  // Refresh the user's rentals
        } else {
            console.error('Error updating rental status:', await response.json());
            alert('Failed to update rental status.');
        }
    } catch (error) {
        console.error('Error updating rental status:', error);
        alert('An error occurred while updating rental status.');
    }
}

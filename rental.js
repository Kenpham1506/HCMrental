//hosting on Github doesn't have any way to hide the API key so here it is, insecure code so please don't replicate or abuse it, thank you.
const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s';
const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';
const RANGE = 'Sheet1!A2:I'; // Adjust range to include District column

function getRentalDetails() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const listings = data.values;
            const listing = listings[id];

            displayRentalDetails(listing);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayRentalDetails(listing) {
    if (!listing) {
        document.getElementById('rental-detail').innerHTML = '<p>No details available.</p>';
        return;
    }

    const [name, address, price, imageUrl, description, host, phoneNumber, email, district] = listing;

    const rentalDetailDiv = document.getElementById('rental-detail');
    rentalDetailDiv.innerHTML = `
        <h2>${name || 'No name'}</h2>
        <p><strong>Address:</strong> ${address || 'No address'}</p>
        <p><strong>Price:</strong> ${price || 'No price'}</p>
        <p><strong>Description:</strong> ${description || 'No description'}</p>
        <p><strong>Host:</strong> ${host || 'No host'}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber || 'No phone number'}</p>
        <p><strong>Email:</strong> <a href="mailto:${email || '#'}">${email || 'No email'}</a></p>
        <img src="${imageUrl || 'https://via.placeholder.com/600'}" alt="${name || 'No name'}" style="width: 100%; max-width: 600px; height: auto;">
    `;
}

document.addEventListener('DOMContentLoaded', getRentalDetails);

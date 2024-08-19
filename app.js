// Replace with your Google Sheets API key and Spreadsheet ID
const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s';
const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';
const RANGE = 'Sheet1!A2:E'; // Adjust the range to your needs

function fetchListings() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const listings = data.values;
            displayListings(listings);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayListings(listings) {
    const listingsContainer = document.getElementById('listings');
    listingsContainer.innerHTML = '';

    listings.forEach(listing => {
        const [name, address, price, imageUrl, description] = listing;

        const listingDiv = document.createElement('div');
        listingDiv.className = 'listing';

        listingDiv.innerHTML = `
            <img src="${imageUrl}" alt="${name}">
            <div class="listing-content">
                <h2>${name}</h2>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Price:</strong> ${price}</p>
                <p>${description}</p>
            </div>
        `;

        listingsContainer.appendChild(listingDiv);
    });
}

document.addEventListener('DOMContentLoaded', fetchListings);

const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s'; //Hosting on Github doesn't have any way to hide the Client-ID, so here it is. It's insecure code, so please don't replicate or abuse it. Thank you.
const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';
const RANGE = 'Sheet1!A2:I'; // Adjust range to include District column

let listings = [];

function fetchListings() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            listings = data.values;
            displayListings(listings.map((listing, index) => ({ listing, index }))); // Include the index for each listing
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayListings(listingsToDisplay) {
    const listingsContainer = document.getElementById('listings');
    listingsContainer.innerHTML = '';

    listingsToDisplay.forEach(({ listing, index }) => {
        const [name, address, price, imageUrl, description, host, phoneNumber, email, district] = listing;

        const listingDiv = document.createElement('div');
        listingDiv.style.border = '1px solid #ddd';
        listingDiv.style.padding = '10px';
        listingDiv.style.marginBottom = '10px';

        const detailPageUrl = `rental.html?id=${index}`; // Use the original index for the URL

        listingDiv.innerHTML = `
            <h2><a href="${detailPageUrl}">${name || 'No name'}</a></h2>
            <p><strong>Address:</strong> ${address || 'No address'}</p>
            <p><strong>Price:</strong> ${price || 'No price'}</p>
            <p><strong>Description:</strong> ${description || 'No description'}</p>
            <p><strong>Host:</strong> ${host || 'No host'}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber || 'No phone number'}</p>
            <p><strong>Email:</strong> <a href="mailto:${email || '#'}">${email || 'No email'}</a></p>
            <img src="${imageUrl || 'https://via.placeholder.com/200'}" alt="${name || 'No name'}" style="width: 200px; height: auto;">
        `;

        listingsContainer.appendChild(listingDiv);
    });
}

function applyDistrictFilter() {
    const selectedDistrict = document.getElementById('district-filter').value;

    const filteredListings = listings
        .map((listing, index) => ({ listing, index })) // Store the original index
        .filter(({ listing }) => {
            const [, , , , , , , , district] = listing;
            return selectedDistrict === '' || district === selectedDistrict;
        });

    displayListings(filteredListings);
}

document.addEventListener('DOMContentLoaded', fetchListings);

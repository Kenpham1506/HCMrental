const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s'; // Hosting on GitHub doesn't have any way to hide the Client-ID, so here it is.
const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';
const RANGE = 'Sheet1!A2:J'; // Adjust range to include Active column

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

function getStatus(activeDate) {
    const now = new Date();
    const date = new Date(activeDate);
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
        return '<span style="color: green;">&#x25CF; Active</span>';
    } else if (diffDays < 30) {
        return '<span style="color: orange;">&#x25CF; Pending</span>';
    } else {
        return '<span style="color: red;">&#x25CF; Inactive</span>';
    }
}

function displayListings(listingsToDisplay) {
    const listingsContainer = document.getElementById('listings');
    listingsContainer.innerHTML = '';

    listingsToDisplay.forEach(({ listing, index }) => {
        const [name, address, price, imageUrl, description, host, phoneNumber, email, district, activeDate] = listing;

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
            <p><strong>Status:</strong> ${getStatus(activeDate)}</p>
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

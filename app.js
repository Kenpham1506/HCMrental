const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s';
const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';
const RANGE = 'Sheet1!A2:H'; // Adjust the range to include Host, Phone Number, Email

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
            const listings = data.values;
            displayListings(listings);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayListings(listings) {
    const listingsContainer = document.getElementById('listings');
    listingsContainer.innerHTML = '';

    listings.forEach((listing, index) => {
        const [name, address, price, imageUrl, description, host, phoneNumber, email] = listing;

        const listingDiv = document.createElement('div');
        listingDiv.style.border = '1px solid #ddd';
        listingDiv.style.padding = '10px';
        listingDiv.style.marginBottom = '10px';

        const detailPageUrl = `rental.html?id=${index}`; // Generate URL with query parameter

        listingDiv.innerHTML = `
            <h2><a href="${detailPageUrl}">${name}</a></h2>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Price:</strong> ${price}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Host:</strong> ${host}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <img src="${imageUrl}" alt="${name}" style="width: 200px; height: auto;">
        `;

        listingsContainer.appendChild(listingDiv);
    });
}

document.addEventListener('DOMContentLoaded', fetchListings);

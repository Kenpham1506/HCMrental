const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s'; // API Key
const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE'; // Spreadsheet ID
const RANGE = 'Sheet1!A2:J'; // Adjust range to include the "Active" column (J column)

let listings = [];

// Function to fetch listings from Google Sheets
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
            displayListings(filterAndSortListings(listings));
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to calculate the days since active and determine status
function calculateStatus(activeDate) {
    const currentDate = new Date();
    const activeDateObj = new Date(activeDate);
    
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const diffTime = currentDate - activeDateObj;
    const diffDays = Math.floor(diffTime / millisecondsPerDay);

    let status = '';
    if (diffDays < 7) {
        status = 'Active'; // Green dot
    } else if (diffDays >= 7 && diffDays < 30) {
        status = 'Pending'; // Yellow dot
    } else {
        status = 'Inactive'; // Red dot
    }

    return { diffDays, status };
}

// Function to filter and sort the listings
function filterAndSortListings(listings) {
    const activeListings = [];
    const pendingListings = [];
    
    listings.forEach(listing => {
        const [name, address, price, imageUrl, description, host, phoneNumber, email, district, activeDate] = listing;
        
        const { status } = calculateStatus(activeDate);

        if (status === 'Active') {
            activeListings.push(listing);
        } else if (status === 'Pending') {
            pendingListings.push(listing);
        }
        // Inactive listings are ignored
    });

    // Concatenate active listings with pending listings (active first, then pending)
    return [...activeListings, ...pendingListings];
}

// Function to display the listings
function displayListings(listingsToDisplay) {
    const listingsContainer = document.getElementById('listings');
    listingsContainer.innerHTML = '';

    listingsToDisplay.forEach((listing, index) => {
        const [name, address, price, imageUrl, description, host, phoneNumber, email, district, activeDate] = listing;

        const listingDiv = document.createElement('div');
        listingDiv.style.border = '1px solid #ddd';
        listingDiv.style.padding = '10px';
        listingDiv.style.marginBottom = '10px';

        const detailPageUrl = `rental.html?id=${index}`;

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

// Function to apply district filter
function applyDistrictFilter() {
    const selectedDistrict = document.getElementById('district-filter').value;

    const filteredListings = listings
        .filter(listing => {
            const [, , , , , , , , district] = listing;
            return selectedDistrict === '' || district === selectedDistrict;
        });

    displayListings(filterAndSortListings(filteredListings));
}

document.addEventListener('DOMContentLoaded', fetchListings);

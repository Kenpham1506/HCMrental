const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s';
const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';
const RANGE = 'Sheet1!A2:K'; // Adjust range to include Active column

let listings = [];

function fetchListings() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            listings = data.values;
            applyFilters(); // Apply filters initially when data is loaded
        })
        .catch(error => console.error('Error fetching data:', error));
}

function applyFilters() {
    const selectedDistrict = document.getElementById('district-filter').value;
    const selectedStatus = document.getElementById('status-filter').value;

    const filteredListings = listings
        .map((listing, index) => ({ listing, index }))
        .filter(({ listing }) => {
            const [, , , district, , , , , , activeDate] = listing;
            const statusHtml = getStatusHtml(activeDate);

            const matchesDistrict = selectedDistrict === '' || district === selectedDistrict;
            const matchesStatus = selectedStatus === '' || statusHtml.statusText === selectedStatus;

            return matchesDistrict && matchesStatus;
        });

    // Sort filtered listings by status
    const sortedListings = sortListingsByStatus(filteredListings);

    displayListings(sortedListings);
}

function sortListingsByStatus(listingsToSort) {
    return listingsToSort.sort((a, b) => {
        const statusA = getStatusHtml(a.listing[9]).statusText;
        const statusB = getStatusHtml(b.listing[9]).statusText;

        const statusOrder = ['Active', 'Pending', 'Rented', 'Inactive'];

        return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
    });
}

function displayListings(listingsToDisplay) {
    const listingsContainer = document.getElementById('listings');
    listingsContainer.innerHTML = '';

    listingsToDisplay.forEach(({ listing, index }) => {
        const [id, name, address, district, price, description, host, phoneNumber, email, activeDate, imageUrl] = listing;
        const statusHtml = getStatusHtml(activeDate);

        const listingHtml = `
            <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                <h2><a href="rental-page/rental.html?id=${id}">${name || 'No name'}</a></h2>
                <p><strong>Address:</strong> ${address || 'No address'}</p>
                <p><strong>Price:</strong> ${price || 'No price'}</p>
                <p><strong>Description:</strong> ${description || 'No description'}</p>
                <p><strong>Host:</strong> ${host || 'No host'}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber || 'No phone number'}</p>
                <p><strong>Email:</strong> <a href="mailto:${email || '#'}">${email || 'No email'}</a></p>
                <p><strong>Status:</strong> ${statusHtml.dotHtml}<span style="color: ${statusHtml.color}; margin-left: 5px;">${statusHtml.statusText}</span></p>
                <img src="${imageUrl || 'https://via.placeholder.com/200'}" alt="${name || 'No name'}" style="width: 200px; height: auto;">
            </div>
        `;

        listingsContainer.innerHTML += listingHtml;
    });
}

function getStatusHtml(activeDate) {
    const dateNow = new Date();
    const activeDateObj = new Date(activeDate);
    const diffTime = Math.abs(dateNow - activeDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

    if (!activeDate) {
        return { dotHtml: `<span style="color: gray;">●</span>`, statusText: 'Unknown', color: 'gray' };
    } else if (activeDateObj > dateNow) {
        return { dotHtml: `<span style="color: blue;">●</span>`, statusText: 'Rented', color: 'blue' };
    } else if (diffDays <= 30) {
        return { dotHtml: `<span style="color: green;">●</span>`, statusText: 'Active', color: 'green' };
    } else if (diffDays <= 90) {
        return { dotHtml: `<span style="color: orange;">●</span>`, statusText: 'Pending', color: 'orange' };
    } else {
        return { dotHtml: `<span style="color: red;">●</span>`, statusText: 'Inactive', color: 'red' };
    }
}

document.addEventListener('DOMContentLoaded', fetchListings);

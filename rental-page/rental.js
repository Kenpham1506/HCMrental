const API_KEY = 'AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s';
const SPREADSHEET_ID = '1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE';
const RANGE = 'Sheet1!A2:K';

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
            const listing = listings.find(row => row[0] === id);
            displayRentalDetails(listing);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function getStatus(activeDate) {
    const now = new Date();
    const date = new Date(activeDate);
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (!activeDate) {
        return '<span style="color: gray;">&#x25CF; Unknown</span>';
    } else if (date > now) {
        return '<span style="color: blue;">&#x25CF; Rented</span>';
    } else if (diffDays < 30) {
        return '<span style="color: green;">&#x25CF; Active</span>';
    } else if (diffDays < 90) {
        return '<span style="color: orange;">&#x25CF; Pending</span>';
    } else {
        return '<span style="color: red;">&#x25CF; Inactive</span>';
    }
}

function displayRentalDetails(listing) {
    if (!listing) {
        document.getElementById('rental-detail').innerHTML = '<p>No details available.</p>';
        return;
    }

    const [id, name, address, district, price, description, host, phoneNumber, email, activeDate, imageUrls] = listing;

    const rentalDetailDiv = document.getElementById('rental-detail');
    const imagesArray = imageUrls ? imageUrls.split(',') : [];
    const imagesHtml = imagesArray.map(url => `<img src="${url.trim()}" alt="${name}" class="carousel-image">`).join('');

    rentalDetailDiv.innerHTML = `
        <h2>${name || 'No name'}</h2>
        <p><strong>Address:</strong> ${address || 'No address'}</p>
        <p><strong>Price:</strong> ${price || 'No price'}</p>
        <p><strong>Description:</strong> ${description || 'No description'}</p>
        <p><strong>Host:</strong> ${host || 'No host'}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber || 'No phone number'}</p>
        <p><strong>Email:</strong> <a href="mailto:${email || '#'}">${email || 'No email'}</a></p>
        <p><strong>Status:</strong> ${getStatus(activeDate)}</p>
        <div class="carousel-container">
            <div class="carousel-images" id="carousel-images">
                ${imagesHtml}
            </div>
            <button class="carousel-button left" id="carousel-left">&#10094;</button>
            <button class="carousel-button right" id="carousel-right">&#10095;</button>
        </div>
    `;

    initializeCarousel();
    
    const mapIframe = document.getElementById('map');
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodeURIComponent(address)}`;
    mapIframe.src = mapUrl;
}

function initializeCarousel() {
    const carousel = document.getElementById('carousel-images');
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 3; // scroll-fast
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Left and Right Buttons
    document.getElementById('carousel-left').addEventListener('click', () => {
        carousel.scrollLeft -= carousel.offsetWidth;
    });

    document.getElementById('carousel-right').addEventListener('click', () => {
        carousel.scrollLeft += carousel.offsetWidth;
    });
}

document.addEventListener('DOMContentLoaded', getRentalDetails);

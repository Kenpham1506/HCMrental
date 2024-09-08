let userEmail = '';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Sign-In
    function initGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com', // Your actual Google Client ID
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            document.getElementById('g_id_signin'),
            { theme: 'outline', size: 'large' }
        );

        google.accounts.id.prompt(); // Display the prompt
    }

    function handleCredentialResponse(response) {
        const idToken = response.credential;
        const decodedToken = jwt_decode(idToken);
        userEmail = decodedToken.email;
        document.getElementById('user-email').innerText = `Logged in as: ${userEmail}`;
        fetchUserRentals(userEmail);
    }

    async function fetchUserRentals(email) {
        // Use Google Sheets API directly with the provided API key
        const url = `https://sheets.googleapis.com/v4/spreadsheets/1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE/values/Sheet1!A2:K?key=AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayUserRentals(data.values, email);
        } catch (error) {
            console.error('Error fetching user rentals:', error);
        }
    }

    function displayUserRentals(rentals, email) {
        const rentalList = document.getElementById('rental-list');
        rentalList.innerHTML = '';

        rentals.forEach((rental) => {
            const [id, propertyName, address, district, price, description, host, phone, rentalEmail, activeDate, imageUrl] = rental;
            if (rentalEmail === email) {
                const rentalDiv = document.createElement('div');
                rentalDiv.innerHTML = `
                    <h3>${propertyName}</h3>
                    <p><strong>Address:</strong> ${address}</p>
                    <p><strong>Price:</strong> ${price}</p>
                    <p><strong>Status:</strong> ${activeDate ? 'Active' : 'Rented'}</p>
                    <button onclick="setActiveDate('${id}', '${propertyName}', '${address}', '${price}', '${imageUrl}', '${description}', '${host}', '${phone}', '${district}', '${rentalEmail}')">Set Active</button>
                    <button onclick="setRentedDate('${id}', '${propertyName}', '${address}', '${price}', '${imageUrl}', '${description}', '${host}', '${phone}', '${district}', '${rentalEmail}')">Set Rented</button>
                `;
                rentalList.appendChild(rentalDiv);
            }
        });
    }

    // Define setActiveDate and setRentedDate globally
    window.setActiveDate = async function(id, propertyName, address, price, imageUrl, description, host, phone, district, rentalEmail) {
        // Use your CORS server for the Google Apps Script API
        const url = `https://keen-ripple-tub.glitch.me/https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec`;

        const body = {
            id,
            propertyName,
            address,
            price,
            imageUrl,
            description,
            host,
            phone,
            district,
            email: rentalEmail,
            active: new Date().toISOString().split('T')[0] // Set current date as Active
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert('Active date updated successfully');
            }
        } catch (error) {
            console.error('Error updating rental status:', error);
        }
    };

    window.setRentedDate = async function(id, propertyName, address, price, imageUrl, description, host, phone, district, rentalEmail) {
        const rentedDate = prompt('Enter the rental end date (YYYY-MM-DD)');
        if (!rentedDate) return;

        // Use your CORS server for the Google Apps Script API
        const url = `https://keen-ripple-tub.glitch.me/https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec`;

        const body = {
            id,
            propertyName,
            address,
            price,
            imageUrl,
            description,
            host,
            phone,
            district,
            email: rentalEmail,
            active: rentedDate // Set future date as the rented end date
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert('Rented date updated successfully');
            }
        } catch (error) {
            console.error('Error updating rental status:', error);
        }
    };

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initGoogleSignIn;
    document.head.appendChild(script);
});

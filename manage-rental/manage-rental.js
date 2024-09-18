document.addEventListener('DOMContentLoaded', function() {
    let userEmail = '';

    // Initialize Google Sign-In function
    function initGoogleSignIn() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com',
                callback: handleCredentialResponse
            });

            google.accounts.id.renderButton(
                document.getElementById('g_id_signin'),
                { theme: 'outline', size: 'large' }
            );

            const storedEmail = localStorage.getItem('userEmail');
            if (storedEmail) {
                userEmail = storedEmail;
                displayLoggedInState(userEmail);
            } else {
                google.accounts.id.prompt(); // Display the prompt if not logged in
            }
        } else {
            console.error('Google Sign-In library not loaded.');
        }
    }

    function handleCredentialResponse(response) {
        const idToken = response.credential;
        const decodedToken = jwt_decode(idToken);
        userEmail = decodedToken.email;
        localStorage.setItem('userEmail', userEmail);
        displayLoggedInState(userEmail);
    }

    function displayLoggedInState(email) {
        document.getElementById('user-email').innerText = `Logged in as: ${email}`;
        document.getElementById('g_id_signin').style.display = 'none'; // Hide sign-in button
        signOutButton.style.display = 'inline'; // Show sign-out button
        fetchUserRentals(email);
    }

    // Handle Sign-out
    const signOutButton = document.getElementById('signOutButton');
    signOutButton.addEventListener('click', function() {
        localStorage.removeItem('userEmail');
        userEmail = '';
        document.getElementById('user-email').innerText = '';
        signOutButton.style.display = 'none';
        document.getElementById('g_id_signin').style.display = 'block'; // Show sign-in button again
        location.reload(); // Reload page to reset rentals
    });

    // Fetch user rentals from Google Sheets API
    async function fetchUserRentals(email) {
        const url = 'https://sheets.googleapis.com/v4/spreadsheets/1tr9EYkquStJozfVokqS1Ix_Ugwn7xfhUX9eOu6x5WEE/values/Sheet1!A2:K?key=AIzaSyA4SnI-q5SjQk_g1L-3yCE0yTLu_8nob8s';

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayUserRentals(data.values, email);
        } catch (error) {
            console.error('Error fetching user rentals:', error);
        }
    }

    // Display rentals for the logged-in user
    function displayUserRentals(rentals, email) {
        const rentalList = document.getElementById('rental-list');
        rentalList.innerHTML = ''; // Clear the list

        const currentDate = new Date();

        rentals.forEach((rental) => {
            const [id, propertyName, address, district, price, description, host, phone, rentalEmail, activeDate, imageUrl] = rental;
            if (rentalEmail === email) {
                let statusHTML = '';
                if (activeDate) {
                    const activeDateObj = new Date(activeDate);
                    const timeDiff = currentDate - activeDateObj;
                    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

                    if (activeDateObj > currentDate) {
                        statusHTML = '<span class="dot blue"></span><span class="status-text blue">Rented</span>';
                    } else if (daysDiff < 30) {
                        statusHTML = '<span class="dot green"></span><span class="status-text green">Active</span>';
                    } else if (daysDiff < 90) {
                        statusHTML = '<span class="dot orange"></span><span class="status-text orange">Pending</span>';
                    } else {
                        statusHTML = '<span class="dot red"></span><span class="status-text red">Inactive</span>';
                    }
                } else {
                    statusHTML = '<span class="dot gray"></span><span class="status-text gray">No active date</span>';
                }

                const rentalDiv = document.createElement('div');
                rentalDiv.className = 'rental-item'; // Add class for styling
                rentalDiv.innerHTML = `
                    <h3>${propertyName}</h3>
                    <p><strong>Address:</strong> ${address}</p>
                    <p><strong>Price:</strong> ${price}</p>
                    <p><strong>Status:</strong> ${statusHTML}</p>
                    <button onclick="setActiveDate('${id}', '${propertyName}', '${address}', '${price}', '${imageUrl}', '${description}', '${host}', '${phone}', '${district}', '${rentalEmail}')">Set Active</button>
                    <button onclick="setRentedDate('${id}', '${propertyName}', '${address}', '${price}', '${imageUrl}', '${description}', '${host}', '${phone}', '${district}', '${rentalEmail}')">Set Rented</button>
                    <div id="rentedDateContainer-${id}" class="rented-date-container"></div>
                    <hr> <!-- Divider between each rental -->
                `;
                rentalList.appendChild(rentalDiv);
            }
        });
    }

    // Set Active Date - Immediate submission
    window.setActiveDate = async function(id, propertyName, address, price, imageUrl, description, host, phone, district, rentalEmail) {
        const url = 'https://keen-ripple-tub.glitch.me/https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec';
        const body = {
            id, propertyName, address, price, imageUrl, description, host, phone, district, email: rentalEmail,
            active: new Date().toISOString().split('T')[0]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    // Create calendar and submit button when "Set Rented" is clicked
    window.setRentedDate = async function(id, propertyName, address, price, imageUrl, description, host, phone, district, rentalEmail) {
        const rentedDateContainer = document.getElementById(`rentedDateContainer-${id}`);
        
        // Avoid adding duplicate form if it already exists
        if (rentedDateContainer.querySelector('.rented-form')) return;
        
        // Create the calendar input and submit button dynamically
        rentedDateContainer.innerHTML = `
            <div class="rented-form">
                <label for="rentedDateInput-${id}">Select Rented Date: </label>
                <input type="date" id="rentedDateInput-${id}">
                <button id="submitRentedDate-${id}" class="submit-rented-btn">Submit</button>
            </div>
        `;

        // Add event listener for the submit button
        document.getElementById(`submitRentedDate-${id}`).addEventListener('click', function() {
            const rentedDate = document.getElementById(`rentedDateInput-${id}`).value;
            if (!rentedDate) {
                alert('Please select a date.');
                return;
            }

            // Call the backend API to update the rented date
            updateRentedDate(id, propertyName, address, price, imageUrl, description, host, phone, district, rentalEmail, rentedDate);
        });
    };

    // Function to send the rented date to the server
    function updateRentedDate(id, propertyName, address, price, imageUrl, description, host, phone, district, rentalEmail, rentedDate) {
        const url = 'https://keen-ripple-tub.glitch.me/https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec';
        const body = {
            id, propertyName, address, price, imageUrl, description, host, phone, district, email: rentalEmail,
            rented: rentedDate
        };

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                alert('Rented date updated successfully');
                location.reload(); // Reload page to reflect changes
            }
        })
        .catch(error => console.error('Error updating rented date:', error));
    }

    // Load Google Sign-In script and initialize
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initGoogleSignIn;
    document.head.appendChild(script);
});

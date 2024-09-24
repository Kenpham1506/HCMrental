document.addEventListener('DOMContentLoaded', function() {
    let userEmail = '';
    let userAvatar = '';

    // Initialize Google Sign-In
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

            checkUserStatus(); // Check login status on load
        } else {
            console.error('Google Sign-In library not loaded.');
        }
    }

    function checkUserStatus() {
        const storedEmail = localStorage.getItem('userEmail');
        const storedAvatar = localStorage.getItem('userAvatar');

        if (storedEmail) {
            userEmail = storedEmail;
            userAvatar = storedAvatar;
            displayLoggedInState(userEmail, userAvatar);
        } else {
            displayLoggedOutState(); // Call this function to ensure proper state
        }
    }

    function handleCredentialResponse(response) {
        const idToken = response.credential;
        const decodedToken = jwt_decode(idToken);
        userEmail = decodedToken.email;
        userAvatar = decodedToken.picture;

        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userAvatar', userAvatar);

        displayLoggedInState(userEmail, userAvatar);
    }

    function displayLoggedInState(email, avatar) {
        document.getElementById('user-email').innerText = `Logged in as: ${email}`;
        document.getElementById('g_id_signin').style.display = 'none';
        const signOutButton = document.getElementById('signOutButton');
        if (signOutButton) signOutButton.style.display = 'inline';

        document.getElementById('rightSideMenu').style.display = 'block';
        
        const userAvatarContainer = document.getElementById('user-avatar');
        if (avatar) {
            userAvatarContainer.innerHTML = `<img src="${avatar}" alt="User Avatar" style="width: 40px; height: 40px; border-radius: 50%;">`;
            userAvatarContainer.style.pointerEvents = 'auto'; // Enable interactions
        } else {
            userAvatarContainer.innerHTML = '';
        }
        
        const userAvatarContainer = document.getElementById('user-avatar-right');
        if (avatar) {
            userAvatarContainer.innerHTML = `<img src="${avatar}" alt="User Avatar" style="width: 40px; height: 40px; border-radius: 50%;">`;
            userAvatarContainer.style.pointerEvents = 'auto'; // Enable interactions
        } else {
            userAvatarContainer.innerHTML = '';
        }
        
        fetchUserRentals(email);
    }

    function displayLoggedOutState() {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAvatar');

        document.getElementById('user-email').innerText = '';
        document.getElementById('g_id_signin').style.display = 'block';
        document.getElementById('rightSideMenu').style.display = 'none';

        // Reset user avatar and disable interaction
        const userAvatarContainer = document.getElementById('user-avatar');
        userAvatarContainer.innerHTML = ''; // Clear any previous avatar
        userAvatarContainer.style.pointerEvents = 'none'; // Disable interactions

        // Position the Google Sign-In button
        const signInButton = document.getElementById('g_id_signin');
        signInButton.style.position = 'absolute'; // Position as needed
        signInButton.style.top = '40px'; // Adjust position
        signInButton.style.right = '30px'; // Adjust position
    }

    // Sign out logic
    const signOutButton = document.getElementById('signOutButton');
    if (signOutButton) {
        signOutButton.addEventListener('click', function() {
            google.accounts.id.revoke(userEmail, (done) => {
                console.log('User signed out.');
            });
            displayLoggedOutState();
            location.reload(); // Reload page to reset rentals
        });
    }

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
        rentalList.innerHTML = '';

        const currentDate = new Date();

        rentals.forEach((rental) => {
            const [id, propertyName, address, district, price, description, host, phone, rentalEmail, activeDate, imageUrl] = rental;
            if (rentalEmail === email) {
                let statusHTML = '';
                if (activeDate) {
                    const activeDateObj = new Date(activeDate);
                    const daysDiff = Math.floor((currentDate - activeDateObj) / (1000 * 60 * 60 * 24));

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
                rentalDiv.className = 'rental-item';
                rentalDiv.innerHTML = `
                    <h3>${propertyName}</h3>
                    <p><strong>Address:</strong> ${address}</p>
                    <p><strong>Price:</strong> ${price}</p>
                    <p><strong>Status:</strong> ${statusHTML}</p>
                    <button onclick="setActiveDate('${id}', '${propertyName}', '${address}', '${price}', '${imageUrl}', '${description}', '${host}', '${phone}', '${district}', '${rentalEmail}')">Set Active</button>
                    <button onclick="setRentedDate('${id}', '${propertyName}', '${address}', '${price}', '${imageUrl}', '${description}', '${host}', '${phone}', '${district}', '${rentalEmail}')">Set Rented</button>
                    <div id="rentedDateContainer-${id}" class="rented-date-container"></div>
                    <hr>
                `;
                rentalList.appendChild(rentalDiv);
            }
        });
    }

    // Set Active Date
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

    // Create calendar and submit button for Rented Date
    window.setRentedDate = async function(id, propertyName, address, price, imageUrl, description, host, phone, district, rentalEmail) {
        const rentedDateContainer = document.getElementById(`rentedDateContainer-${id}`);

        // Avoid duplicate form
        if (rentedDateContainer.querySelector('.rented-form')) return;

        rentedDateContainer.innerHTML = `
            <div class="rented-form">
                <label for="rentedDateInput-${id}">Select Rented Date: </label>
                <input type="date" id="rentedDateInput-${id}">
                <button onclick="submitRentedDate('${id}', '${propertyName}', '${address}', '${price}', '${imageUrl}', '${description}', '${host}', '${phone}', '${district}', '${rentalEmail}')">Submit</button>
            </div>
        `;
    };

    // Submit the rented date
    window.submitRentedDate = async function(id, propertyName, address, price, imageUrl, description, host, phone, district, rentalEmail) {
        const rentedDate = document.getElementById(`rentedDateInput-${id}`).value;

        if (!rentedDate) {
            alert('Please select a valid rented date');
            return;
        }

        const url = 'https://keen-ripple-tub.glitch.me/https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec';
        const body = {
            id, propertyName, address, price, imageUrl, description, host, phone, district, email: rentalEmail,
            active: rentedDate
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert('Rented date updated successfully');
            }
        } catch (error) {
            console.error('Error updating rented date:', error);
        }
    };

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initGoogleSignIn;
    document.head.appendChild(script);
});

// Side menu functions
function openleftSideMenu() {
    document.getElementById("leftSideMenu").style.width = "250px";
}

function closeleftSideMenu() {
    document.getElementById("leftSideMenu").style.width = "0";
}

function openrightSideMenu() {
    document.getElementById("rightSideMenu").style.width = "250px";
}

function closerightSideMenu() {
    document.getElementById("rightSideMenu").style.width = "0";
}

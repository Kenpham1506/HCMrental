document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rentalForm');
    const loginStatus = document.getElementById('login-status');
    const submitButton = document.getElementById('submitButton');

    let userEmail = null;

    // Function to handle the response from Google Sign-In
    function handleCredentialResponse(response) {
        const credential = response.credential;
        const decodedToken = jwt_decode(credential); // Decode JWT token using jwt-decode
        userEmail = decodedToken.email;
        loginStatus.textContent = 'Logged in as: ' + userEmail;
        submitButton.disabled = false;
    }

    // Initialize Google Sign-In and render button
    function initGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com',
            callback: handleCredentialResponse
        });

        // Render the Google Sign-In button for new users
        google.accounts.id.renderButton(
            document.getElementById('g_id_signin'),
            { theme: 'outline', size: 'large' } // Customize button options
        );

        google.accounts.id.prompt(); // Show the Google Sign-In prompt for returning users
    }

    // Wait until the Google Identity Services script is loaded
    window.onload = function() {
        if (typeof google !== 'undefined') {
            initGoogleSignIn();
        } else {
            console.error('Google Identity Services script not loaded.');
        }
    };

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            if (!userEmail) {
                alert('Please log in to submit the form.');
                return;
            }

            const propertyName = document.getElementById('propertyName').value;
            const address = document.getElementById('address').value;
            const price = document.getElementById('price').value;
            const district = document.getElementById('district').value;
            const description = document.getElementById('description').value;
            const host = document.getElementById('host').value;
            const phone = document.getElementById('phone').value;
            const imageFile = document.getElementById('image').files[0];

            if (!imageFile) {
                alert('Please upload an image.');
                return;
            }

            try {
                const imgurClientId = 'e56f8a4b47c6eee';
                const formData = new FormData();
                formData.append('image', imageFile);

                const imgurResponse = await fetch('https://api.imgur.com/3/image', {
                    method: 'POST',
                    headers: {
                        Authorization: `Client-ID ${imgurClientId}`
                    },
                    body: formData
                });

                const imgurData = await imgurResponse.json();

                if (imgurData.success) {
                    const imageUrl = imgurData.data.link;

                    // Send data to Google Sheets using HTTPS
                    const response = await fetch('https://keen-ripple-tub.glitch.me/https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            propertyName,
                            address,
                            price,
                            imageUrl,
                            description,
                            host,
                            phone,
                            email: userEmail,
                            district
                        })
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        alert('Rental information submitted successfully!');
                        form.reset();
                        submitButton.disabled = true;
                        loginStatus.textContent = 'Please log in to submit the form.';
                    } else {
                        alert('Failed to submit rental information.');
                    }
                } else {
                    alert('Failed to upload image to Imgur.');
                }

            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred while submitting the form.');
            }
        });
    } else {
        console.error('Form element not found.');
    }
});

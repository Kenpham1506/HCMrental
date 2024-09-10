document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('rentalForm');
    const status = document.getElementById('status');
    const emailField = document.getElementById('email');
    const submittingIndicator = document.getElementById('submittingIndicator');
    let userEmail = '';

    // Initialize Google Sign-In
    function initGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com',
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            document.getElementById('g_id_signin'),
            { theme: 'outline', size: 'large' }  // Customize the button
        );

        google.accounts.id.prompt(); // Display the prompt
    }

    // Handle the Google Sign-In response
    function handleCredentialResponse(response) {
        try {
            const idToken = response.credential;
            const decodedToken = jwt_decode(idToken);
            userEmail = decodedToken.email;

            // Store user email in localStorage for persistence
            localStorage.setItem('userEmail', userEmail);

            displayLoggedInState(userEmail);
        } catch (error) {
            console.error('Error decoding token:', error);
            status.textContent = 'Failed to log in. Please try again.';
            status.style.color = 'red'; // Set the color to red
        }
    }

    // Check if the user is already logged in (persistent)
    function checkLoginState() {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            userEmail = storedEmail;
            displayLoggedInState(userEmail);
        }
    }

    // Display logged-in state
    function displayLoggedInState(email) {
        emailField.value = email;
        status.textContent = 'You are logged in as ' + email;
        status.style.color = 'green'; // Set the color to green
        document.getElementById('g_id_signin').style.display = 'none'; // Hide sign-in button
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            if (!userEmail) {
                status.textContent = 'You must be logged in to submit the form.';
                status.style.color = 'red'; // Set the color to red
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
                submittingIndicator.style.display = 'block'; // Show submitting indicator

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
                            district,
                            description,
                            host,
                            phone,
                            email: userEmail,
                            imageUrl,
                            active: new Date()
                        })
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        alert('Rental information submitted successfully!');
                        form.reset();
                        emailField.value = '';
                        status.textContent = '';
                        submittingIndicator.style.display = 'none'; // Hide submitting indicator
                    } else {
                        alert('Failed to submit rental information.');
                    }
                } else {
                    alert('Failed to upload image to Imgur.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred while submitting the form.');
            } finally {
                submittingIndicator.style.display = 'none'; // Hide submitting indicator
            }
        });
    }

    // Check login state on page load
    checkLoginState();

    // Load Google Sign-In library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initGoogleSignIn;
    document.head.appendChild(script);
});

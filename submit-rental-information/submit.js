document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Sign-In
    function initGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com',
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById('signInButton'),
            { theme: "outline", size: "large" }
        );
        google.accounts.id.prompt(); // Show the account chooser
    }

    // Load jwt-decode from CDN
    async function loadJwtDecode() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js';
        script.onload = () => {
            if (typeof jwt_decode !== 'function') {
                console.error('jwt_decode function is not available.');
            }
        };
        document.head.appendChild(script);
    }

    // Handle the credential response from Google
    function handleCredentialResponse(response) {
        // Check if jwt_decode is loaded
        if (typeof jwt_decode === 'undefined') {
            console.error('jwt_decode is not loaded.');
            return;
        }

        try {
            const user = jwt_decode(response.credential);
            document.getElementById('email').value = user.email;
            document.getElementById('signInMessage').style.display = 'none'; // Hide sign-in message when logged in
        } catch (error) {
            console.error('Error decoding JWT:', error);
        }
    }

    // Make sure the Google Identity Services script is loaded before calling initGoogleSignIn
    const gsiScript = document.createElement('script');
    gsiScript.src = 'https://accounts.google.com/gsi/client';
    gsiScript.async = true;
    gsiScript.defer = true;
    gsiScript.onload = async () => {
        await loadJwtDecode();
        initGoogleSignIn();
    };
    document.head.appendChild(gsiScript);

    const form = document.getElementById('rentalForm');

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            if (!email) {
                document.getElementById('signInMessage').style.display = 'block'; // Show sign-in message if not logged in
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
                            email,
                            district
                        })
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        alert('Rental information submitted successfully!');
                        form.reset();
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

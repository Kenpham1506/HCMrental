document.addEventListener('DOMContentLoaded', function() {
    // Google Sign-In Initialization
    window.onload = function() {
        google.accounts.id.initialize({
            client_id: '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com',
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.querySelector('.g_id_signin'),
            { theme: 'outline', size: 'large' }  // customization attributes
        );
        google.accounts.id.prompt(); // Display the One Tap prompt
    };

    function handleCredentialResponse(response) {
        // Decode the JWT token to extract email
        const decodedToken = jwt_decode(response.credential);
        document.getElementById('email').value = decodedToken.email;
    }

    const form = document.getElementById('rentalForm');
    
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const propertyName = document.getElementById('propertyName').value;
            const address = document.getElementById('address').value;
            const price = document.getElementById('price').value;
            const district = document.getElementById('district').value;
            const description = document.getElementById('description').value;
            const host = document.getElementById('host').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;

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
                            email,
                            district
                        })
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        alert('Rental information submitted successfully!');
                        // Do not reset the form here
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

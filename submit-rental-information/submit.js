document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rentalForm');
    
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Collect form data
            const propertyName = document.getElementById('propertyName').value.trim();
            const address = document.getElementById('address').value.trim();
            const price = document.getElementById('price').value.trim();
            const district = document.getElementById('district').value.trim();
            const description = document.getElementById('description').value.trim();
            const host = document.getElementById('host').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const imageFile = document.getElementById('image').files[0];

            // Basic validation
            if (!propertyName || !address || !price || !district || !description || !host || !phone || !email) {
                alert('Please fill in all required fields.');
                return;
            }

            if (!imageFile) {
                alert('Please upload an image.');
                return;
            }

            try {
                // Upload image to Imgur
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
                    const response = await fetch('https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec', {
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
                            email,
                            imageUrl
                        })
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        alert('Rental information submitted successfully!');
                        form.reset(); // Clear the form
                    } else {
                        alert('Failed to submit rental information. Please try again.');
                    }
                } else {
                    alert('Failed to upload image to Imgur.');
                }

            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred while submitting the form. Please try again later.');
            }
        });
    } else {
        console.error('Form element not found.');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rentalForm');
    
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const propertyName = document.getElementById('propertyName').value.trim();
            const address = document.getElementById('address').value.trim();
            const price = document.getElementById('price').value.trim();
            const district = document.getElementById('district').value.trim();
            const description = document.getElementById('description').value.trim();
            const host = document.getElementById('host').value.trim();
            const phone = "123-456-7890";//document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();

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

                    // Payload order should match the sheet columns order
                    const payload = {
                        propertyName,
                        address,
                        price,
                        imageUrl,  // Move imageUrl here
                        description,
                        host,
                        phone,
                        email,
                        district  // Move district to the end
                    };

                    const response = await fetch('https://keen-ripple-tub.glitch.me/https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
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

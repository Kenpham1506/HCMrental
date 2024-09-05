document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rentalForm');
    const submitButton = document.querySelector('button[type="submit"]');
    const resetButton = document.createElement('button');
    
    // Create a reset button and hide it initially
    resetButton.textContent = "Reset";
    resetButton.style.display = 'none';
    resetButton.addEventListener('click', function() {
        form.reset();  // Reset the form fields
        submitButton.style.display = 'block';  // Show the submit button again
        resetButton.style.display = 'none';  // Hide the reset button
    });
    form.appendChild(resetButton);  // Add reset button to the form

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();  // Prevent form from reloading the page

            // Get form values
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
                // Log form data (optional)
                console.log("Form data being sent:", {
                    propertyName, address, price, district, description, host, phone, email
                });

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

                    // Send data to Google Sheets
                    const response = await fetch('https://keen-ripple-tub.glitch.me/https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            propertyName, address, price, district, description, host, phone, email, imageUrl
                        })
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        alert('Rental information submitted successfully!');
                        submitButton.style.display = 'none';  // Hide the submit button
                        resetButton.style.display = 'block';  // Show the reset button
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

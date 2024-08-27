document.getElementById('rental-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Create a FormData object to handle file upload
    const formData = new FormData();
    formData.append('image', document.getElementById('image-upload').files[0]);

    try {
        // Upload image to Imgur
        const imgurResponse = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': 'Client-ID e56f8a4b47c6eee'
            },
            body: formData
        });

        if (!imgurResponse.ok) {
            throw new Error(`Imgur upload failed with status ${imgurResponse.status}`);
        }

        const imgurData = await imgurResponse.json();
        const imageUrl = imgurData.data.link;

        // Submit rental information including the image URL
        await submitRentalInfo(imageUrl);
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('There was an error uploading the image.');
    }
});

async function submitRentalInfo(imageUrl) {
    const formData = {
        propertyName: document.getElementById('property-name').value,
        address: document.getElementById('address').value,
        price: document.getElementById('price').value,
        imageUrl: imageUrl,
        description: document.getElementById('description').value,
        host: document.getElementById('host').value,
        phoneNumber: document.getElementById('phone-number').value,
        email: document.getElementById('email').value,
        district: document.getElementById('district').value
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Google Sheets submission failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'success') {
            alert('Rental information submitted successfully!');
            document.getElementById('rental-form').reset();
        } else {
            throw new Error('Submission failed.');
        }
    } catch (error) {
        console.error('Error submitting rental info:', error);
        alert('There was an error submitting the form.');
    }
}

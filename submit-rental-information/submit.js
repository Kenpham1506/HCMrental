document.getElementById('rental-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const formData = {
        propertyName: document.getElementById('property-name').value, // Property Name
        address: document.getElementById('address').value,            // Address
        price: document.getElementById('price').value,                // Price
        imageUrl: document.getElementById('image-url').value,         // Image URL
        description: document.getElementById('description').value,    // Description
        host: document.getElementById('host').value,                  // Host
        phoneNumber: document.getElementById('phone-number').value,   // Phone Number
        email: document.getElementById('email').value,                // Email
        district: document.getElementById('district').value           // District
    };

    // Submit data to Google Sheets via Apps Script Web App
    fetch('https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec', { //hosting on Github doesn't have any way to hide the API key so here it is, insecure code so please don't replicate or abuse it, thank you.
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Rental information submitted successfully!');
        // Clear the form
        document.getElementById('rental-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting the form.');
    });
});

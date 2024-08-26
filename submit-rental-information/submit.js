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
    fetch('YOUR_ENDPOINT_URL', { // Replace 'YOUR_ENDPOINT_URL' with your actual Web App URL
        method: 'POST',
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

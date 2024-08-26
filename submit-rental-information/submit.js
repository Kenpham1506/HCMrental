document.getElementById('rental-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const formData = {
        propertyName: document.getElementById('property-name').value,
        address: document.getElementById('address').value,
        price: document.getElementById('price').value,
        imageUrl: document.getElementById('image-url').value,
        description: document.getElementById('description').value,
        host: document.getElementById('host').value,
        phoneNumber: document.getElementById('phone-number').value,
        email: document.getElementById('email').value,
        district: document.getElementById('district').value
    };

    // Submit data using CORS proxy
    fetch('https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Rental information submitted successfully!');
        document.getElementById('rental-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting the form.');
    });
});

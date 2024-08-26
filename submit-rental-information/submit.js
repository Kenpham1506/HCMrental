document.getElementById('rental-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        district: document.getElementById('district').value,
        contact: document.getElementById('contact').value,
    };

    // Example of submitting data to a server or Google Sheets (you'll need to set up the endpoint)
    fetch('YOUR_ENDPOINT_URL', {
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

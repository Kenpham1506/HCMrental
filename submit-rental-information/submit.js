document.getElementById('submitForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
        propertyName: formData.get('propertyName'),
        address: formData.get('address'),
        price: formData.get('price'),
        imageUrl: formData.get('imageUrl'),
        description: formData.get('description'),
        host: formData.get('host'),
        phoneNumber: formData.get('phoneNumber'),
        email: formData.get('email'),
        district: formData.get('district'),
    };

    fetch('https://cors-anywhere.herokuapp.com/YOUR_GOOGLE_SCRIPT_URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            alert('Form submitted successfully!');
            event.target.reset();
        } else {
            document.getElementById('errorMessage').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').style.display = 'block';
    });
});

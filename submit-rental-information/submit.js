document.getElementById('rentalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec';
    const apiUrl = corsProxy + googleScriptUrl;

    const formData = new FormData(this);

    const data = {
        propertyName: formData.get('propertyName'),
        address: formData.get('address'),
        price: formData.get('price'),
        imageUrl: formData.get('imageUrl'),
        description: formData.get('description'),
        host: formData.get('host'),
        phoneNumber: formData.get('phoneNumber'),
        email: formData.get('email'),
        district: formData.get('district')
    };

    fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(responseData => {
        document.getElementById('message').textContent = responseData.message;
        if (responseData.status === 'success') {
            document.getElementById('rentalForm').reset();
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        document.getElementById('message').textContent = 'There was an error submitting your rental information. Please try again.';
    });
});

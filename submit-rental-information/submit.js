document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rental-form');
  const proxyUrl = 'https://rough-talented-diascia.glitch.me/';
  const targetUrl = 'https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
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

    fetch(`${proxyUrl}${targetUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        console.log('Rental info submitted successfully');
      } else {
        console.error('Error submitting rental info:', result.message);
      }
    })
    .catch(error => console.error('Error:', error));
  });
});

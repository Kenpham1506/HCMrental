document.getElementById('rental-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const propertyName = formData.get('property-name');
    const address = formData.get('address');
    const price = formData.get('price');
    const description = formData.get('description');
    const host = formData.get('host');
    const phoneNumber = formData.get('phone-number');
    const email = formData.get('email');
    const district = formData.get('district');
    
    const imageFile = formData.get('image-upload');

    if (imageFile) {
        uploadImageToImgur(imageFile).then(imageUrl => {
            // Now send data to Google Sheets
            fetch('https://keen-ripple-tub.glitch.me/https://script.google.com/macros/s/1z2eMXged92tAEFILcUbFf8ITBNqMxDVxmnmKpJko49nSK1YSzYye8k6w/exec', {
                method: 'POST',
                body: JSON.stringify({
                    propertyName,
                    address,
                    price,
                    imageUrl,
                    description,
                    host,
                    phoneNumber,
                    email,
                    district
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    alert('Rental information submitted successfully!');
                    document.getElementById('rental-form').reset();
                } else {
                    alert('Failed to submit rental information.');
                }
            });
        }).catch(error => {
            alert('Failed to upload image to Imgur.');
            console.error(error);
        });
    }
});

function uploadImageToImgur(file) {
    const clientId = 'e56f8a4b47c6eee';
    const url = 'https://api.imgur.com/3/image';

    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', file);

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${clientId}`
            },
            body: formData
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                resolve(data.data.link);
            } else {
                reject(new Error('Failed to upload image.'));
            }
        }).catch(reject);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rentalForm');
    const imageInput = document.getElementById('imageUpload');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        
        // Handle image upload to Imgur
        if (imageInput.files.length > 0) {
            uploadImageToImgur(imageInput.files[0])
                .then(imageUrl => {
                    formData.append('image_url', imageUrl);
                    submitFormData(formData);
                })
                .catch(error => {
                    console.error('Image upload failed:', error);
                    alert('Image upload failed. Please try again.');
                });
        } else {
            submitFormData(formData);
        }
    });

    function uploadImageToImgur(file) {
        const url = 'https://api.imgur.com/3/image';
        const headers = new Headers({
            'Authorization': 'Client-ID e56f8a4b47c6eee',
            'Content-Type': 'multipart/form-data'
        });

        const formData = new FormData();
        formData.append('image', file);

        return fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.data.link; // URL of the uploaded image
            } else {
                throw new Error(data.data.error);
            }
        });
    }

    function submitFormData(formData) {
        const endpoint = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
        fetch(endpoint, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            alert('Rental information submitted successfully!');
            form.reset(); // Reset form after successful submission
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit rental information. Please try again.');
        });
    }
});

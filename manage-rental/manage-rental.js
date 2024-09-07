document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('editRentalForm');
    const emailField = document.getElementById('email');
    const statusField = document.getElementById('status');
    const endDateField = document.getElementById('endDate');
    const endDateLabel = document.getElementById('endDateLabel');
    const userEmail = '';

    // Initialize Google Sign-In
    function initGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com',
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            document.getElementById('g_id_signin'),
            { theme: 'outline', size: 'large' }
        );

        google.accounts.id.prompt();
    }

    // Handle the Google Sign-In response
    function handleCredentialResponse(response) {
        const idToken = response.credential;
        const decodedToken = jwt_decode(idToken);
        userEmail = decodedToken.email;
        emailField.value = userEmail;
        document.getElementById('status').textContent = `You are logged in as ${userEmail}`;
    }

    // Show/hide end date field based on rental status
    statusField.addEventListener('change', function() {
        if (statusField.value === 'rented') {
            endDateLabel.style.display = 'block';
            endDateField.style.display = 'block';
        } else {
            endDateLabel.style.display = 'none';
            endDateField.style.display = 'none';
        }
    });

    // Handle form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const propertyName = document.getElementById('propertyName').value;
        const address = document.getElementById('address').value;
        const price = document.getElementById('price').value;
        const rentalStatus = statusField.value;
        const endDate = endDateField.value;

        const updateData = {
            email: userEmail,
            propertyName,
            address,
            price,
            rentalStatus,
            endDate
        };

        const response = await fetch('https://keen-ripple-tub.glitch.me/https://script.google.com/macros/s/AKfycbzXpkvvrpzgfzZrA_UZLdpbU7Zpd5pyxmKI6nxYLoWVsKBy0Qr29MkU2yFmpU2NQKEG/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert('Rental information updated successfully!');
        } else {
            alert('Failed to update rental information.');
        }
    });

    // Load Google Sign-In library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initGoogleSignIn;
    document.head.appendChild(script);
});

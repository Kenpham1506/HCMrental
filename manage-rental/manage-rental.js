document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('editRentalForm');
    const statusDropdown = document.getElementById('rentalStatus');
    const endDateField = document.getElementById('endDate');
    const endDateLabel = document.getElementById('endDateLabel');
    let userEmail = '';

    // Initialize Google Sign-In
    function initGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID',
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            document.getElementById('g_id_signin'),
            { theme: 'outline', size: 'large' }
        );

        google.accounts.id.prompt(); // Shows login prompt
    }

    // Handle Google Sign-In response
    function handleCredentialResponse(response) {
        const idToken = response.credential;
        const decodedToken = jwt_decode(idToken);
        userEmail = decodedToken.email;
        document.getElementById('status').textContent = `Logged in as ${userEmail}`;
        form.style.display = 'block'; // Show form after login

        loadUserRentalData(userEmail);
    }

    // Show/hide the end date field based on the status selection
    statusDropdown.addEventListener('change', function () {
        if (this.value === 'rented') {
            endDateField.style.display = 'block';
            endDateLabel.style.display = 'block';
        } else {
            endDateField.style.display = 'none';
            endDateLabel.style.display = 'none';
        }
    });

    // Load the user's rental data based on the email
    function loadUserRentalData(email) {
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A:I?key=YOUR_API_KEY`)
            .then(response => response.json())
            .then(data => {
                const listings = data.values;
                const userListing = listings.find(listing => listing[7] === email);
                if (userListing) {
                    // Populate form with rental data (if needed)
                }
            });
    }

    // Handle form submission for updating rental status
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const status = statusDropdown.value;
        const endDate = endDateField.value;
        const currentDate = new Date().toISOString().slice(0, 10); // Format as YYYY-MM-DD

        const updatedData = {
            status: status === 'active' ? 'Active' : 'Rented',
            activeDate: status === 'active' ? currentDate : '',
            endDate: status === 'rented' ? endDate : ''
        };

        // Send the updated data to Google Sheets via API or App Script
        // (handle the updating logic here based on the row the user owns)
    });

    // Load Google Sign-In
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initGoogleSignIn;
    document.head.appendChild(script);
});

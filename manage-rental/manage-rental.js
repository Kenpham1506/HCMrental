document.addEventListener('DOMContentLoaded', function() {
    let userEmail = '';

    // Menu functionality
    const leftMenuBtn = document.getElementById('leftMenuBtn');
    const rightMenuBtn = document.getElementById('rightMenuBtn');
    const leftMenu = document.getElementById('leftMenu');
    const rightMenu = document.getElementById('rightMenu');

    leftMenuBtn.addEventListener('click', () => toggleMenu(leftMenu));
    rightMenuBtn.addEventListener('click', () => toggleMenu(rightMenu));

    document.querySelectorAll('.side-menu .close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => toggleMenu(e.target.parentElement));
    });

    function toggleMenu(menu) {
        menu.classList.toggle('open');
    }

    // Existing Google Sign-In functionality
    function initGoogleSignIn() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: '809802956700-h31b6mb6lrria57o6nr38kafbqnhl8o6.apps.googleusercontent.com',
                callback: handleCredentialResponse
            });

            google.accounts.id.renderButton(
                document.getElementById('g_id_signin'),
                { theme: 'outline', size: 'large' }
            );

            const storedEmail = localStorage.getItem('userEmail');
            if (storedEmail) {
                userEmail = storedEmail;
                displayLoggedInState(userEmail);
            } else {
                google.accounts.id.prompt();
            }
        } else {
            console.error('Google Sign-In library not loaded.');
        }
    }

    // ... (rest of the existing code remains the same)

    // Initialize Google Sign-In
    initGoogleSignIn();
});

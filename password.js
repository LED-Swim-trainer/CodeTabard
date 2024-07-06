document.addEventListener("DOMContentLoaded", function() {
    const correctPassword = "LEDswemmer2130";

    const modal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');
    const sidebar = document.querySelector('.sidebar');
    const swimmersContainer = document.getElementById('swimmers');

    passwordSubmit.addEventListener('click', function() {
        if (passwordInput.value === correctPassword) {
            modal.style.display = 'none';
            sidebar.style.display = 'block';
            swimmersContainer.style.display = 'block';
        } else {
            passwordError.style.display = 'block';
        }
    });
});


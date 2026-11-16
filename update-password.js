
const updateForm = document.getElementById("updatePasswordForm");
const message = document.getElementById("message");

updateForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const password =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        return;
    }

    if (password.length < 8) {
        message.textContent =
            "Password must contain at least 8 characters.";
        return;
    }

    message.textContent = "Updating password...";

    const { error } = await supabaseClient.auth.updateUser({
        password: password
    });

    if (error) {
        message.textContent =
            "Password update failed: " + error.message;
        return;
    }

    message.textContent =
        "Password updated successfully! You can now log in.";

    updateForm.reset();
});

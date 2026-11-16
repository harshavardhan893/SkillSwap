
const resetForm = document.getElementById("resetForm");
const message = document.getElementById("message");

resetForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    message.textContent = "Sending reset link...";

    const { error } = await supabaseClient.auth
        .resetPasswordForEmail(email, {
            redirectTo: window.location.origin + "/update-password.html"
        });

    if (error) {
        message.textContent = "Error: " + error.message;
        return;
    }

    message.textContent =
        "Password reset link sent. Check your email inbox.";
});

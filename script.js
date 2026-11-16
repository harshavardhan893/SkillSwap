
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const college = document.getElementById("college").value.trim();
        const teach = document.getElementById("teach").value.trim();
        const learn = document.getElementById("learn").value.trim();
        const message = document.getElementById("message");

        message.textContent = "Creating your account...";

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                    college: college,
                    skill_to_teach: teach,
                    skill_to_learn: learn
                }
            }
        });

        if (error) {
            message.textContent = "Error: " + error.message;
            return;
        }

        message.textContent =
            "Registration successful! Check your email if confirmation is required.";

        registerForm.reset();
    });
}

// Mobile navigation
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
}

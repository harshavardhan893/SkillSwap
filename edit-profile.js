
const form = document.getElementById("editProfileForm");

const fullNameInput = document.getElementById("fullName");
const teachInput = document.getElementById("teach");
const learnInput = document.getElementById("learn");

const message = document.getElementById("message");

let currentUser = null;

// Load the logged-in student's profile
async function loadProfile() {

    const { data: authData, error: authError } =
        await supabaseClient.auth.getUser();

    if (authError || !authData.user) {
        message.textContent = "Please log in first.";
        return;
    }

    currentUser = authData.user;

    const { data, error } = await supabaseClient
        .from("students")
        .select("full_name, skill_to_teach, skill_to_learn")
        .eq("auth_user_id", currentUser.id)
        .single();

    if (error) {
        message.textContent =
            "Could not load profile: " + error.message;
        return;
    }

    fullNameInput.value = data.full_name || "";
    teachInput.value = data.skill_to_teach || "";
    learnInput.value = data.skill_to_learn || "";
}

// Save updated profile
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    if (!currentUser) {
        message.textContent = "Please log in first.";
        return;
    }

    const fullName = fullNameInput.value.trim();
    const teach = teachInput.value.trim();
    const learn = learnInput.value.trim();

    if (!fullName || !teach || !learn) {
        message.textContent = "Please fill in all fields.";
        return;
    }

    const { error } = await supabaseClient
        .from("students")
        .update({
            full_name: fullName,
            skill_to_teach: teach,
            skill_to_learn: learn
        })
        .eq("auth_user_id", currentUser.id);

    if (error) {
        message.textContent =
            "Update failed: " + error.message;
        return;
    }

    message.textContent =
        "Profile updated successfully!";
});

loadProfile();

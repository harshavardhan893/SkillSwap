
const matchList = document.getElementById("matchList");

async function loadMatches() {
    const { data: authData, error: authError } =
        await supabaseClient.auth.getUser();

    if (authError || !authData.user) {
        matchList.textContent = "Please log in first.";
        return;
    }

    const { data: matches, error } =
        await supabaseClient.rpc("get_skill_matches");

    if (error) {
        matchList.textContent = "Error: " + error.message;
        return;
    }

    displayMatches(matches);
}

function displayMatches(matches) {
    matchList.innerHTML = "";

    if (!matches || matches.length === 0) {
        matchList.textContent = "No matching students found yet.";
        return;
    }

    matches.forEach(student => {
        const card = document.createElement("div");
        card.className = "student-card";

        const heading = document.createElement("h3");
        heading.textContent = student.full_name;

        const college = document.createElement("p");
        college.textContent = "College: " + student.college;

        const teach = document.createElement("p");
        teach.textContent = "Can teach: " + student.skill_to_teach;

        const learn = document.createElement("p");
        learn.textContent = "Wants to learn: " + student.skill_to_learn;

        const status = document.createElement("p");
        status.textContent = "Potential skill exchange match!";

        const requestButton = document.createElement("button");
        requestButton.textContent = "Send Exchange Request";

        requestButton.addEventListener("click", async function () {
            requestButton.disabled = true;
            requestButton.textContent = "Sending...";

            const { data: authData, error: authError } =
                await supabaseClient.auth.getUser();

            if (authError || !authData.user) {
                alert("Please log in again.");
                requestButton.disabled = false;
                requestButton.textContent = "Send Exchange Request";
                return;
            }

            const { error } = await supabaseClient.rpc(
                "send_exchange_request",
                {
                    p_receiver_id: student.student_id
                }
            );

            if (error) {
                alert("Request failed: " + error.message);
                requestButton.disabled = false;
                requestButton.textContent = "Send Exchange Request";
                return;
            }

            requestButton.textContent = "Request Sent!";
        });

        card.append(
            heading,
            college,
            teach,
            learn,
            status,
            requestButton
        );

        matchList.appendChild(card);
    });
}

loadMatches();

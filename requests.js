
const requestList = document.getElementById("requestList");

async function loadRequests() {
    requestList.textContent = "Loading requests...";

    const { data: authData, error: authError } =
        await supabaseClient.auth.getUser();

    if (authError || !authData.user) {
        requestList.textContent = "Please log in first.";
        return;
    }

    const { data, error } =
        await supabaseClient.rpc("get_my_exchange_requests");

    if (error) {
        requestList.textContent = "Error: " + error.message;
        return;
    }

    displayRequests(data);
}

function displayRequests(requests) {
    requestList.innerHTML = "";

    if (!requests || requests.length === 0) {
        requestList.textContent = "You have no exchange requests yet.";
        return;
    }

    requests.forEach(request => {
        const card = document.createElement("div");
        card.className = "request-card";

        const heading = document.createElement("h3");
        heading.textContent = request.other_student_name;

        const college = document.createElement("p");
        college.textContent =
            "College: " + request.other_student_college;

        const teach = document.createElement("p");
        teach.textContent =
            "Can teach: " + request.other_student_teach;

        const learn = document.createElement("p");
        learn.textContent =
            "Wants to learn: " + request.other_student_learn;

        const direction = document.createElement("p");
        direction.textContent =
            "Request type: " + request.direction;

        const status = document.createElement("p");
        status.className = "request-status";
        status.textContent =
            "Status: " + request.status;

        card.append(
            heading,
            college,
            teach,
            learn,
            direction,
            status
        );

        if (
            request.direction === "received" &&
            request.status === "pending"
        ) {
            const actions = document.createElement("div");
            actions.className = "request-actions";

            const acceptButton = document.createElement("button");
            acceptButton.textContent = "Accept";
            acceptButton.className = "accept-button";

            const rejectButton = document.createElement("button");
            rejectButton.textContent = "Reject";
            rejectButton.className = "reject-button";

            acceptButton.addEventListener("click", () => {
                respondToRequest(
                    request.request_id,
                    "accepted",
                    acceptButton,
                    rejectButton
                );
            });

            rejectButton.addEventListener("click", () => {
                respondToRequest(
                    request.request_id,
                    "rejected",
                    acceptButton,
                    rejectButton
                );
            });

            actions.append(acceptButton, rejectButton);
            card.appendChild(actions);
        }

        requestList.appendChild(card);
    });
}

async function respondToRequest(
    requestId,
    decision,
    acceptButton,
    rejectButton
) {
    acceptButton.disabled = true;
    rejectButton.disabled = true;

    const { error } = await supabaseClient.rpc(
        "respond_to_exchange_request",
        {
            p_request_id: requestId,
            p_decision: decision
        }
    );

    if (error) {
        alert("Could not update request: " + error.message);

        acceptButton.disabled = false;
        rejectButton.disabled = false;
        return;
    }

    alert("Request " + decision + " successfully!");

    loadRequests();
}

loadRequests();

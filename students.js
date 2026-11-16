
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");

let students = [];

async function loadStudents() {
    const { data: sessionData } =
        await supabaseClient.auth.getSession();

    if (!sessionData.session) {
        studentList.innerHTML =
            "<p>Please log in to view the student directory.</p>";
        return;
    }

    const { data, error } =
        await supabaseClient.rpc("get_student_directory");

    if (error) {
        studentList.textContent = "Error: " + error.message;
        return;
    }

    students = data;
    displayStudents(students);
}

function displayStudents(studentData) {
    studentList.innerHTML = "";

    if (studentData.length === 0) {
        studentList.innerHTML = "<p>No students registered yet.</p>";
        return;
    }

    studentData.forEach(student => {
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

        card.append(heading, college, teach, learn);
        studentList.appendChild(card);
    });
}

searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();

    const filteredStudents = students.filter(student =>
        [
            student.full_name,
            student.college,
            student.skill_to_teach,
            student.skill_to_learn
        ].some(value =>
            (value || "").toLowerCase().includes(searchText)
        )
    );

    displayStudents(filteredStudents);
});

loadStudents();

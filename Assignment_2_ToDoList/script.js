function addTask() {

    let input = document.getElementById("taskInput");
    let task = input.value.trim();

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    let li = document.createElement("li");

    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
        ${task}
        <button class="btn btn-danger btn-sm" onclick="deleteTask(this)">
            Delete
        </button>
    `;

    document.getElementById("taskList").appendChild(li);

    input.value = "";
}

function deleteTask(button) {
    button.parentElement.remove();
}
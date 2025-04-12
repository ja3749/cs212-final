$(document).ready(function () {

    const today = new Date();
    $('#date').html(`Today's date is ${today.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}.`)

    // J: I added some code that preserves the user's name!
    let username = localStorage.getItem('username');

    if (!username) {
        username = prompt("Hey, there! What's your name?");

        if (username === null || username.trim() === "") {
            console.log("No name given");
            username = "user";
        }

        localStorage.setItem("username", username);
    }

    $('#greeting').html(`Welcome, ${username}!`);

    let idOfTask = 0;
    let tasks = [];

    
    function totalTasks(returnWhat) {
        let completedTaskCount = 0;
        let pendingTaskCount = 0;
        let totalTaskCount = tasks.length;

        if (tasks.length > 0) {
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].completed) {
                    completedTaskCount++;
                } else {
                    pendingTaskCount++;
                }
            }
    
            switch (returnWhat) {
                case "total": return totalTaskCount;
                case "done": return completedTaskCount;
                case "pending": return pendingTaskCount;
            }
        }
        return 0;
    }

    function updateStats() {
        $('#taskTotal').html(`Total number of tasks: ${totalTasks("total")}`);
        $('#doneTaskTotal').html(`Completed Tasks: ${totalTasks("done")}`);
        $('#penTaskTotal').html(`Pending Tasks: ${totalTasks("pending")}`);
        $('#totalTasks').html(`You have ${totalTasks("pending")} tasks to do today.`)
    }

    updateStats();

    function getPriority(priorityNum) {
        priorityNum = Number(priorityNum);
        switch (priorityNum) {
            case 0: return "Highest";
            case 1: return "High";
            case 2: return "Medium";
            case 3: return "Low";
            case 4: return "Lowest";
        }
    }

    function renderTasks() {
        $('#taskList').empty();

        for (let i = 0; i < tasks.length; i++) {
            
            // If there is a need to change the structure of the card, then you may change the code as needed! - J.
            if (tasks[i].completed) {
                $('#taskList').append(`
                    <div class="col taskCard" data-index="${i}">
                        <div class="card p-3">
                            <h3>${tasks[i].title}</h3>
                            <p>Priority: <b>${getPriority(tasks[i].priority)}</b></p>
                            <p>${tasks[i].description}</p>
                            <div class="d-flex gap-2">
                            <button class="taskStatus btn btn-warning"><i class="fa-solid fa-clock"></i></button>
                            <button class="taskEdit btn btn-dark"><i class="fa-solid fa-pencil"></i></button>
                            <button class="taskDel btn btn-danger" id="deleteTask"><i class="fa-solid fa-trash"></i></button>
                            </div> <br>
                            <br>
                            <p>Due Date: ${tasks[i].deadline}</p>
                            <div class="editMenu" data-index="${i}"></div>
                        </div>
                    </div>
                `)
            } else {
                $('#taskList').append(`
                    <div class="col taskCard" data-index="${i}">
                        <div class="card p-3">
                            <h3>${tasks[i].title}</h3>
                            <p>Priority: <b>${getPriority(tasks[i].priority)}</b></p>
                            <p>${tasks[i].description}</p>
                            <div class="d-flex gap-2">
                            <button class="taskStatus btn btn-success"><i class="fa-solid fa-check"></i></button>
                            <button class="taskEdit btn btn-dark"><i class="fa-solid fa-pencil"></i></button>
                            <button class="taskDel btn btn-danger" id="deleteTask"><i class="fa-solid fa-trash"></i></button>
                            </div> <br>
                            <br>
                            <p>Due Date: ${tasks[i].deadline}</p>
                            <div class="editMenu" data-index="${i}"></div>
                        </div>
                    </div>
                `)
            }

            // After this comment will be code that determines whether the task is completed or not
            // for that visual distinction between pending and completed tasks every time
            // the task is rendered. - J.
        } 
    }

    renderTasks();

    function addTask(tskTitle, tskDesc, tskDate, tskPriority) {
        tasks.push({ title: $('#taskTitle').val().trim(), description: $('#taskDesc').val().trim(), deadline: $('#taskDeadline').val(), priority: $('#taskPriority').val(), completed: false} );
        renderTasks();
        updateStats();
    }

    function delTask(index) {
        tasks.splice(index, 1);
        renderTasks();
        updateStats();
    }

    $('#taskForm').on("submit", function (event) {
        event.preventDefault();
        addTask($('#taskTitle').val().trim(), $('#taskDesc').val().trim(), $('#taskDeadline').val(), $('#taskPriority').val());

        $('#taskTitle, #taskDesc, #taskDeadline, #taskPriority').val('');
    });
    
    $(document).on('click', '.taskDel', function () {
        const index = $(this).closest('.taskCard').attr('data-index');
        delTask(index);
    });

    $(document).on('click', '.taskEdit', function () {
        const editMenu = $(this).closest('.taskCard').find('.editMenu');
        const editButton= $(this).closest('.taskCard').find('.taskEdit');
        const i = $(this).closest('.taskCard').attr('data-index');
        editButton.hide();

        editMenu.append(`
                <form id="editTaskForm">
                    <b>Edit Task</b>
                    <input type="text" id="newTaskTitle" name="taskTitle" class="form-control" placeholder="${tasks[i].title}" value="${tasks[i].title}" required="">
                    <br>
                    <input type="text" id="newTaskDesc" name="taskDesc" class="form-control" placeholder="${tasks[i].description}" value="${tasks[i].description}" required="">
                    <br>
                    <input type="date" id="newTaskDeadline" name="taskDeadline" class="form-control" required="" value="${tasks[i].deadline}">
                    <br>
                    <label>Enter the task's new priority, if applicable.</label>
                    <br>
                    <input type="number" id="newTaskPriority" name="taskPriority" step="1" min="0" max="4" class="quantity field rounded text-center w-25" placeholder="${tasks[i].priority}" value="${tasks[i].priority}" required="">
                    <br><br>
                    <button type="submit" id="submitTask" class="btn btn-prinary">Edit task</button>
                    <button type="reset" id="cancelEdit" class="btn btn-secondary">Cancel edits</button>
                </form>
            `)

        $('#editTaskForm').on('submit', function () {
            tasks[i].title = $('#newTaskTitle').val().trim();
            tasks[i].description = $('#newTaskDesc').val().trim();
            tasks[i].deadline = $('#newTaskDeadline').val();
            tasks[i].priority = $('#newTaskPriority').val();
            editButton.show();
            editMenu.empty();

            renderTasks();
            updateStats();
        })

        $('#editTaskForm').on('reset', function () {
            editButton.show();
            editMenu.empty();

            renderTasks();
            updateStats();
        })
    });

    $(document).on('click', '.taskStatus', function () {
        const index = $(this).closest('.taskCard').attr('data-index');
        if (tasks[index].completed) {
            tasks[index].completed = false;
        } else {
            tasks[index].completed = true;
        }
        renderTasks();
        updateStats();
    });
})
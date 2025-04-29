$(document).ready(function () {

    const today = new Date();
    $('#date').html(`Today's date is ${today.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}.`)

    // J: I added some code that preserves the user's name!
    let username = localStorage.getItem('username');

    $('#taskForm').hide();

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

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    
    function loadTasks() {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        } 
    }

    loadTasks();

    
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
        $('#totalTasks').html(`You have ${totalTasks("pending")} ${(totalTasks("pending") == 1) ? "task" : "tasks"} to do today.`);
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
        $('#completedTaskList').empty();
        
        let pendingTasks = tasks.filter(task => !task.completed);
        let completedTasks = tasks.filter(task => task.completed);

        // If there is a need to change the structure of the card, then you may change the code as needed! - J.
        // Populate taskList
        if (pendingTasks.length === 0) {
            $('#taskList').append(`
                <div class="col text-center">
                    <p class="text-muted">No pending tasks found here.</p>
                </div>
            `);
        } else {
            pendingTasks.forEach((task, i) => {
                const newCard = $(`
                    <div class="col taskCard" data-index="${tasks.indexOf(task)}">
                        <div class="card p-3">
                            <img src="hero.png" class="card-img-top mb-2 rounded">
                            <h3>${task.title}</h3>
                            <p>Priority: <b>${getPriority(task.priority)}</b></p>
                            <p>${task.description}</p>
                            <div class="d-flex gap-2">
                                <button class="taskStatus btn btn-success"><i class="fa-solid fa-check"></i></button>
                                <button class="taskEdit btn btn-dark"><i class="fa-solid fa-pencil"></i></button>
                                <button class="taskDel btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                            </div> <br>
                            <br>
                            <p>Due Date: ${task.deadline}</p>
                            <div class="editMenu" data-index="${tasks.indexOf(task)}"></div>
                        </div>
                    </div>
                `);
                newCard.hide().appendTo('#taskList').fadeIn(300);
            });
        }
    
        // Populate completedTaskList
        if (completedTasks.length === 0) {
            $('#completedTaskList').append(`
                <div class="col text-center">
                    <p class="text-muted">No completed tasks found here.</p>
                </div>
            `);
        } else {
            completedTasks.forEach((task, i) => {
                const cardClass = "bg-light text-muted border-success";
                const newCompletedCard = $(`
                    <div class="col taskCard" data-index="${tasks.indexOf(task)}">
                        <div class="card p-3 ${cardClass}">
                            <img src="hero.png" class="card-img-top mb-2 rounded">
                            <h3>${task.title}</h3>
                            <p>Priority: <b>${getPriority(task.priority)}</b></p>
                            <p>${task.description}</p>
                            <div class="d-flex gap-2">
                                <button class="taskStatus btn btn-warning"><i class="fa-solid fa-clock"></i></button>
                                <button class="taskEdit btn btn-dark"><i class="fa-solid fa-pencil"></i></button>
                                <button class="taskDel btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                            </div> <br>
                            <br>
                            <p>Due Date: ${task.deadline}</p>
                            <div class="editMenu" data-index="${tasks.indexOf(task)}"></div>
                        </div>
                    </div>
                `);
                newCompletedCard.hide().appendTo('#completedTaskList').fadeIn(300);
            });
        }
    }

    renderTasks();

    function addTask(tskTitle, tskDesc, tskDate, tskPriority) {
        tasks.push({ title: tskTitle, description: tskDesc, deadline: tskDate, priority: tskPriority, completed: false} );
        saveTasks();
        updateStats();
        renderTasks();
    }

    function delTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        updateStats();
    }

    function updateEmptyMessages() {
        if ($('#taskList').children('.taskCard').length === 0) {
            $('#taskList').html(`
                <div class="col text-center">
                    <p class="text-muted">No pending tasks found here.</p>
                </div>
            `);
        }
    
        if ($('#completedTaskList').children('.taskCard').length === 0) {
            $('#completedTaskList').html(`
                <div class="col text-center">
                    <p class="text-muted">No completed tasks found here.</p>
                </div>
            `);
        }
    }

    $('#taskForm').on("submit", function (event) {
        event.preventDefault();
        addTask($('#taskTitle').val().trim(), $('#taskDesc').val().trim(), $('#taskDeadline').val(), $('input[name="taskPriority"]:checked').val());

        $('#taskTitle, #taskDesc, #taskDeadline, #taskPriority').val('');
        $('#taskForm')[0].reset();
    });

    $('#taskForm').on('reset', function() {
        $('#taskForm').slideUp();
        $('.add-task').slideDown();
    });
    
    $(document).on('click', '.taskDel', function () {
        const card = $(this).closest('.taskCard');
        const index = card.attr('data-index');

        card.fadeOut(300, function() {
            delTask(index);
            card.remove();
            updateEmptyMessages();
        });
    });

    $(document).on('click', '.add-task', function () {
        $('#taskForm').slideDown();
        $('.add-task').slideUp();
    });

    $(document).on('click', '.taskEdit', function () {
        const editMenu = $(this).closest('.taskCard').find('.editMenu');
        const editButton= $(this).closest('.taskCard').find('.taskEdit');
        const i = $(this).closest('.taskCard').attr('data-index');
        editButton.hide();

        editMenu.hide();

        editMenu.append(`
            <form class="editTaskForm">
                <b>Edit Task</b>
                <input type="text" id="newTaskTitle" name="taskTitle" class="form-control" placeholder="${tasks[i].title}" value="${tasks[i].title}" required="">
                <br>
                <input type="text" id="newTaskDesc" name="taskDesc" class="form-control" placeholder="${tasks[i].description}" value="${tasks[i].description}" required="">
                <br>
                <input type="date" id="newTaskDeadline" name="taskDeadline" class="form-control" required="" value="${tasks[i].deadline}">
                <br>
                <label>Enter the task's new priority, if applicable.</label>
                <br>
                <input type="radio" class="form-check-input" name="newTaskPriority" value="0" required> Highest <br>
                <input type="radio" class="form-check-input" name="newTaskPriority" value="1"> High <br>
                <input type="radio" class="form-check-input" name="newTaskPriority" value="2"> Medium <br>
                <input type="radio" class="form-check-input" name="newTaskPriority" value="3"> Low <br>
                <input type="radio" class="form-check-input" name="newTaskPriority" value="4"> Lowest <br><br>
                <button type="submit" id="submitTask" class="btn btn-primary"><i class="fa-solid fa-pencil"></i> Edit task</button>
                <button type="reset" id="cancelEdit" class="btn btn-secondary"><i class="fa-solid fa-window-close"></i> Cancel</button>
            </form>
        `);

        editMenu.slideDown(300);

        $(`input[name="newTaskPriority"][value="${tasks[i].priority}"]`).prop('checked', true);

        $('.editTaskForm').on('submit', function () {
            tasks[i].title = $('#newTaskTitle').val().trim();
            tasks[i].description = $('#newTaskDesc').val().trim();
            tasks[i].deadline = $('#newTaskDeadline').val();
            tasks[i].priority = $('input[name="newTaskPriority"]:checked').val();
            
            editMenu.slideUp(300, function() {
                editButton.show();
                editMenu.empty();

                saveTasks();
                updateStats();
                renderTasks();
            });
        })

        $('.editTaskForm').on('reset', function () {
            editMenu.slideUp(300, function() {
                editButton.show();
                editMenu.empty();
                
                saveTasks();
                updateStats();
                renderTasks();
            });
        })
    });

    $(document).on('click', '.taskStatus', function () {
        const card = $(this).closest('.taskCard');
        const index = card.attr('data-index');

        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        updateStats();

        card.fadeOut(300, function() {
            $('#taskList .text-center, #completedTaskList .text-center').remove();

            if (tasks[index].completed) {
                $('#completedTaskList').append(card);
            } else {
                $('#taskList').append(card);
            }
            card.fadeIn(300, function() {
                updateEmptyMessages();
            });
        });
    });

    $(document).on('click', '#sortDeadline', function() {
        tasks.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed - b.completed;
            return new Date(a.deadline) - new Date(b.deadline);
        });
        saveTasks();
        renderTasks();
    });

    $(document).on('click', '#sortPriority', function() {
        tasks.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed - b.completed;
            return a.priority - b.priority;
        });
        saveTasks();
        renderTasks();
    })
})

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
                            <h3 class="taskText">${task.title}</h3>
                            <p>Priority: <b>${getPriority(task.priority)}</b></p>
                            <p class="taskText">${task.description}</p>
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
                            <h3 class="taskText">${task.title}</h3>
                            <p>Priority: <b>${getPriority(task.priority)}</b></p>
                            <p class="taskText">${task.description}</p>
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


    // Highlight Function for Search - Sydney G
    function highlightText(text, keyword) {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // New: Search Functionality - Sydney G
        $('#searchInput').on('input', function () {
            const searchTerm = $(this).val().toLowerCase();
            filterTasks(searchTerm);
        });

        function filterTasks(searchTerm) {
            $('#taskList').empty();
            $('#completedTaskList').empty();

            let pendingTasks = tasks.filter(task => !task.completed && (task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm)));
            let completedTasks = tasks.filter(task => task.completed && (task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm)));

            // Populate pending tasks
            if (pendingTasks.length === 0) {
                        $('#taskList').append(`
            <div class="col text-center">
                <p class="text-muted">No matching pending tasks found.</p>
            </div>
        `);
            } else {
                pendingTasks.forEach((task, i) => {
                    $('#taskList').append(`
                        <div class="col taskCard" data-index="${tasks.indexOf(task)}">
                            <div class="card p-3">
                                <img src="hero.png" class="card-img-top mb-2 rounded">
                                <h3 class="taskText">${highlightText(task.title, searchTerm)}</h3>
                                <p class="taskText">Priority: <b>${getPriority(task.priority)}</b></p>
                                <p>${highlightText(task.description, searchTerm)}</p>
                                <div class="d-flex gap-2">
                                    <button class="taskStatus btn btn-success"><i class="fa-solid fa-check"></i></button>
                                    <button class="taskEdit btn btn-dark"><i class="fa-solid fa-pencil"></i></button>
                                    <button class="taskDel btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                                </div> <br><br>
                                <p>Due Date: ${task.deadline}</p>
                                <div class="editMenu" data-index="${tasks.indexOf(task)}"></div>
                            </div>
                        </div>
                    `);
        });
    }

            // Populate Completed Tasks
            if (completedTasks.length === 0) {
                $('#completedTaskList').append(`
                    <div class="col text-center">
                        <p class="text-muted">No matching completed tasks found.</p>
                    </div>
                `);
            } else {
                completedTasks.forEach((task, i) => {
                    const cardClass = "bg-light text-muted border-success";
                    $('#completedTaskList').append(`
                        <div class="col taskCard" data-index="${tasks.indexOf(task)}">
                            <div class="card p-3 ${cardClass}">
                                <img src="hero.png" class="card-img-top mb-2 rounded">
                                <h3 class="taskText">${task.title}</h3>
                                <p class="taskText">Priority: <b>${getPriority(task.priority)}</b></p>
                                <p>${task.description}</p>
                                <div class="d-flex gap-2">
                                    <button class="taskStatus btn btn-warning"><i class="fa-solid fa-clock"></i></button>
                                    <button class="taskEdit btn btn-dark"><i class="fa-solid fa-pencil"></i></button>
                                    <button class="taskDel btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                                </div> <br><br>
                                <p>Due Date: ${task.deadline}</p>
                                <div class="editMenu" data-index="${tasks.indexOf(task)}"></div>
                            </div>
                        </div>
                    `);
                });
            }
        }



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
        addTask($('#taskTitle').val().trim(), $('#taskDesc').val().trim(), $('#taskDeadline').val(), $('#taskPriority').val());

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

    $(document).on('click', '.taskEdit', function (e) {
        e.preventDefault();
    
        const taskCard = $(this).closest('.taskCard');
        const editMenu = taskCard.find('.editMenu');
        const editButton = taskCard.find('.taskEdit');
        const i = taskCard.attr('data-index');
    
        editButton.hide();
    
        editMenu.html(`
            <form class="editTaskForm">
                <b>Edit Task</b><br>
                <input type="text" name="taskTitle" class="form-control taskTitleInput" placeholder="${tasks[i].title}" value="${tasks[i].title}" required>
                <br>
                <input type="text" name="taskDesc" class="form-control taskDescInput" placeholder="${tasks[i].description}" value="${tasks[i].description}" required>
                <br>
                <input type="date" name="taskDeadline" class="form-control taskDeadlineInput" required value="${tasks[i].deadline}">
                <br>
                <label>Select the task's new priority, if applicable.</label>
                    <div class="mb-3">
                        <select class="form-select" id="newTaskPriority" name="taskPriority">
                          <option value="0">Highest</option>
                          <option value="1">High</option>
                          <option value="2">Medium</option>
                          <option value="3">Low</option>
                          <option value="4">Lowest</option>
                        </select>
                      </div>
                    <br>
                <button type="submit" class="btn btn-primary"><i class="fa-solid fa-pencil"></i> Edit task</button>
                <button type="button" class="btn btn-secondary cancelEdit"><i class="fa-solid fa-window-close"></i> Cancel</button>
            </form>
        `);
    
        $(`#newTaskPriority`).val(tasks[i].priority);
        
        editMenu.slideDown(300);
    });
    
    $(document).on('submit', '.editTaskForm', function (e) {
        e.preventDefault();
    
        const form = $(this);
        const taskCard = form.closest('.taskCard');
        const editMenu = taskCard.find('.editMenu');
        const editButton = taskCard.find('.taskEdit');
        const i = taskCard.attr('data-index');
    
        tasks[i].title = form.find('.taskTitleInput').val().trim();
        tasks[i].description = form.find('.taskDescInput').val().trim();
        tasks[i].deadline = form.find('.taskDeadlineInput').val();
        tasks[i].priority = form.find('#newTaskPriority').val();
    
        editMenu.slideUp(300, function () {
            editButton.show();
            editMenu.empty();
    
            saveTasks();
            updateStats();
            renderTasks();
        });
    });
    
    $(document).on('click', '.cancelEdit', function (e) {
        e.preventDefault();
    
        const form = $(this).closest('.editTaskForm');
        const taskCard = form.closest('.taskCard');
        const editMenu = taskCard.find('.editMenu');
        const editButton = taskCard.find('.taskEdit');
    
        editMenu.slideUp(300, function () {
            editButton.show();
            editMenu.empty();
    
            saveTasks();
            updateStats();
            renderTasks();
        });
    });


    $(document).on('click', '.taskStatus', function() {
        const card = $(this).closest('.taskCard');
        const index = card.attr('data-index');

        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        updateStats();

        card.fadeOut(300, function() {
            $('#taskList .text-center, #completedTaskList .text-center').remove();

            if (tasks[index].completed) {
                card.find('.card')
                    .addClass('bg-light text-muted border-success')
                $('#completedTaskList').append(card);
            } else {
                card.find('.card')
                    .removeClass('bg-light text-muted border-success')
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

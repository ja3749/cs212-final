$(document).ready(function () {


    // Phase 1: Work towards displaying tasks as cards on the dashboard
    let idOfTask = 0;
    let tasks = [ { id: 0, title: "Task 1", description: "Task 1 description", deadline: "05/08/2025", priority: 0 } ]

    function getPriority(priorityNum) {
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
            
            // 
            $('#taskList').append(`
                <div class="col" id="taskCard" data-index="${tasks[i].id}">
                    <div class="card p-3">
                        <h4>${tasks[i].title} - Priority: ${getPriority(tasks[i].priority)}}</h4>
                        <div class="col">
                            <
                        </div>
                        <p>${tasks[i].description}</p>
                        <p>Due Date: ${tasks[i].deadline}</p>
                    </div>
                </div>
            `)
        } 
    }

    function nextTaskID() {
        idOfTask++;
        return idOfTask
    } 

    function addTask(tskTitle, tskDesc, tskDate, tskPriority) {
        tasks.push({ id: nextTaskID(), title: $('#taskTitle').val().trim(), description: $('#taskDesc').val().trim(), deadline: $('#taskDeadline').val(), priority: $('#taskPriority').val()} );
        renderTasks();
    }

    function crud(action) {
        switch (action) {
            case "create":
                tasks.push( 
                    { id: nextTaskID(), 
                    title: $('#taskTitle').val().trim(), 
                    description: $('#taskDesc').val().trim(), 
                    deadline: $('#taskDeadline').val(), 
                    priority: $('#taskPriority').val()} )
                break;
            case "edit":

                break;
            case "delete":
                break;
        }
        renderTasks();
    }

    $('$taskForm').on("submit", function (event) {
        event.preventDefault();
        addTask($('#taskTitle').val().trim(), $('#taskDesc').val().trim(), $('#taskDeadline').val(), $('#taskPriority').val());

        $('#taskTitle, #taskDesc, #taskPriority').val('');
    })

})
const taskForm = document.getElementById('taskForm');                 //const is used to avoid reassignment
const taskName = document.getElementById('taskName');
const taskDesc = document.getElementById('taskDesc');
const taskList = document.getElementById('taskList');                 //to dynamically manage task list
const filterAll = document.getElementById('filterAll');               //to add functionality to All, Completed, Pending buttons
const filterCompleted = document.getElementById('filterCompleted');
const filterPending = document.getElementById('filterPending');

// Load tasks from browser's local storage or initialize empty array if no task is found
//tasks - an array to store all the tasks, localStorage-stores only strings, JSON.parse-converts into array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to display tasks
function showTasks(filter = 'all')                                     //optional parameter - (filter) with default value - (all)
{
  // Clear the task list
  taskList.innerHTML = '';                  
  //filters tasks array based on 'filter' parameter
  const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.status === filter);
  //loop through each task in filteredTasks array
  filteredTasks.forEach((task, index) => 
    {
    const taskElement = document.createElement('div');                 //create seperate div element for each task
    taskElement.classList.add('task');                                 //CSS class
    if (task.status === 'completed') {
      taskElement.classList.add('completed');                          //to apply specific CSS styling to completed tasks
    }
    taskElement.innerHTML = `
      <div>
        <h3>${task.name}</h3>
        <p>${task.description}</p>
      </div>
      <div class="actions">
        <button class="status" onclick="toggleStatus(${index})">${task.status === 'completed' ? 'Pending' : 'Completed'}</button>
        <button class="edit" onclick="editTask(${index})">Edit</button>
        <button class="delete" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(taskElement);
  });
}

// Function to add a new task
function addTask(name, description) 
{
  tasks.push({ name, description, status: 'pending' });               //default status:pending 
  localStorage.setItem('tasks', JSON.stringify(tasks));               //save tasks to local storage
  showTasks();
}

// Function to toggle task status
function toggleStatus(index) 
{
  tasks[index].status = tasks[index].status === 'completed' ? 'pending' : 'completed';
  localStorage.setItem('tasks', JSON.stringify(tasks));             //save updated tasks to local storage
  showTasks();
}

// Function to edit a task
function editTask(index) 
{
  const task = tasks[index];                                         //tasks object at specified index is stored in task variable
  taskName.value = task.name;                                 
  taskDesc.value = task.description;
  tasks.splice(index, 1);                                            //removes the task at specified index from tasks array
  localStorage.setItem('tasks', JSON.stringify(tasks));              //save edited tasks to local storage
  showTasks();
}

// Function to delete a task
function deleteTask(index) 
{
  tasks.splice(index, 1);                                            //splice - remove task at specified index
  localStorage.setItem('tasks', JSON.stringify(tasks));
  showTasks();
}

// Event listeners
taskForm.addEventListener('submit', (e) =>                           //e - event obj containing info about the event
  {
  e.preventDefault();                                               //prevents the brwoser from reloading the page whwn form is submitted
  addTask(taskName.value, taskDesc.value);                          //call addTask() function
  taskForm.reset();                                                 //reset the form
});

filterAll.addEventListener('click', () => showTasks('all'));
filterCompleted.addEventListener('click', () => showTasks('completed'));
filterPending.addEventListener('click', () => showTasks('pending'));

// Initial function calling to display tasks
showTasks();
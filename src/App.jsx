import { useState } from "react";

function App() {
  const [tasks, setTask] = useState([]);
  const [openSection, setOpenSection] = useState({
    taskForm: true,
    taskList: true,
    taskComplete: false,
  });
  const [sortType, setSortType] = useState("date");
  const [sortOrder, setSortOrdert] = useState("asc");

  function toggleSection(section) {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }
  function addTask(task) {
    setTask([...tasks, { ...task, completed: false, id: Date.now() }]);
  }
  function deleteTask(id) {
    setTask(tasks.filter((task) => task.id !== id));
  }
  function completeTask(id) {
    setTask(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  }
  function sortTask(tasks) {
    return tasks.slice().sort((a, b) => {
      if (sortType === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return sortOrder == "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return sortOrder === "asc"
          ? new Date(a.deadline) - new Date(b.deadline)
          : new Date(b.deadline) - new Date(a.deadline);
      }
    });
  }
  function toggleSortOrder(type) {
    if (sortType === type) {
      setSortOrdert(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortType(type);
      setSortOrdert("asc");
    }
  }
  const ActiveTask = sortTask(tasks.filter((task) => !task.completed));
  const ComplitedTask = tasks.filter((task) => task.completed);
  return (
    <div className='app'>
      <div className='task-container'>
        <h1>Task List with Priority</h1>
        <button
          className={`close-button ${openSection.taskForm ? "open" : ""}`}
          onClick={() => toggleSection("taskForm")}
        >
          +
        </button>
        {openSection.taskForm && <TaskForm addTask={addTask} />}
      </div>
      <div className='task-container'>
        <h2>Tasks</h2>
        <button
          className={`close-button ${openSection.taskList ? "open" : ""}`}
          onClick={() => toggleSection("taskList")}
        >
          +
        </button>
        <div className='sort-controls'>
          <button
            className={`sort-button ${sortType === "Date" ? "active" : ""}`}
            onClick={() => toggleSortOrder("Date")}
          >
            By Date{" "}
            {sortType === "Date" && (sortOrder === "asc" ? "\u2191" : "\u2193")}
          </button>
          <button
            className={`sort-button ${sortType === "priority" ? "active" : ""}`}
            onClick={() => toggleSortOrder("priority")}
          >
            By Priority{" "}
            {sortType === "priority" &&
              (sortOrder === "asc" ? "\u2191" : "\u2193")}
          </button>
        </div>
        {openSection.taskList && (
          <TaskList
            deleteTask={deleteTask}
            ActiveTask={ActiveTask}
            completeTask={completeTask}
          />
        )}
      </div>
      <div className='completed-task-container'>
        <h2>Completed Tasks</h2>
        <button
          className={`close-button ${openSection.taskComplete ? "open" : ""}`}
          onClick={() => toggleSection("taskComplete")}
        >
          +
        </button>
        {openSection.taskComplete && (
          <CompletedTaskList ComplitedTask={ComplitedTask} />
        )}
      </div>
    </div>
  );
}

function TaskForm({ addTask }) {
  const [title, setTitle] = useState();
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState();

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() && deadline) {
      addTask({ title, priority, deadline });
      setTitle("");
      setPriority("Low");
      setDeadline("");
    }
  }

  return (
    <form action='' className='task-form' onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Task Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        value={priority}
        required
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value='High'>High</option>
        <option value='Medium'>Medium</option>
        <option value='Low'>Low</option>
      </select>
      <input
        type='datetime-local'
        value={deadline}
        required
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type='submit'>Add Task</button>
    </form>
  );
}

function TaskList({ ActiveTask, deleteTask, completeTask }) {
  return (
    <ul className='task-list'>
      {ActiveTask.map((task) => (
        <TaskItem
          completeTask={completeTask}
          deleteTask={deleteTask}
          task={task}
          key={task.id}
        />
      ))}
    </ul>
  );
}
function CompletedTaskList({ ComplitedTask }) {
  return (
    <ul className='completed-task-list'>
      {ComplitedTask.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
      {/*<TaskItem task={task} />*/}
    </ul>
  );
}
function TaskItem({ task, deleteTask, completeTask }) {
  const { title, priority, deadline, id, completed } = task;
  return (
    <li className={`task-item ${priority.toLowerCase()}`}>
      <div className='task-info'>
        <div>
          {title} <strong> {priority}</strong>
        </div>
        <div className='task-dedline'>{deadline}</div>
      </div>
      <div className='task-buttons'>
        {!completed && (
          <button className='complete-button' onClick={() => completeTask(id)}>
            Complete
          </button>
        )}

        <button className='delete-button' onClick={() => deleteTask(id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default App;

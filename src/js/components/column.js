class Column {
    constructor(columnName) {
        this.columnName = columnName;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
        this.renderTasks();
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.renderTasks();
    }

    renderTasks() {
        const taskContainer = document.getElementById(this.columnName);
        taskContainer.innerHTML = '';
        this.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerText = task.title;
            taskContainer.appendChild(taskElement);
        });
    }
}

export default Column;
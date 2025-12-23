class TaskCard {
    constructor(task) {
        this.task = task;
    }

    render() {
        const card = document.createElement('div');
        card.className = 'task-card';

        const title = document.createElement('h3');
        title.textContent = this.task.title;
        card.appendChild(title);

        const description = document.createElement('p');
        description.textContent = this.task.description;
        card.appendChild(description);

        const category = document.createElement('p');
        category.textContent = `Category: ${this.task.category || 'Uncategorized'}`;
        card.appendChild(category);

        if (this.task.deadline) {
            const deadline = document.createElement('p');
            deadline.className = 'task-date deadline';
            deadline.innerHTML = `<strong>Deadline:</strong> ${new Date(this.task.deadline).toLocaleDateString()}`;
            card.appendChild(deadline);
        }

        if (this.task.schedule) {
            const schedule = document.createElement('p');
            schedule.className = 'task-date schedule';
            schedule.innerHTML = `<strong>Schedule:</strong> ${new Date(this.task.schedule).toLocaleDateString()}`;
            card.appendChild(schedule);
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => this.deleteTask();
        card.appendChild(deleteButton);

        return card;
    }

    deleteTask() {
        console.log(`Deleting task: ${this.task.id}`);
    }
}

export default TaskCard;
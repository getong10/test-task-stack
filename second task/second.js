class TaskManager {
  constructor(maxConcurrentTasks) {
    this.maxConcurrentTasks = maxConcurrentTasks;
    this.tasks = new Map();
    this.runningTasks = 0;
  }

  addTask(task, priority, dependencies = [], timeout) {
    const taskId = `task${this.tasks.size + 1}`;
    this.tasks.set(taskId, {
      task,
      priority,
      dependencies,
      status: 'pending',
      timeout: timeout ? setTimeout(() => this.cancelTask(taskId), timeout) : null,
      canceled: false,
      completed: false,
      error: null,
    });
    return taskId;
  }

  async executeTasks() {
    const taskQueue = Array.from(this.tasks.entries())
      .filter(([_, task]) => task.status === 'pending' && !task.canceled)
      .sort((a, b) => b[1].priority - a[1].priority);

    for (const [taskId, task] of taskQueue) {
      if (this.runningTasks < this.maxConcurrentTasks && this.canExecute(taskId)) {
        this.runningTasks++;
        this.tasks.get(taskId).status = 'running';
        try {
          await task.task();
          this.tasks.get(taskId).status = 'completed';
        } catch (error) {
          this.tasks.get(taskId).status = 'failed';
          this.tasks.get(taskId).error = error;
        } finally {
          this.runningTasks--;
          clearTimeout(task.timeout);
        }
      }
    }
  }

  canExecute(taskId) {
    const task = this.tasks.get(taskId);
    return task.dependencies.every(dep => {
      const depTask = this.tasks.get(dep);
      return depTask && (depTask.status === 'completed' || depTask.status === 'failed');
    });
  }

  cancelTask(taskId) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.canceled = true;
      task.status = 'canceled';
      clearTimeout(task.timeout);
    }
    for (const [id, t] of this.tasks.entries()) {
      if (t.dependencies.includes(taskId)) {
        this.cancelTask(id);
      }
    }
  }

  getStatus() {
    const status = {};
    for (const [taskId, task] of this.tasks.entries()) {
      status[taskId] = task.status;
    }
    return status;
  }

  changePriority(taskId, newPriority) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.priority = newPriority;
    }
  }
}

const taskManager = new TaskManager(2);

taskManager.addTask(async () => {
  console.log('Выполнение задачи 1');
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Задача 1 завершена');
}, 2, []);

taskManager.addTask(async () => {
  console.log('Выполнение задачи 2');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Задача 2 завершена');
}, 1, ['task1']);

taskManager.addTask(async () => {
  console.log('Выполнение задачи 3');
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Задача 3 завершена');
}, 3, []);

taskManager.addTask(async () => {
  console.log('Выполнение задачи 4');
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('Задача 4 завершена');
}, 1, ['task2', 'task3']);

taskManager.executeTasks().then(() => {
  console.log('Все задачи выполнены');
  console.log('Статус задач после выполнения:', taskManager.getStatus());
}).catch(error => {
  console.error('Ошибка при выполнении задач:', error);
});

const intervalId = setInterval(() => {
  const status = taskManager.getStatus();
  console.log('Текущий статус задач:', status);
  if (Object.values(status).every(s => s === 'completed' || s === 'failed' || s === 'canceled')) {
    clearInterval(intervalId);
  }
}, 500);

taskManager.addTask(async () => {
  console.log('Выполнение задачи 5');
  await new Promise((_, reject) => setTimeout(() => reject(new Error('Ошибка в задаче 5')), 1500));
}, 2, []);

taskManager.addTask(async () => {
  console.log('Выполнение задачи 6');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Задача 6 завершена');
}, 1, []);

taskManager.addTask(async () => {
  console.log('Выполнение задачи 7');
  await new Promise(resolve => setTimeout(resolve, 2500));
  console.log('Задача 7 завершена');
}, 2, ['task5']);

taskManager.executeTasks().then(() => {
  console.log('Все дополнительные задачи выполнены');
  console.log('Статус задач после выполнения дополнительных задач:', taskManager.getStatus());
}).catch(error => {
  console.error('Ошибка при выполнении дополнительных задач:', error);
});
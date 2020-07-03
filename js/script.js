'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted, todoContainer) {
    this.form = document.querySelector(form),
    this.input = document.querySelector(input),
    this.todoList = document.querySelector(todoList),
    this.todoCompleted = document.querySelector(todoCompleted),
    this.todoContainer = document.querySelector(todoContainer),
    this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
  }

  addToStorage() {
    localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem);
    this.addToStorage();
  }

  createItem = (todo) => {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `<span class="text-todo">${todo.value}</span>
    <div class="todo-buttons">
      <button class="todo-edit"></button>
      <button class="todo-remove"></button>
      <button class="todo-complete"></button>
    </div>`);

    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(event) {
    event.preventDefault();

    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey()
      }

      this.todoData.set(newTodo.key, newTodo);
      this.render();
      this.input.value = '';
    } else {
      alert('Нельзя добавить пустое дело!');
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(item) {
    let closestList = item.closest('.todo-list');

    if (closestList !== null) {
      this.todoData.delete(item.key);
    } else {
      this.todoData.delete(item.key);
    }

    this.render();
  }

  completedItem(item) {
    let closestList = item.closest('.todo-list');

    if (closestList !== null) {
      this.todoData.get(item.key).completed = true;
    } else {
      this.todoData.get(item.key).completed = false;
    }

    this.render();
  }

  handler(event) {
    let target = event.target;

    if (target.matches('.todo-complete')) {
      this.completedItem(target.closest('.todo-item'));
    } else if (target.matches('.todo-remove')) {
      this.deleteItem(target.closest('.todo-item'));
    } else if (target.matches('.todo-edit')) {

    }
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.todoContainer.addEventListener('click', this.handler.bind(this));
    this.render();
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();
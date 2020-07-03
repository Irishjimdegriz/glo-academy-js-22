'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted, todoContainer) {
    this.form = document.querySelector(form),
    this.input = document.querySelector(input),
    this.todoList = document.querySelector(todoList),
    this.todoCompleted = document.querySelector(todoCompleted),
    this.todoContainer = document.querySelector(todoContainer),
    this.animationFrame,
    this.todoAnimationCount = -100;
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
    // this.todoAnimationCount = -100;
    // this.animationFrame = requestAnimationFrame(this.animateTodo.bind(this, li));
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
    this.todoData.delete(item.key);
    let closestList = item.closest('.todo-list');

    if (closestList !== null) {
      this.todoList.querySelectorAll('li').forEach((elem) => {
        if (elem.key === item.key) {
          this.animationFrame = requestAnimationFrame(this.animateTodo.bind(this, elem, 0, 0));
        }
      });
    } else {
      this.todoComplete.querySelectorAll('li').forEach((elem) => {
        if (elem.key === item.key) {
          this.animationFrame = requestAnimationFrame(this.animateTodo.bind(this, elem, 0, 0));
        }
      });
    }
  }

  completedItem(item) {
    let closestList = item.closest('.todo-list');

    if (closestList !== null) {
      this.todoData.get(item.key).completed = true;
      this.todoList.querySelectorAll('li').forEach((elem) => {
        if (elem.key === item.key) {
          this.animationFrame = requestAnimationFrame(this.animateTodo.bind(this, elem, 0, 0));
        }
      });
      this.todoCompleted.querySelectorAll('li').forEach((elem) => {
        if (elem.key === item.key) {
          this.animationFrame = requestAnimationFrame(this.animateTodo.bind(this, elem, 1, -100));
        }
      });
    } else {
      this.todoData.get(item.key).completed = false;
      this.todoCompleted.querySelectorAll('li').forEach((elem) => {
        if (elem.key === item.key) {
          this.animationFrame = requestAnimationFrame(this.animateTodo.bind(this, elem, 0, 0));
        }
      });
      this.todoList.querySelectorAll('li').forEach((elem) => {
        if (elem.key === item.key) {
          this.animationFrame = requestAnimationFrame(this.animateTodo.bind(this, elem, 1, -100));
        }
      });
    }

    //this.render();
  }

  animateTodo(element, mode, counter) {
    counter++;
    element.style.left = `${counter}%`;  
    
    if (mode === 0) {
      if (counter < 100) {
        this.animationFrame = requestAnimationFrame(this.animateTodo.bind(this, element, mode, counter));
      } else {        
        this.render();
      }
    } else {
      if (counter < 0) {
        this.animationFrame = requestAnimationFrame(this.animateTodo.bind(this, element, mode, counter));
      } else {        
        this.render();
      }
    }
  }

  handler(event) {
    let target = event.target;

    if (target.matches('.todo-complete')) {
      this.completedItem(target.closest('.todo-item'));
    } else if (target.matches('.todo-remove')) {
      this.deleteItem(target.closest('.todo-item'));
    } else if (target.matches('.todo-edit')) {
      const todoItem = target.closest('.todo-item');
      if (todoItem.getAttribute('contentEditable')) {
        this.todoData.get(todoItem.key).value = todoItem.textContent;
        this.addToStorage();
        todoItem.setAttribute('contentEditable', false);
      } else {
        todoItem.setAttribute('contentEditable', true);
        todoItem.addEventListener('keydown', (event) => {
          if (event.code === 'Enter') {
            this.todoData.get(todoItem.key).value = todoItem.textContent;
            this.addToStorage();
            todoItem.setAttribute('contentEditable', false);
          }
        });
      }
    }
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.todoContainer.addEventListener('click', this.handler.bind(this));
    this.todoContainer.style.overflow = 'hidden';
    // document.addEventListener('keydown', (event) => {
    //   if ()
    // });
    this.render();
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();
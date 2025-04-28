document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const landingPage = document.querySelector('.landing-page');
    const todoApp = document.querySelector('.todo-app');
    const enterBtn = document.querySelector('.enter-btn');
    const backBtn = document.querySelector('.back-btn');
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.querySelector('.todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.querySelector('.clear-completed');
    const itemsLeft = document.querySelector('.items-left');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTodos();
        updateItemsLeft();
    }
    
    // Navigation between landing page and todo app
    enterBtn.addEventListener('click', function() {
        landingPage.classList.add('hidden');
        todoApp.classList.add('active');
        setTimeout(() => {
            landingPage.style.display = 'none';
        }, 500);
    });
    
    backBtn.addEventListener('click', function() {
        todoApp.classList.remove('active');
        landingPage.style.display = 'flex';
        setTimeout(() => {
            landingPage.classList.remove('hidden');
        }, 50);
    });
    
    // Add new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.unshift(newTodo);
            saveTodos();
            renderTodos();
            todoInput.value = '';
            updateItemsLeft();
        }
    }
    
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Render todos based on current filter
    function renderTodos() {
        todoList.innerHTML = '';
        
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }
        
        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = currentFilter === 'all' ? 
                'No tasks yet. Add one above!' : 
                `No ${currentFilter} tasks.`;
            emptyMessage.classList.add('empty-message');
            todoList.appendChild(emptyMessage);
        } else {
            filteredTodos.forEach(todo => {
                const todoItem = document.createElement('li');
                todoItem.classList.add('todo-item');
                if (todo.completed) {
                    todoItem.classList.add('completed');
                }
                
                todoItem.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                `;
                
                const checkbox = todoItem.querySelector('.todo-checkbox');
                const deleteBtn = todoItem.querySelector('.delete-btn');
                const todoText = todoItem.querySelector('.todo-text');
                
                checkbox.addEventListener('change', function() {
                    todo.completed = this.checked;
                    saveTodos();
                    todoItem.classList.toggle('completed', todo.completed);
                    todoText.style.textDecoration = todo.completed ? 'line-through' : 'none';
                    updateItemsLeft();
                    
                    // Re-render if we're on active/completed filter
                    if (currentFilter !== 'all') {
                        setTimeout(() => {
                            renderTodos();
                        }, 300);
                    }
                });
                
                deleteBtn.addEventListener('click', function() {
                    todos = todos.filter(t => t.id !== todo.id);
                    saveTodos();
                    todoItem.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        renderTodos();
                        updateItemsLeft();
                    }, 300);
                });
                
                // Double click to edit
                todoText.addEventListener('dblclick', function() {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = todo.text;
                    input.classList.add('edit-input');
                    
                    todoItem.replaceChild(input, todoText);
                    input.focus();
                    
                    const handleBlurOrEnter = () => {
                        const newText = input.value.trim();
                        if (newText) {
                            todo.text = newText;
                            saveTodos();
                        }
                        renderTodos();
                    };
                    
                    input.addEventListener('blur', handleBlurOrEnter);
                    input.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            handleBlurOrEnter();
                        }
                    });
                });
                
                todoList.appendChild(todoItem);
            });
        }
    }
    
    // Filter todos
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTodos();
        });
    });
    
    // Clear completed todos
    clearCompletedBtn.addEventListener('click', function() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
        updateItemsLeft();
    });
    
    // Update items left counter
    function updateItemsLeft() {
        const count = todos.filter(todo => !todo.completed).length;
        itemsLeft.textContent = `${count} ${count === 1 ? 'item' : 'items'} left`;
    }
    
    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    // Initialize the app
    init();
    
    // Add fadeOut animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
});
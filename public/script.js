function renderTodos(todosArray) {
    const todosHtmlArray = todosArray.map(todo => {
        return `<li class="${todo.completed ? 'completed' : 'incomplete'}">${todo.text}
        <button class="delete-button" data-id="${todo.id}">x</button>
        </li>`
    })
    return todosHtmlArray.join('')
}

function fetchTodos() {
    fetch('/api/v1/todos')
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            todos.innerHTML = renderTodos(data)
        })
}

const todos = document.getElementById('todos')
const todosForm = document.getElementById('todoForm')

fetchTodos()

todosForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // console.log('test')
    const input = document.getElementById('todo_text')
    fetch('/api/v1/todos', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: input.value
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error)
            }
            fetchTodos()
            todosForm.reset()
        })
})

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
        // delete behavior
        const id = e.target.dataset.id;
        fetch(`/api/v1/todos/${id}`, {
            method: 'DELETE',
        })
            .then(res => !res.ok && res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error)
                }
                fetchTodos()
            })
    }
})
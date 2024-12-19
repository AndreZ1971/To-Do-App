// Variablen für statische HTML-Elemente
const todoForm = document.querySelector('.todo-form'); // Das Formular
const todoInput = document.querySelector('.todo-input'); // Das Eingabefeld
const todoList = document.querySelector('.todo-list'); // Die Liste der Aufgaben
const todoCount = document.querySelector('.todo-count'); // Zeigt die Anzahl der offenen Aufgaben an

// Array zum Speichern der Aufgaben
let todos = [];

/**
 * Funktion: Lade Todos aus dem localStorage
 * Lädt gespeicherte Aufgaben und speichert sie im `todos`-Array.
 * Wenn keine Daten vorhanden sind, wird `todos` auf ein leeres Array gesetzt.
 */
function loadTodos() {
    const storedTodos = localStorage.getItem('todos'); // Lade gespeicherte Daten
    todos = storedTodos ? JSON.parse(storedTodos) : []; // Konvertiere oder setze auf ein leeres Array
}

/**
 * Funktion: Speichere Todos in den localStorage
 * Speichert das aktuelle `todos`-Array als JSON-String im localStorage.
 */
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos)); // Speichere als JSON-String
}

/**
 * Funktion: Rendere Todos
 * Aktualisiert die UI, um die Aufgaben im `todos`-Array anzuzeigen.
 */
function renderTodos() {
    todoList.innerHTML = ''; // Bestehende Liste leeren

    todos.forEach(task => {
        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');

        // Checkbox erstellen
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('todo-checkbox');
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Aufgabe erledigen');
        checkbox.addEventListener('change', () => toggleTaskStatus(task.id));

        // Text erstellen
        const taskSpan = document.createElement('span');
        taskSpan.classList.add('todo-text');
        taskSpan.textContent = task.text;

        if (task.completed) {
            taskSpan.style.textDecoration = 'line-through'; // Text durchstreichen, wenn erledigt
        }

        // Löschen-Button erstellen
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('todo-delete');
        deleteButton.textContent = 'Löschen';
        deleteButton.setAttribute('aria-label', 'Aufgabe löschen');
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        // Elemente zum Listenelement hinzufügen
        listItem.appendChild(checkbox);
        listItem.appendChild(taskSpan);
        listItem.appendChild(deleteButton);

        // Listenelement zur Liste hinzufügen
        todoList.appendChild(listItem);
    });

    // Aktualisiere die Anzahl der offenen Aufgaben
    updateTaskCount();
}

/**
 * Funktion: Aktualisiere die Anzahl der offenen Aufgaben
 * Zeigt die Anzahl der nicht erledigten Aufgaben in der UI an.
 */
function updateTaskCount() {
    const openTasks = todos.filter(task => !task.completed).length;
    todoCount.textContent = openTasks;
}

/**
 * EventListener für das Formular
 * Fügt eine neue Aufgabe hinzu und speichert sie im `todos`-Array.
 */
todoForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Verhindert das Standardverhalten (Seitenneuladen)

    const taskText = todoInput.value.trim(); // Eingabetext bereinigen
    if (taskText === '') return; // Beende die Funktion, wenn das Eingabefeld leer ist

    const newTask = {
        id: Date.now(), // Eindeutige ID basierend auf Zeitstempel
        text: taskText, // Text der Aufgabe
        completed: false // Standardmäßig nicht erledigt
    };

    todos.push(newTask); // Aufgabe ins Array hinzufügen
    saveTodos(); // Todos im localStorage speichern
    todoInput.value = ''; // Eingabefeld leeren
    renderTodos(); // Todos neu rendern
});

/**
 * Funktion: Status einer Aufgabe umschalten
 * Ändert den Status (erledigt/nicht erledigt) einer Aufgabe anhand ihrer ID.
 */
function toggleTaskStatus(id) {
    todos = todos.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTodos(); // Änderungen im localStorage speichern
    renderTodos(); // Todos neu rendern
}

/**
 * Funktion: Aufgabe löschen
 * Entfernt eine Aufgabe anhand ihrer ID aus dem `todos`-Array.
 */
function deleteTask(id) {
    todos = todos.filter(task => task.id !== id); // Aufgabe anhand der ID löschen
    saveTodos(); // Änderungen im localStorage speichern
    renderTodos(); // Todos neu rendern
}

// Todos beim Start der App laden und rendern
loadTodos();
renderTodos();


document.addEventListener("DOMContentLoaded", () => {
    // Elementy interfejsu użytkownika
    const authContainer = document.getElementById("auth-container");
    const registerContainer = document.getElementById("register-container");
    const loginContainer = document.getElementById("login-container");
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    const regUsernameInput = document.getElementById("reg-username");
    const regPasswordInput = document.getElementById("reg-password");
    const registerButton = document.getElementById("register-button");

    const loginUsernameInput = document.getElementById("login-username");
    const loginPasswordInput = document.getElementById("login-password");
    const loginButton = document.getElementById("login-button");

    const appContainer = document.getElementById("app-container");
    const logoutButton = document.getElementById("logout-button");
    const usernameDisplay = document.getElementById("username-display");

    // Elementy zarządzania zadaniami
    const taskList = document.getElementById("task-list");
    const taskInput = document.getElementById("task-input");
    const taskDeadline = document.getElementById("task-deadline");
    const taskCategory = document.getElementById("task-category");
    const addTaskButton = document.getElementById("add-task");
    const sortTasksButton = document.getElementById("sort-tasks");

    // Elementy kalendarza
    const calendarContainer = document.getElementById("calendar-container");
    const calendar = document.getElementById("calendar");
    const prevMonthButton = document.createElement("button");
    const nextMonthButton = document.createElement("button");
    const monthYearDisplay = document.createElement("span");

    // Ukryj kalendarz i aplikację na początku
    calendarContainer.style.display = "none";
    appContainer.style.display = "none";

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    let tasks = [];
    let users = JSON.parse(localStorage.getItem("users")) || {};
    let currentUser = null;

    // Dodanie nagłówka kalendarza
    const calendarHeader = document.createElement("div");
    calendarHeader.style.display = "flex";
    calendarHeader.style.justifyContent = "space-between";
    calendarHeader.style.alignItems = "center";
    calendarHeader.style.marginBottom = "10px";

    prevMonthButton.textContent = "Poprzedni";
    nextMonthButton.textContent = "Następny";
    monthYearDisplay.style.fontSize = "1.2em";
    monthYearDisplay.style.fontWeight = "bold";

    calendarHeader.appendChild(prevMonthButton);
    calendarHeader.appendChild(monthYearDisplay);
    calendarHeader.appendChild(nextMonthButton);
    calendarContainer.insertBefore(calendarHeader, calendar);

    // Nazwy miesięcy
    const months = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];

    // Funkcja generująca kalendarz
    function generateCalendar(month, year) {
        calendar.innerHTML = "";

        // Ustaw nagłówek z aktualnym miesiącem i rokiem
        monthYearDisplay.textContent = `${months[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Dodaj puste komórki na początku miesiąca
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("calendar-day");
            calendar.appendChild(emptyCell);
        }

        // Dodaj dni miesiąca
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("div");
            dayCell.classList.add("calendar-day");
            dayCell.textContent = day;

            const dayDate = new Date(year, month, day).toISOString().split("T")[0];
            const hasTask = tasks.some(task => task.deadline.startsWith(dayDate));
            if (hasTask) {
                dayCell.classList.add("selected");
                dayCell.addEventListener("click", () => showTasksForDate(dayDate));
            }

            calendar.appendChild(dayCell);
        }
    }

    // Funkcja wyświetlająca zadania na wybrany dzień
    function showTasksForDate(date) {
        const filteredTasks = tasks.filter(task => task.deadline.startsWith(date));
        alert(`Zadania na ${date}:\n${filteredTasks.map(task => `- ${task.text}`).join("\n") || "Brak zadań"}`);
    }

    // Funkcja aktualizująca kalendarz
    function updateCalendar() {
        generateCalendar(currentMonth, currentYear);
    }

    // Obsługa nawigacji między miesiącami
    prevMonthButton.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    nextMonthButton.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    // Przełączanie między logowaniem a rejestracją
    showRegisterLink.addEventListener("click", () => {
        loginContainer.style.display = "none";
        registerContainer.style.display = "block";
    });

    showLoginLink.addEventListener("click", () => {
        registerContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    // Rejestracja użytkownika
    registerButton.addEventListener("click", () => {
        const username = regUsernameInput.value.trim();
        const password = regPasswordInput.value.trim();

        if (username && password) {
            if (users[username]) {
                alert("Użytkownik o tej nazwie już istnieje.");
            } else {
                users[username] = { password };
                localStorage.setItem("users", JSON.stringify(users));
                regUsernameInput.value = "";
                regPasswordInput.value = "";
                alert("Rejestracja zakończona pomyślnie. Możesz się teraz zalogować.");
                showLoginLink.click();
            }
        } else {
            alert("Proszę wypełnić wszystkie pola.");
        }
    });

    // Logowanie użytkownika
    loginButton.addEventListener("click", () => {
        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (username && password) {
            if (users[username] && users[username].password === password) {
                currentUser = username;
                usernameDisplay.textContent = currentUser;

                authContainer.style.display = "none";
                appContainer.style.display = "block";
                calendarContainer.style.display = "block"; // Pokaż kalendarz
                updateCalendar();
            } else {
                alert("Nieprawidłowa nazwa użytkownika lub hasło.");
            }
        } else {
            alert("Proszę wypełnić wszystkie pola.");
        }
    });

    // Wylogowanie użytkownika
    logoutButton.addEventListener("click", () => {
        currentUser = null;
        authContainer.style.display = "block";
        appContainer.style.display = "none";
        calendarContainer.style.display = "none"; // Ukryj kalendarz
        taskList.innerHTML = ""; // Wyczyść listę zadań
    });

    // Dodawanie zadań
    addTaskButton.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        const deadline = taskDeadline.value;
        const category = taskCategory.value;

        if (taskText && deadline) {
            tasks.push({ text: taskText, deadline, category, done: false });
            taskInput.value = "";
            taskDeadline.value = "";
            updateCalendar();
        } else {
            alert("Wypełnij wszystkie pola zadania.");
        }
    });
});

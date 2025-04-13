
const calendarBody = document.getElementById("calendar-body");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentDate = new Date();
let trades = JSON.parse(localStorage.getItem("trades") || "{}");

function generateCalendar(date) {
    calendarBody.innerHTML = "";
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = date.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

    let row = document.createElement("tr");
    for (let i = 0; i < firstDay; i++) {
        row.appendChild(document.createElement("td"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
        }

        const cell = document.createElement("td");
        const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        cell.textContent = day;

        if (trades[fullDate]) {
            const type = trades[fullDate];
            cell.style.backgroundColor = type === "positivo" ? "#a5f7a5" : "#f7a5a5";
        }

        cell.addEventListener("click", () => {
            const tipo = prompt("Trade 'positivo' o 'negativo'?", trades[fullDate] || "");
            if (tipo === "positivo" || tipo === "negativo") {
                trades[fullDate] = tipo;
                localStorage.setItem("trades", JSON.stringify(trades));
                generateCalendar(currentDate);
            }
        });

        row.appendChild(cell);
    }
    calendarBody.appendChild(row);
}

prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
});

generateCalendar(currentDate);

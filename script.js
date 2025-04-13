let currentDate = new Date();
let tradeData = JSON.parse(localStorage.getItem("tradeData")) || {};

const calendarBody = document.getElementById("calendar-body");
const monthYearSpan = document.getElementById("month-year");
const totalElem = document.getElementById("total");
const positiveDaysElem = document.getElementById("positiveDays");
const negativeDaysElem = document.getElementById("negativeDays");

function saveData() {
  localStorage.setItem("tradeData", JSON.stringify(tradeData));
}

function renderCalendar() {
  calendarBody.innerHTML = "";
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  monthYearSpan.textContent = currentDate.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  
  // Trova il giorno della settimana del primo giorno del mese e il numero totale di giorni
  const firstDay = new Date(year, month, 1).getDay(); // Sunday = 0, Monday = 1...
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let date = 1;
  let row = document.createElement("tr");
  
  // Prima riga: crea celle vuote fino al primo giorno, poi le prime celle con i numeri
  for (let i = 0; i < 7; i++) {
    let cell = document.createElement("td");
    if (i < firstDay) {
      cell.textContent = "";
    } else {
      const fullDate = formatDate(year, month, date);
      cell.setAttribute("data-date", fullDate);
      cell.textContent = date;
      applyCellColor(cell, fullDate);
      // Aggiunge il click per inserire il valore
      cell.addEventListener("click", () => handleCellClick(fullDate));
      date++;
    }
    row.appendChild(cell);
  }
  calendarBody.appendChild(row);
  
  // Righe successive
  while (date <= daysInMonth) {
    row = document.createElement("tr");
    for (let i = 0; i < 7; i++) {
      if (date > daysInMonth) break;
      let cell = document.createElement("td");
      const fullDate = formatDate(year, month, date);
      cell.setAttribute("data-date", fullDate);
      cell.textContent = date;
      applyCellColor(cell, fullDate);
      cell.addEventListener("click", () => handleCellClick(fullDate));
      row.appendChild(cell);
      date++;
    }
    calendarBody.appendChild(row);
  }
  
  updateStats(year, month);
}

function formatDate(year, month, day) {
  return year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

function applyCellColor(cell, fullDate) {
  const value = tradeData[fullDate];
  if (value !== undefined) {
    if (value > 0) {
      cell.style.backgroundColor = "#a5f7a5"; // verde
    } else if (value < 0) {
      cell.style.backgroundColor = "#f7a5a5"; // rosso
    } else {
      cell.style.backgroundColor = "";
    }
  } else {
    cell.style.backgroundColor = "";
  }
}

function handleCellClick(fullDate) {
  const currentVal = (tradeData[fullDate] !== undefined) ? tradeData[fullDate] : "";
  const input = prompt("Inserisci il valore per il giorno " + fullDate + " (numero, usa - per negativo):", currentVal);
  if (input !== null) {
    const value = parseFloat(input);
    if (!isNaN(value)) {
      tradeData[fullDate] = value;
      saveData();
      renderCalendar();
    } else {
      alert("Inserisci un numero valido!");
    }
  }
}

function updateStats(year, month) {
  let total = 0;
  let positiveDays = 0;
  let negativeDays = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = formatDate(year, month, day);
    if (tradeData[fullDate] !== undefined) {
      const value = tradeData[fullDate];
      total += value;
      if (value > 0) positiveDays++;
      else if (value < 0) negativeDays++;
    }
  }
  totalElem.textContent = "Totale mese: " + total;
  positiveDaysElem.textContent = "Giorni positivi: " + positiveDays;
  negativeDaysElem.textContent = "Giorni negativi: " + negativeDays;
}

// Gestione dei pulsanti per navigare tra i mesi
document.getElementById("prev-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

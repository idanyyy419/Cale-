// Funzione per memorizzare i dati in localStorage
function saveData(date, value) {
    let data = JSON.parse(localStorage.getItem('tradeData')) || {};
    data[date] = value;
    localStorage.setItem('tradeData', JSON.stringify(data));
}

// Funzione per colorare la finestra in verde o rosso
function colorCell(value, cell) {
    if (value > 0) {
        cell.style.backgroundColor = 'green'; // Verde per positivo
    } else if (value < 0) {
        cell.style.backgroundColor = 'red'; // Rosso per negativo
    } else {
        cell.style.backgroundColor = ''; // Rimuovi il colore se il valore è zero
    }
}

// Funzione per caricare i dati e aggiornare l'interfaccia
function loadData() {
    const data = JSON.parse(localStorage.getItem('tradeData')) || {};
    const cells = document.querySelectorAll('.day-cell'); // Assicurati di avere una classe 'day-cell' sulle celle del calendario

    cells.forEach(cell => {
        const date = cell.getAttribute('data-date'); // Usa un attributo 'data-date' per identificare ogni giorno
        if (data[date]) {
            const value = data[date];
            cell.textContent = value;
            colorCell(value, cell);
        }
    });
}

// Funzione per calcolare statistiche e totale
function calculateStats() {
    const data = JSON.parse(localStorage.getItem('tradeData')) || {};
    let total = 0, positiveDays = 0, negativeDays = 0;

    Object.values(data).forEach(value => {
        total += value;
        if (value > 0) positiveDays++;
        else if (value < 0) negativeDays++;
    });

    document.getElementById('total').textContent = `Totale mese: ${total}`;
    document.getElementById('positiveDays').textContent = `Giorni positivi: ${positiveDays}`;
    document.getElementById('negativeDays').textContent = `Giorni negativi: ${negativeDays}`;
}

// Esegui il caricamento dei dati all'avvio
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    calculateStats();
});

// Aggiungi un ascoltatore di eventi per salvare il dato quando viene inserito
document.getElementById('saveButton').addEventListener('click', () => {
    const date = document.getElementById('dateInput').value; // Assicurati di avere un input per la data
    const value = parseFloat(document.getElementById('valueInput').value); // Assicurati di avere un input per il valore
    if (isNaN(value)) return alert('Inserisci un valore valido!');
    saveData(date, value);
    loadData();
    calculateStats();
});

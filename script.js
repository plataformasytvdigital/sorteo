document.addEventListener("DOMContentLoaded", function() {
    const currentDate = new Date().toLocaleDateString();
    document.getElementById('current-date').innerText = currentDate;

    // Crear círculos de números
    const numbersContainer = document.getElementById('numbers-container');
    for (let i = 0; i < 100; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.className = 'circle border';
        numberDiv.innerText = String(i).padStart(2, '0');
        numberDiv.onclick = () => openModal(i);
        numbersContainer.appendChild(numberDiv);
    }

    loadData();
    document.getElementById('restart-draw').onclick = restartDraw;
    document.getElementById('generate-pdf').onclick = generatePDF;
});

let selectedNumber;
let selectedNumberDiv;

function openModal(number) {
    selectedNumber = number;
    selectedNumberDiv = document.querySelector(`div.circle.border:nth-child(${selectedNumber + 1})`);
    $('#inputModal').modal('show');
}

function saveData(status) {
    const name = document.getElementById('customer-name').value.toUpperCase();
    const phone = document.getElementById('customer-phone').value;
    const countryCode = "57"; // Código de país para Colombia
    const fullPhone = `+${countryCode} ${phone}`;
    const userData = { number: selectedNumber.toString().padStart(2, '0'), name, phone: fullPhone, status };

    // Obtener datos existentes
    const storedData = JSON.parse(localStorage.getItem('lotteryData')) || [];

    // Comprobar si el número ya está en los datos
    const existingIndex = storedData.findIndex(data => data.number === userData.number);
    
    if (existingIndex > -1) {
        // Actualizar entrada existente
        storedData[existingIndex] = userData; // Actualizar toda la entrada
    } else {
        // Insertar nueva entrada
        storedData.push(userData);
    }

    localStorage.setItem('lotteryData', JSON.stringify(storedData));
    updateTable(storedData);
    updateCircleStyle(selectedNumberDiv, status);

    $('#inputModal').modal('hide');
}

function updateTable(data) {
    const tbody = document.getElementById('user-data-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Limpiar tabla antes de actualizar

    data.forEach(item => {
        const row = tbody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);

        cell1.className = `circle status-${item.status}`;
        cell1.innerText = item.number;
        cell2.innerText = item.name;
        cell2.style.fontWeight = 'bold';
        cell3.innerText = item.phone;
        cell3.style.fontWeight = 'bold';
        cell4.innerText = item.status === 'red' ? 'DEBE' : 'PAGO';
        cell4.className = `status-${item.status}`;
        cell4.style.fontWeight = 'bold';
        cell5.innerHTML = `<button class="btn btn-secondary" onclick="sendTicket('${item.name}', '${item.phone}')">Send Ticket</button>`;

        updateCircleStyle(cell1, item.status);
    });
}

function updateCircleStyle(cell, status) {
    switch (status) {
        case 'red':
            cell.style.backgroundColor = 'red';
            cell.style.color = 'white';
            break;
        case 'green':
            cell.style.backgroundColor = 'green';
            cell.style.color = 'white';
            break;
        default:
            cell.style.backgroundColor = ''; // Sin color
            cell.style.color = ''; // Sin color
            break;
    }
}

document.getElementById('save-button').onclick = () => saveData('default');
document.getElementById('must-button').onclick = () => saveData('red');
document.getElementById('payment-button').onclick = () => saveData('green');
document.getElementById('clear-button').onclick = clearData;

function clearData() {
    const storedData = JSON.parse(localStorage.getItem('lotteryData')) || [];
    const updatedData = storedData.filter(data => data.number !== selectedNumber.toString().padStart(2, '0'));

    localStorage.setItem('lotteryData', JSON.stringify(updatedData));
    updateTable(updatedData);

    // Restablecer el estilo del número seleccionado a disponible
    if (selectedNumberDiv) {
        selectedNumberDiv.style.backgroundColor = ''; // Sin color
        selectedNumberDiv.style.color = ''; // Sin color
    }

    // Limpiar los campos del modal
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';

    $('#inputModal').modal('hide');
}

function restartDraw() {
    localStorage.removeItem('lotteryData'); // Limpiar datos almacenados
    const tbody = document.getElementById('user-data-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Limpiar tabla
    const numbersContainer = document.getElementById('numbers-container');
    const numberDivs = numbersContainer.getElementsByClassName('circle border');
    for (let i = 0; i < numberDivs.length; i++) {
        numberDivs[i].style.backgroundColor = ''; // Sin color
        numberDivs[i].style.color = ''; // Sin color
    }
}

function loadData() {
    const storedData = JSON.parse(localStorage.getItem('lotteryData')) || [];
    updateTable(storedData);
    const numbersContainer = document.getElementById('numbers-container');
    storedData.forEach(item => {
        const numberDiv = numbersContainer.children[parseInt(item.number)];
        updateCircleStyle(numberDiv, item.status);
    });
}

function generatePDF() {
    alert("PDF generation feature to be implemented.");
}

function sendTicket(name, phone) {
    alert(`Sending ticket to ${phone}...`);
    // Aquí normalmente integrarías con una API de WhatsApp para enviar el mensaje
}

function sendTicket(name, phone) {
    const storedData = JSON.parse(localStorage.getItem('lotteryData')) || [];
    const ticketData = storedData.find(data => data.phone === phone);

    if (ticketData) {
        const ticketHtml = `
            <div style="border: 2px solid black; padding: 20px; width: 300px; text-align: center; font-family: Arial, sans-serif;">
                <h2>Ticket de Lotería</h2>
                <p><strong>Nombre:</strong> ${ticketData.name}</p>
                <p><strong>Número:</strong> ${ticketData.number}</p>
                <p><strong>Lotería:</strong> [Nombre de la Lotería]</p>
                <p><strong>Premio:</strong> [Valor del Premio]</p>
                <p><strong>Valor de la Boleta:</strong> [Valor de la Boleta]</p>
                <p><strong>Estado:</strong> ${ticketData.status === 'red' ? 'DEB' : 'PAGO'}</p>
            </div>
        `;

        // Mostrar el ticket en una ventana emergente
        const newWindow = window.open('', '_blank');
        newWindow.document.write(ticketHtml);
        newWindow.document.close();
        newWindow.focus();
    } else {
        alert("No se encontró información para este número.");
    }
}
function sendTicket(name, phone) {
    const storedData = JSON.parse(localStorage.getItem('lotteryData')) || [];
    const ticketData = storedData.find(data => data.phone === phone);

    if (ticketData) {
        const ticketMessage = `
            *Ticket de Lotería*
            Nombre: ${ticketData.name}
            Número: ${ticketData.number}
            Lotería: [Nombre de la Lotería]
            Premio: [Valor del Premio]
            Valor de la Boleta: [Valor de la Boleta]
            Estado: ${ticketData.status === 'red' ? 'DEBE' : 'PAGO'}
        `;

        const whatsappUrl = `https://wa.me/${ticketData.phone.replace('+57 ', '')}?text=${encodeURIComponent(ticketMessage)}`;

        // Abrir WhatsApp en una nueva pestaña
        window.open(whatsappUrl, '_blank');
    } else {
        alert("No se encontró información para este número.");
    }
}
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const storedData = JSON.parse(localStorage.getItem('lotteryData')) || [];
    
    const currentDate = new Date().toLocaleDateString();
    const drawDate = currentDate; // Puedes personalizar esto si tienes una fecha de sorteo específica
    const lotteryName = "[Nombre de la Lotería]";
    const prizeValue = "[Valor del Premio]";
    const ticketValue = "[Valor de la Boleta]";

    doc.setFontSize(16);
    doc.text("Resumen de Clientes", 14, 20);
    
    storedData.forEach((client, index) => {
        const yPosition = 30 + index * 60; // Espaciado entre los clientes
        doc.setFontSize(12);
        doc.text(`Nombre: ${client.name}`, 14, yPosition);
        doc.text(`Teléfono: ${client.phone}`, 14, yPosition + 10);
        doc.text(`Fecha de Sorteo: ${drawDate}`, 14, yPosition + 20);
        doc.text(`Fecha y Hora de Registro: ${new Date().toLocaleString()}`, 14, yPosition + 30);
        doc.text(`Lotería: ${lotteryName}`, 14, yPosition + 40);
        doc.text(`Premio: ${prizeValue}`, 14, yPosition + 50);
        doc.text(`Valor de la Boleta: ${ticketValue}`, 14, yPosition + 60);
        doc.text(`Estado: ${client.status === 'red' ? 'DEB' : 'PAGO'}`, 14, yPosition + 70);
        
        // Dibujar una línea roja separadora
        doc.setDrawColor(255, 0, 0);
        doc.line(14, yPosition + 75, 196, yPosition + 75); // Línea roja
    });

    doc.save("resumen_clientes.pdf");
}
function updateTable(data) {
    const tbody = document.getElementById('user-data-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Limpiar tabla antes de actualizar

    data.forEach(item => {
        const row = tbody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);

        cell1.className = `circle status-${item.status}`;
        cell1.innerText = item.number;
        cell2.innerHTML = `👤 ${item.name}`; // Emoji de usuario
        cell2.style.fontWeight = 'bold';
        cell3.innerHTML = `📱 ${item.phone}`; // Emoji de celular
        cell3.style.fontWeight = 'bold';

        // Estado con estrellas
        const statusText = item.status === 'red' ? 'DEBE' : 'PAGO';
        cell4.innerHTML = `⭐️ ${statusText} ⭐️`; // Nombre del estado entre estrellas
        cell4.className = `status-${item.status}`;
        cell4.style.fontWeight = 'bold';

        cell5.innerHTML = `<button class="btn btn-secondary" onclick="sendTicket('${item.name}', '${item.phone}')">Enviar Ticket</button>`;

        updateCircleStyle(cell1, item.status);
    });
}


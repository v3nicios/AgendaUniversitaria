document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userAuthenticated') !== 'true') {
        window.location.href = 'login.html';
    }

    const yearGrid = document.getElementById('year-grid');
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    meses.forEach((mes) => {
        const card = document.createElement('div');
        card.className = 'month-card';
        
        let dots = '';
        for (let i = 0; i < 31; i++) {
            dots += '<div class="dot"></div>';
        }

        card.innerHTML = `
            <div class="month-name">${mes}</div>
            <div class="mini-calendar-preview">${dots}</div>
        `;

        card.onclick = () => {
            alert(`Abrindo visão detalhada de ${mes}`);
            // window.location.href = `mes.html?mes=${mes}`;
        };

        yearGrid.appendChild(card);
    });

    document.getElementById('logout-btn').onclick = () => {
        localStorage.removeItem('userAuthenticated');
        window.location.href = 'login.html';
    };
});
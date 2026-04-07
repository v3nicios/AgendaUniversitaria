let tarefas = JSON.parse(localStorage.getItem('uniAgenda_tarefas')) || [];
let mesAtivoIndex = null;

const mesesInfo = [
    { nome: "Janeiro", dias: 31, feriados: [{ d: 1, n: "Ano Novo", t: "Nacional" }] },
    { nome: "Fevereiro", dias: 28, feriados: [{ d: 16, n: "Carnaval", t: "Facultativo" }] },
    { nome: "Março", dias: 31, feriados: [{d: 8, n: "Dia da Mulher", t: "Facultativo"}] },
    { nome: "Abril", dias: 30, feriados: [{ d: 10, n: "Páscoa", t: "Religioso" }] },
    { nome: "Maio", dias: 31, feriados: [{ d: 1, n: "Dia do Trabalho", t: "Nacional" }] },
    { nome: "Junho", dias: 30, feriados: [{ d: 20, n: "Corpus Christi", t: "Religioso" }] },
    { nome: "Julho", dias: 31, feriados: [] },
    { nome: "Agosto", dias: 31, feriados: [{ d: 11, n: "Dia dos Pais", t: "Facultativo" }] },
    { nome: "Setembro", dias: 30, feriados: [{ d: 7, n: "Independência do Brasil", t: "Nacional" }] },
    { nome: "Outubro", dias: 31, feriados: [{ d: 12, n: "Nossa Senhora Aparecida", t: "Nacional" }] },
    { nome: "Novembro", dias: 30, feriados: [{ d: 2, n: "Finados", t: "Nacional" }] },
    { nome: "Dezembro", dias: 31, feriados: [{ d: 25, n: "Natal", t: "Nacional" }] }
];



function renderDashboard() {
    const container = document.getElementById('year-grid');
    container.innerHTML = ''; 
    
    mesesInfo.forEach((mes, index) => { 
        const card = document.createElement('div');
        card.className = 'month-card';
        
        
        card.onclick = () => openMonthDetail(index);
        
        card.innerHTML = `
        <div class="month-name">${mes.nome} 2026</div>
        <div class="days-header">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
        </div>
        <div class="days-grid">
        ${generateDays(mes)}
        </div>
        <div class="legend-section">
        <p style="color: var(--text-muted); margin-bottom: 5px;">Feriados e datas:</p>
        ${mes.feriados.map(f => `
            <div class="legend-item">
            <span style="color: var(--accent-blue)">${f.d}</span> 
            <span>${f.n}</span> 
            <span class="tag">${f.t}</span>
            </div>
            `).join('')}
            </div>
            `;
            container.appendChild(card);
        });
    }

 function generateDays(mes) {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const mesAtualIndex = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const mesSendoRenderizadoIndex = mesesInfo.findIndex(m => m.nome === mes.nome);
    
    const primeiroDiaDaSemana = new Date(2026, mesSendoRenderizadoIndex, 1).getDay();

    let html = '';

    for (let x = 0; x < primeiroDiaDaSemana; x++) {
        html += `<div class="day-cell empty"></div>`;
    }

    let totalDias = mes.dias;
    if (mes.nome === "Fevereiro" && ((2026 % 4 === 0 && 2026 % 100 !== 0) || 2026 % 400 === 0)) {
        totalDias = 29;
    }

    for (let i = 1; i <= totalDias; i++) {
        let extraClass = '';
        const feriado = mes.feriados.find(f => f.d === i);
        
        if (i === diaAtual && mesSendoRenderizadoIndex === mesAtualIndex && anoAtual === 2026) {
            extraClass = 'day-today';
        } else if (feriado) {
            extraClass = feriado.t === 'Nacional' ? 'day-holiday' : 'day-event';
        }

        html += `<div class="day-cell ${extraClass}">${i}</div>`;
    }
    
    return html;
}



document.getElementById('logout-btn').onclick = () => window.location.href = 'index.html';
document.getElementById('btn-tracker').onclick = () => {window.location.href = 'atividades.html'; renderTracker();};



function showDashboard() {
    document.getElementById('year-grid').classList.remove('hidden');
    document.getElementById('view-month').classList.add('hidden');
    document.getElementById('btn-voltar').classList.add('hidden');
    document.getElementById('page-title').innerText = "Calendário Acadêmico 2026";
    renderDashboard();
}

function openMonthDetail(index) {
    mesAtivoIndex = index;
    document.getElementById('year-grid').classList.add('hidden');
    document.getElementById('view-month').classList.remove('hidden');
    document.getElementById('btn-voltar').classList.remove('hidden');
    document.getElementById('page-title').innerText = `${mesesInfo[index].nome} 2026`;
    renderMonthView();
}



function salvarTarefa() {
    const titulo = document.getElementById('task-title').value;
    const data = document.getElementById('task-date').value;
    const tipo = document.getElementById('task-type').value;
    const descricao = document.getElementById('task-description').value;

    if (!titulo || !data) return alert("Preencha os campos!");

    const novaTarefa = { id: Date.now(), titulo, data, tipo,descricao };
    tarefas.push(novaTarefa);
    
    
    localStorage.setItem('uniAgenda_tarefas', JSON.stringify(tarefas));
    
    fecharFormulario();
    renderMonthView();
}

function renderMonthView() {
    const mes = mesesInfo[mesAtivoIndex];
    const grid = document.getElementById('calendar-detailed-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= mes.dias; i++) {
        const diaFormatado = `2026-${String(mesAtivoIndex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        
        const tarefasDoDia = tarefas.filter(t => t.data === diaFormatado);

        const diaDiv = document.createElement('div');
        diaDiv.className = 'day-detailed';
        diaDiv.innerHTML = `
            <span class="day-label">${i}</span>
            <div class="event-container">
                ${tarefasDoDia.map(t => `
                    <div class="event-item ${t.tipo}">${t.titulo} - ${t.descricao || ''}</div>
                `).join('')}
            </div>
        `;
        grid.appendChild(diaDiv);
    }
}

function abrirFormulario() { document.getElementById('modal-tarefa').classList.remove('hidden'); }
function fecharFormulario() { document.getElementById('modal-tarefa').classList.add('hidden'); document.getElementById('task-title').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-description').value = ''; }




renderDashboard();
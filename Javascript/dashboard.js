let tarefas = JSON.parse(localStorage.getItem('uniAgenda_tarefas')) || [];
let mesAtivoIndex = null;

const mesesInfo = [
    { 
        nome: "Janeiro", dias: 31, feriados: [
            { d: 1, n: "Ano Novo", t: "Nacional" },
            { d: 4, n: "Instalação de Rondônia", t: "Estadual" }
        ] 
    },
    { 
        nome: "Fevereiro", dias: 28, feriados: [
            { d: 16, n: "Carnaval", t: "Facultativo" },
            { d: 17, n: "Carnaval", t: "Facultativo" }
        ] 
    },
    { 
        nome: "Março", dias: 31, feriados: [
            { d: 8, n: "Dia da Mulher", t: "Facultativo" }
        ] 
    },
    { 
        nome: "Abril", dias: 30, feriados: [
            { d: 3, n: "Sexta-feira Santa", t: "Religioso" },
            { d: 21, n: "Tiradentes", t: "Nacional" }
        ] 
    },
    { 
        nome: "Maio", dias: 31, feriados: [
            { d: 1, n: "Dia do Trabalho", t: "Nacional" },
            { d: 10, n: "Dia das Mães", t: "Facultativo" },
            { d: 24, n: "Nossa Senhora Auxiliadora", t: "Municipal" }
        ] 
    },
    { 
        nome: "Junho", dias: 30, feriados: [
            { d: 4, n: "Corpus Christi", t: "Facultativo" }
        ] 
    },
    { 
        nome: "Julho", dias: 31, feriados: [] 
    },
    { 
        nome: "Agosto", dias: 31, feriados: [
            { d: 9, n: "Dia dos Pais", t: "Facultativo" }
        ] 
    },
    { 
        nome: "Setembro", dias: 30, feriados: [
            { d: 7, n: "Independência do Brasil", t: "Nacional" }
        ] 
    },
    { 
        nome: "Outubro", dias: 31, feriados: [
            { d: 2, n: "Criação do Município de PVH", t: "Municipal" },
            { d: 12, n: "Nossa Senhora Aparecida", t: "Nacional" },
            { d: 28, n: "Dia do Servidor Público", t: "Facultativo" }
        ] 
    },
    { 
        nome: "Novembro", dias: 30, feriados: [
            { d: 2, n: "Finados", t: "Nacional" },
            { d: 15, n: "Proclamação da República", t: "Nacional" },
            { d: 20, n: "Dia da Consciência Negra", t: "Nacional" }
        ] 
    },
    { 
        nome: "Dezembro", dias: 31, feriados: [
            { d: 25, n: "Natal", t: "Nacional" }
        ] 
    }
];



function renderDashboard() {
    const container = document.getElementById('year-grid');
    container.innerHTML = ''; 
    
    mesesInfo.forEach((mes, index) => { 
        const card = document.createElement('div');
        card.className = 'month-card';
        card.onclick = () => openMonthDetail(index);
        
        const mesNumero = index + 1;
        const tarefasDoMes = tarefas.filter(t => {
            const [ano, mesT, dia] = t.data.split('-');
            return parseInt(mesT) === mesNumero;
        });

        card.innerHTML = `
            <div class="month-name">${mes.nome} 2026</div>
            <div class="days-header">
                <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
            </div>
            <div class="days-grid">
                ${generateDays(mes)}
            </div>
            <div class="legend-section">
                <p style="color: var(--text-muted); margin-bottom: 8px; font-weight: bold;">Atividades e Feriados:</p>
                
                ${mes.feriados.map(f => `
                    <div class="legend-item">
                        <span style="color: var(--accent-blue)">${f.d}</span> 
                        <span>${f.n}</span> 
                        <span class="tag">${f.t}</span>
                    </div>
                `).join('')}

                ${tarefasDoMes.map(t => {
                    const diaAtividade = t.data.split('-')[2];
                    const status = verificarStatusTarefa(t.data);
                    const corStatus = status === 'vencendo' ? 'var(--accent-red)' : 'var(--text-muted)';
                    
                    return `
                        <div class="legend-item">
                            <span style="color: ${corStatus}">${parseInt(diaAtividade)}</span> 
                            <span style="font-style: italic;">${t.titulo}</span>
                            <span class="tag" style="background: ${status === 'vencendo' ? 'var(--accent-red)' : '#4a5568'}">Atividade</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        container.appendChild(card);
    });
}

function verificarStatusTarefa(dataString) {
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    const [ano, mes, dia] = dataString.split('-');
    const dataTarefa = new Date(ano, mes - 1, dia);
    
    const diffTempo = dataTarefa.getTime() - hoje.getTime();
    const diffDias = Math.ceil(diffTempo / (1000 * 3600 * 24));

    if (diffDias >= 0 && diffDias <= 3) return 'vencendo';
    return 'normal';
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

    for (let i = 1; i <= mes.dias; i++) {
        let extraClass = '';
        const diaFormatado = `2026-${String(mesSendoRenderizadoIndex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        const tarefasDoDia = tarefas.filter(t => t.data === diaFormatado);
        const temVencendo = tarefasDoDia.some(t => verificarStatusTarefa(t.data) === 'vencendo');
        const temTarefaComum = tarefasDoDia.length > 0;

        const feriado = mes.feriados.find(f => f.d === i);
        
        if (temVencendo) {
            extraClass = 'day-vencendo';
        } 
        else if (temTarefaComum) {
            extraClass = 'day-event';
        }
        else if (i === diaAtual && mesSendoRenderizadoIndex === mesAtualIndex && anoAtual === 2026) {
            extraClass = 'day-today';
        } 
        else if (feriado) {
            extraClass = feriado.t === 'Nacional' ? 'day-holiday' : 'day-event-holiday';
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
        document.getElementsByClassName('sidebar-summary')[0].classList.remove('hidden');

    renderDashboard();
}

function openMonthDetail(index) {
    mesAtivoIndex = index;
    document.getElementById('year-grid').classList.add('hidden');
    document.getElementById('view-month').classList.remove('hidden');
    document.getElementById('btn-voltar').classList.remove('hidden');
    document.getElementById('page-title').innerText = `${mesesInfo[index].nome} 2026`;
    document.getElementsByClassName('sidebar-summary')[0].classList.add('hidden');
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
    atualizarResumo();
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


function atualizarResumo() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 

    let total = tarefas.length;
    let noPrazo = 0;
    let vencendo = 0;

    tarefas.forEach(t => {
        const [ano, mes, dia] = t.data.split('-'); 
        const dataTarefa = new Date(ano, mes - 1, dia);

        const diffTempo = dataTarefa.getTime() - hoje.getTime();
        const diffDias = Math.ceil(diffTempo / (1000 * 3600 * 24));

        if (diffDias >= 0) {
            noPrazo++; 
            
            if (diffDias <= 3) {
                vencendo++; 
            }
        }
    });

    document.getElementById('total-atividades').textContent = total;
    document.getElementById('atividades-no-prazo').textContent = noPrazo;
    document.getElementById('atividades-vencendo').textContent = vencendo;
}


renderDashboard();
atualizarResumo();
document.getElementById('logout-btn').onclick = () => window.location.href = 'index.html';


function renderTracker() {
    const listAtrasadas = document.getElementById('list-atrasadas');
    const listEmDia = document.getElementById('list-em-dia');
    const listConcluidas = document.getElementById('list-concluidas');
    const sectionAtrasadas = document.getElementById('section-atrasadas');
    const sectionConcluidas = document.getElementById('section-concluidas');

    if (!listEmDia) return;

    
    listAtrasadas.innerHTML = '';
    listEmDia.innerHTML = '';
    listConcluidas.innerHTML = '';

    const tarefas = JSON.parse(localStorage.getItem('uniAgenda_tarefas')) || [];
    const entregas = tarefas.filter(t => t.tipo === 'entrega');

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let temAtrasada = false;
    let temConcluida = false;

    entregas.forEach(tarefa => {
        const dataEntrega = new Date(tarefa.data + "T00:00:00");
        const diffTempo = dataEntrega - hoje;
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

        
        let statusClass = "status-tranquilo";
        if (tarefa.concluida) statusClass = "status-concluida";
        else if (diffDias < 0) statusClass = "status-atrasado";
        else if (diffDias <= 3) statusClass = "status-urgente";

        const cardHtml = `
            <div class="tracker-card ${statusClass}">
                <div class="tracker-info">
                    <h3>${tarefa.titulo} ${tarefa.concluida ? '✅' : ''}</h3>
                    <p>Prazo: ${dataEntrega.toLocaleDateString('pt-BR')}</p>
                </div>
                <div class="tracker-days">
                    <span class="days-count">${tarefa.concluida ? "OK" : (diffDias < 0 ? "!" : diffDias)}</span>
                    <span class="days-label">${tarefa.concluida ? "Feito" : "Dias"}</span>
                    
                    <div class="card-actions">
                        ${!tarefa.concluida ? `<button onclick="concluirTarefa(${tarefa.id})" class="btn-action btn-check">Concluir</button>` : ''}
                        <button onclick="excluirTarefa(${tarefa.id})" class="btn-action btn-trash">Excluir</button>
                    </div>
                </div>
            </div>
        `;

        if (tarefa.concluida) {
            listConcluidas.innerHTML += cardHtml;
            temConcluida = true;
        } else if (diffDias < 0) {
            listAtrasadas.innerHTML += cardHtml;
            temAtrasada = true;
        } else {
            listEmDia.innerHTML += cardHtml;
        }
    });

    sectionAtrasadas.classList.toggle('hidden', !temAtrasada);
    sectionConcluidas.classList.toggle('hidden', !temConcluida);
}

function concluirTarefa(id) {
    let tarefasAtuais = JSON.parse(localStorage.getItem('uniAgenda_tarefas')) || [];
    const index = tarefasAtuais.findIndex(t => t.id === id);
    if (index !== -1) {
        tarefasAtuais[index].concluida = true; 
        localStorage.setItem('uniAgenda_tarefas', JSON.stringify(tarefasAtuais));
        renderTracker();
    }
}

function excluirTarefa(id) {
    if (confirm("Tem certeza que deseja apagar permanentemente esta atividade?")) {
        let tarefasAtuais = JSON.parse(localStorage.getItem('uniAgenda_tarefas')) || [];
        tarefasAtuais = tarefasAtuais.filter(t => t.id !== id);
        localStorage.setItem('uniAgenda_tarefas', JSON.stringify(tarefasAtuais));
        renderTracker();
    }
}
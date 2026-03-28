document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulação de validação (como QA, você pode testar campos vazios aqui)
    if (email && password) {
        // Armazena no localStorage para simular uma sessão
        localStorage.setItem('userAuthenticated', 'true');
        // Redireciona para a página do Dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});
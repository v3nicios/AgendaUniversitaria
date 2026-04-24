



const FOTO_1_URL = "url('../images/Perfil1.jpg')";

const FOTO_2_URL = "url('../images/Perfil2.jpg')";

const ParaNaipe = document.getElementById('paranaipe');
document.addEventListener('DOMContentLoaded', iniciarNeveNaipes);



const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("dev")) {
    document.getElementById("qrcode").style.display = "flex";
} else {
    document.getElementById("qrcode").style.display = "none";
}
const btnFotoVeni = document.getElementById('fotodoveni');


btnFotoVeni.addEventListener('click', trocarFotoNoBotao);
ParaNaipe.addEventListener('click', pararNeveNaipes)








const NAIPES = ['♦️', '♠️', '♣️', '♥️'];


const footerEl = document.querySelector('#helpbody');

let intervalIdNeve; 


function criarNaipeCaindo() {


    const naipeEl = document.createElement('span');
    
    
    const naipeAleatorio = NAIPES[Math.floor(Math.random() * NAIPES.length)];
    naipeEl.textContent = naipeAleatorio;

    
    naipeEl.classList.add('naipe-caindo');
    
    //total da tela que ta pegando
    const startX = Math.random() * 95;
    naipeEl.style.left = `${startX}vw`;

    //cria um random para que os naipes caim em tempos diferentes
    const duration = Math.random() * 8 + 5; 
    naipeEl.style.animationDuration = `${duration}s`;

    
    footerEl.appendChild(naipeEl);

        naipeEl.addEventListener('animationend', () => {
        naipeEl.remove();
    });
}



function iniciarNeveNaipes() {
    //intervalo que cria a cada naipe
    intervalIdNeve = setInterval(criarNaipeCaindo, 350); 
    

}

function pararNeveNaipes() {
    clearInterval(intervalIdNeve);
    
    document.querySelectorAll('.naipe-caindo').forEach(el => el.remove());
}























function trocarFotoNoBotao() {
    const currentBackground = btnFotoVeni.style.backgroundImage;
    if (currentBackground == FOTO_2_URL) {

        btnFotoVeni.style.backgroundImage = FOTO_1_URL;
    } else {

        btnFotoVeni.style.backgroundImage = FOTO_2_URL;
    }
}

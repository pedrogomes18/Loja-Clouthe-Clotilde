
//Missão Visão, Valores e história
document.addEventListener("DOMContentLoaded", function() {
    const textVisao = document.getElementById('textVisao');
    textVisao.innerHTML = 'Nosso objetivo na Clouthe Clotilde é ser uma marca líder reconhecida globalmente pela sua abordagem inovadora à moda feminina. Pretendemos criar um impacto positivo nas vidas das mulheres, inspirando-as a abraçar sua individualidade e a enfrentar o mundo com confiança. Almejamos ser a marca de escolha para mulheres que buscam não apenas roupas, mas uma expressão autêntica de quem são.'

    const textMission = document.getElementById('textMission')
    textMission.innerHTML = 'Nossa missão na Clouthe Clotilde é capacitar e celebrar a individualidade das mulheres por meio da moda. Buscamos oferecer peças únicas e inspiradoras que não apenas refletem o estilo pessoal, mas também promovem a confiança e a autoexpressão. Comprometemo-nos a criar um ambiente onde cada mulher possa encontrar sua autenticidade e beleza interior através de nossas coleções.'

    const textHistory = document.getElementById('textHistory')
    textHistory.innerText = 'Fundada por Clotilde Moreira de Oliveira, a Clouthe Clotilde, loja de moda feminina, nasceu como um símbolo de empoderamento e estilo. Clotilde, inspirada por sua paixão pela moda e pelo desejo de capacitar as mulheres, criou a marca para oferecer roupas que expressassem individualidade. Com um compromisso, com a qualidade e a autenticidade, a Clouthe Clotilde se tornou um refúgio onde a moda se funde com a confiança feminina. O legado de Clotilde permeia cada coleção, construindo uma comunidade de mulheres confiantes e ousadas, unidas por um amor compartilhado pela moda.'
});


//Menu
window.addEventListener("scroll", function() {
    let menu = document.querySelector('#menu');

    menu.classList.toggle('rolagemMenu', window.scrollY > 0);
});

const voltarButton = document.getElementById('voltarButton');
voltarButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.history.back();
});

const btnEnviarHome = document.getElementById('btnEnviarHome')
btnEnviarHome.addEventListener('click', event =>{
    window.location.href = 'index.html'
})



//LOADER - Carrgar o conteúdo
document.addEventListener("DOMContentLoaded", function() {
    const boxLoader = document.querySelector('.boxLoader');
    boxLoader.style.display = 'none'

    const contents = document.querySelector('.inside');
    contents.style.display = 'block'
});











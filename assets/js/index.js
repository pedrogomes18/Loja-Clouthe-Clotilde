//Conexão com api
async function connectionApiProduct(id) {

    if(id !== undefined){
        const url = `https://entregavel.polijrinternal.com/produtos/${id}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.log('Erro na requisição:', response.status);
                createErrorMessage(response.status, 'Erro na requisição.');
            }
        } catch (error) {
            console.error('Erro na conexão com a API:', error);
            createErrorMessage('Erro', 'Erro na conexão com a API.');
        }
    }
    else{
        const url = `https://entregavel.polijrinternal.com/produtos`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.log('Erro na requisição:', response.status);
                createErrorMessage(response.status, 'Erro na requisição.');
            }
        } catch (error) {
            console.error('Erro na conexão com a API:', error);
            createErrorMessage('Erro', 'Erro na conexão com a API.');
        }
    }
    
}

function createErrorMessage(statusCode, message) {
    const body2 = document.getElementById('body');
    const body = document.createElement('div');
    const errorContainer = document.createElement('div');
    const errorCode = document.createElement('div');
    const errorMessage = document.createElement('div');

    body.classList.add('center');
    errorContainer.classList.add('error-container');
    errorCode.classList.add('error-code');
    errorMessage.classList.add('error-message');

    errorCode.textContent = statusCode;
    errorMessage.textContent = message;

    body2.appendChild(body);
    body.appendChild(errorContainer);
    errorContainer.appendChild(errorCode);
    errorContainer.appendChild(errorMessage);
}




//MENU
//Método/ Function para esconder menu
const toggleButton = document.getElementById("toggleButton");
const menu = document.getElementById("menu");
toggleButton.addEventListener("click", function() {
    console.log(toggleButton, menu)
    menu.classList.toggle("activeMenu");
});

window.addEventListener("scroll", function() {
    let menu1 = document.querySelector('#toggleButton');
    let menu2 = document.querySelector('#menu');

    menu1.classList.toggle('rolagem', window.scrollY > 500);
    menu2.classList.toggle('rolagem', window.scrollY > 500);
});

async function menuFilter() {
    const products = await connectionApiProduct();

        const menuItems = document.querySelectorAll('.nav-item');
        menuItems.forEach(item => {
        item.addEventListener('click', async function() {
            const valor = item.getAttribute('data-valor');


            console.log(valor)
            const filteredProducts = products.filter(product =>
                product.temporada.toLowerCase().includes(valor)
            );
        
        
            if (filteredProducts.length > 0) {
                renderProducts(filteredProducts);
                let temporadaArray = filteredProducts.map(product => product.temporada)
                let primeiroItem = temporadaArray[0].replace(/\d+/g, '');
                showToast(primeiroItem);
            } else {
                console.log('Não há');
                getAllProducts();
                showToast('Todos Os Nossos Produtos');
            }
        });
    });
    
}



//ABOUT
function aboutText(){
    const title = document.querySelector('#titleAbout');
    const text = document.querySelector('#text');
    const link = document.querySelector('#linkAbout')

    title.innerHTML = 'Sobre Nós'
    text.innerHTML = "Nossa linha busca priorizar realçar a beleza da mulher com cores vibrantes e chamativas, bem como todo nosso projeto e fazer com que todas as nossas peças mantenham harmonia entre si, não importa a composição."
    link.classList.add('linkAbout')
    link.innerHTML = 'Leia mais'
    link.style.cursor = 'pointer'

    link.addEventListener('click', () => {
        linkAbout.setAttribute('href', 'sobre.html');
    });
};



//SEARCH
const resultado = document.getElementById('resultado')
const search = document.getElementById('search')
const cards = document.getElementById('cards')

if(search){
    search.addEventListener('keyup', async (event) => {
        const searched = event.target.value;
        const productsFound = await productFilterSearch(searched);
        
        if(productsFound !== null || productsFound !==undefined){
            resultado.innerHTML = '';
            renderProducts(productsFound);
        }else{
            resultado.innerHTML = 'Nenhum produto encontrado';
            cards.innerHTML = ''
        }
    });
}


async function productFilterSearch(search){
    if(search !== null && search !== undefined){
        const products = await connectionApiProduct();
        return products.filter((product) =>{
            return product.nome.toLowerCase().includes(search.trim().toLowerCase());
        })
    }
}

//Carrinho
function getCart(){
    const carrinhoString = localStorage.getItem('carrinho');
    const carrinho = JSON.parse(carrinhoString) || [];
    return carrinho;
}

const comprarCarrinho = document.getElementById('cart')
const carrinhoBox = document.querySelector('.carrinhoBox')
if(comprarCarrinho){
    comprarCarrinho.addEventListener('click', ()=>{
        carrinhoBox.classList.toggle('activeCarrinho');
    })
}

function renderCart(carrinhoArray){
    const cartContainer = document.getElementById("containerCart");
    let carts = '';
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2
    });

    if (Array.isArray(carrinhoArray) && carrinhoArray.length > 0) {
        carrinhoArray.forEach((cart, index) => {
            const calc = calcuteDiscount(cart.porcentagem_de_desconto, cart.preco);
            carts += `
                <div class="cardCarrinho">
                    <div class="imgCarrinho">
                        <img src=${cart.foto} alt="${cart.nome}">
                    </div>
                    <div class="descricaoCarrinho">
                        <h4>${cart.temporada}</h4>
                        <h3>${cart.nome}</h3>
                        <p><span>${formatter.format(calc)}</span></p>
                    </div>
                </div>
            `;
            
        });
        cartContainer.insertAdjacentHTML('afterbegin', carts);
    }
}


//Produtos
async function getAllProducts() {
    try {
        const data = await connectionApiProduct();
        renderProducts(data);
    } catch (error) {
        console.error("Erro ao obter os dados da API:", error);
    }
}

function renderProducts(products) {
    const cardsContainer = document.getElementById("cards");
    let cards = '';

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2
    });

    const formatterPercen = new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 0
    });

    if (Array.isArray(products) && products.length > 0) {
        products.forEach((product, index) => {
            const calc = calcuteDiscount(product.porcentagem_de_desconto, product.preco);
            cards += `
            <a class="card" id="card${index}" href="produto.html?id=${product.id}">
                <div class="conteudo" id="conteudo${index}">
                    <h2>${product.nome}</h2>
                    <h3>Temporada: ${product.temporada}</h3>
                    <div class="price">
                        <span class="original-price">De: ${formatter.format(product.preco)}</span>
                        <br>
                        <span class="discount-price">${formatter.format(calc)} (${formatterPercen.format(product.porcentagem_de_desconto)} de desconto) </span>
                    </div>
                    <img src="${product.foto}" alt="${product.nome}"/>
                </div>
            </a>
            `;
        });

        cardsContainer.innerHTML = cards;

        const cardsLink = document.getElementsByClassName('card');
        Array.from(cardsLink).forEach((card, index) => {
            card.addEventListener('click', () => {
                window.location.href = `produto.html?id=${products[index].id}`;
                getCart();
            });
        });
    } else {
        cards = `<div id="no-products">Nenhum Produto disponível</div>`;
        cardsContainer.innerHTML = cards;
    }

    const boxLoader = document.querySelector('.boxLoader');
    const contents = document.querySelector('.inside');
    boxLoader.style.display = 'none';
    contents.style.display = 'block';

    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 25,
        speed: 400,
        glare: true
    });
}


function calcuteDiscount(discount, price){
    if(price && discount){
        const subtraction = price * discount;
        const discountedPrice = price - subtraction;
        return discountedPrice;
    }else{
        return null;
    }
}

//Mensagem informando em qual temporada você se encontra
function showToast(temporada) {
    const toastbox = document.querySelector('#toastbox');
    
    let toasting = document.createElement('div');
    toasting.classList.add('toasting');
    toasting.innerHTML = `<img src="./assets/img/icons/roupas-masculinas.png"/>${temporada}`; // Use crases (`) para interpolação
    toastbox.appendChild(toasting);

    setTimeout(()=>{
        toasting.remove();
    },3000)
}

//Carregadr toda a página
document.addEventListener("DOMContentLoaded", async function() {

    await menuFilter();
    await getAllProducts();

    const carrinho = getCart();
    if (carrinho.length > 0) {
        renderCart(carrinho);
        const cart = document.getElementById('cart');
        const cartCount = document.getElementById('cartCount');
        cart.style = 'opacity: 1; display:block';
        cartCount.textContent = carrinho.length;
        console.log(carrinho);
    }

    aboutText();
});



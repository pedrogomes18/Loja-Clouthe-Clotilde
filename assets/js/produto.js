//Conexão com API
const parametros = new URLSearchParams(window.location.search);
const id = parametros.get('id');

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


//Apresentar produtos
function calcuteDiscount(discount, price){
    if(price && discount){
        const subtraction = price * discount;
        const discountedPrice = price - subtraction;
        return discountedPrice;
    }else{
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    try {
        const product = await connectionApiProduct(id);
        if (product === null || product === undefined) {
            console.log('Produto Não encontrado');
            
        } else {
            const nameProduct = document.getElementById('nameProduct')
            const priceOriginal = document.getElementById('priceOriginal')
            const priceDiscount = document.getElementById('priceDiscount')
            const imageProduct = document.getElementById('imageProduct')
            const temporadaProduct = document.getElementById('temporadaProduct')
            
            const calc = calcuteDiscount(product.porcentagem_de_desconto, product.preco)

            const formatter = Intl.NumberFormat('pt-BR', {
                style:'currency',
                currency:'BRL',
                maximumFractionDigits: 2
            });

            const formatterPercen = new Intl.NumberFormat('pt-BR', { 
                style: 'percent', 
                minimumFractionDigits: 0 
            });

            nameProduct.innerHTML = product.nome
            temporadaProduct.innerHTML = `Temporada: ${product.temporada}`
            priceOriginal.innerHTML= `De: ${formatter.format(product.preco)}`
            priceDiscount.innerHTML = `Por: ${formatter.format(calc)} - (${formatterPercen.format(product.porcentagem_de_desconto)} de desconto)` 
            imageProduct.src = product.foto;

            tamanhoDisponiveis(product.tamanhos_disponiveis, product.id);


            const boxLoader = document.querySelector('.boxLoader');
            boxLoader.style.display = 'none';

            const contents = document.querySelector('.inside');
            contents.style.display = 'block';
            
            const carrinho = getCart();
            if(carrinho.length > 0){
                const cart = document.getElementById('cart');
                const cartCount = document.getElementById('cartCount')
                cart.style= 'opacity: 1; display:block'
                cartCount.textContent = carrinho.length
                renderCart(carrinho)
                console.log(carrinho)
            }

            VanillaTilt.init(document.querySelector("#imageProduct"),{
                max: 25,
                speed: 400,
                glare: true
            });
        }
    } catch (error) {
        console.error('Erro durante a execução:', error);
    }
});

function tamanhoDisponiveis(tamanho, id) {
    const conteinerBtn = document.getElementById('conteinerBtn');
    let medida = ''
    conteinerBtn.innerHTML = '';

    if (Array.isArray(tamanho)) {
        if (tamanho.length <= 0) {
            tamanho = `<div id="no-products">Nenhum Produto disponível</div>`;
        } else {
            tamanho.forEach(tamanho => {
                const button = document.createElement('button');
                button.classList.add('size');
                button.textContent = tamanho;
                button.setAttribute('data-valor', tamanho);
                conteinerBtn.appendChild(button);
            });

            const sizeButtons = document.querySelectorAll('.size');
            sizeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    sizeButtons.forEach(btn => btn.classList.remove('checado'));
                    button.classList.add('checado');
                    const selectedSize = button.getAttribute('data-valor');
                    console.log('Tamanho selecionado:', selectedSize);
                    medida = selectedSize
                });
            });

            const btnComprar = document.querySelector('#comprarProduto');
            btnComprar.addEventListener('click', async () => {
                const selectedButton = document.querySelector('.size.checado');
                if (selectedButton) {
                    btnComprar.innerHTML = '<div class="spin"></div>';
                    try {
                        const mensagem = await formaPagamento(id, medida);
                        if (mensagem === 'pago') {
                            btnComprar.classList.remove('button');
                            btnComprar.classList.add('sucess', 'disabled');
                            btnComprar.innerHTML = 'Sucesso';
                            selectedButton.style = 'background-color: #f0f0f0; color: #333;border-color: #007bff;'
                        } else if (mensagem === 'fechado') {
                            btnComprar.innerHTML = 'Comprar';
                        }
                    } catch (error) {
                        btnComprar.innerHTML = 'Comprar';
                    }
                }
            });

        }
    } else {
        console.error("Esgotado");
        return;
    }
}


//Carrinho
const carrinho = [];

const btnCart = document.getElementById('cartProd');
btnCart.addEventListener('click', async ()=>{
    const product = await connectionApiProduct(id);
    addCart(product);
});

const comprarCarrinho = document.getElementById('cart')
const carrinhoBox = document.querySelector('.carrinhoBox')
comprarCarrinho.addEventListener('click', ()=>{
    carrinhoBox.classList.toggle('activeCarrinho');
});

function getCart(){
    const carrinhoString = localStorage.getItem('carrinho');
    const carrinho = JSON.parse(carrinhoString) || [];
    return carrinho;
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
};

async function addCart(product){
    const cartCountElement = document.querySelector('#cartCount');

    const cartFromLocalStorage = getCart();//Pega o carrinho atual

    if (product && !buscaArray(product, cartFromLocalStorage)) {
        cartFromLocalStorage.push(product);
        setCart(cartFromLocalStorage);
        cartCountElement.textContent = cartFromLocalStorage.length;
        console.log(cartFromLocalStorage);
    } else {
        console.log("Produto já existe no carrinho");
    }
};

function buscaArray(product, arrayToSearch) {
    for (const produto of arrayToSearch) {
        if (produto.id === product.id) {
            return true;
        }
    }
    return false;
}

function setCart(cart){
    const carrinhoString = JSON.stringify(cart);
    localStorage.setItem('carrinho', carrinhoString);
}


//MENU
window.addEventListener("scroll", function() {
    let menu = document.querySelector('#menu');

    menu.classList.toggle('rolagemMenu', window.scrollY > 0);
});

//Voltar
const btnEnviarHome = document.getElementById('btnEnviarHome')
btnEnviarHome.addEventListener('click', event =>{
    window.location.href = 'index.html'
})


//Button
const voltarButton = document.getElementById('voltarButton');
voltarButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.history.back();
});


//Forma de Pagamento - Abri modal
async function formaPagamento(id, tamanho) {
    const myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();

    const product = await connectionApiProduct(id);

    const formatter = Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2
    });

    const price = formatter.format(calcuteDiscount(product.porcentagem_de_desconto, product.preco))

    const nome = document.getElementById('nome').innerHTML = product.nome;
    const temporada = document.getElementById('temporada').innerHTML = product.temporada;
    const medida = document.getElementById('tamanho').innerHTML = `Tamanho: ${tamanho}`;
    const preco = document.getElementById('preco').innerHTML = price;
    const close = document.getElementById('close');
    const submit = document.getElementById('submit');

    return new Promise((resolve, reject) => {
        close.addEventListener('click', (event) => {
            event.preventDefault();
            myModal.hide();
            reject('fechado');
        });

        submit.addEventListener('click', (event) => {
            event.preventDefault();
            const pago = 'pago';
            myModal.hide();
            resolve(pago);
        });
    });
}




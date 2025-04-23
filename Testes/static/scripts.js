// Estrutura de dados do carrinho (agora com quantidade)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Dados dos produtos (agora com descrições completas)
const products = {
    'Imagem 1': { 
        id: 1,
        price: 59.90,
        title: "Jogo de Aventura Épica",
        description: "Um jogo de aventura emocionante com gráficos incríveis e uma história cativante. Explore mundos vastos, resolva quebra-cabeças e enfrente desafios épicos.",
        image: "/static/imagens/produto1.jpg"
    },
    'Imagem 2': { 
        id: 2,
        price: 79.90,
        title: "Simulador de Corrida",
        description: "Experimente a emoção de corridas realistas com física avançada e mais de 100 carros licenciados. Compita online ou no modo carreira.",
        image: "/static/imagens/produto2.jpg"
    },
    'Imagem 3': { 
        id: 3,
        price: 49.90,
        title: "RPG de Fantasia",
        description: "Crie seu próprio herói e embarque em uma jornada através de terras mágicas. Com sistema de combate tático e desenvolvimento de personagem profundo.",
        image: "/static/imagens/produto3.jpg"
    }
};
let currentTab = 'games';

// Tema
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    
    const header = document.querySelector('header');
    header.classList.toggle('dark-mode');
    
    const footer = document.querySelector('footer');
    footer.classList.toggle('dark-mode');
    
    const links = document.querySelectorAll('nav ul li a');
    links.forEach(link => link.classList.toggle('dark-mode'));
}

// Carrinho
function addToCart(game) {
    const existingItem = cart.find(item => item.name === game);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: game,
            price: products[game].price,
            id: products[game].id,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    alert(`${game} foi adicionado ao carrinho!`);
}

function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItemList = document.getElementById('cart-item-list');
    const clearBtn = document.querySelector('.clear-cart');
    const totalElement = document.getElementById('cart-total') || document.createElement('div');
    
    // Soma total de itens (considerando quantidades)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        cartItemList.innerHTML = cart.map(item => `
            <li class="cart-item">
                <span class="item-name">${item.name}</span>
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <span class="item-price">R$${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart('${item.name}')" class="remove-item">×</button>
            </li>
        `).join('');
        
        totalElement.id = 'cart-total';
        totalElement.innerHTML = `<strong>Total: R$${total.toFixed(2)}</strong>`;
        cartItemList.after(totalElement);
        
        if (clearBtn) clearBtn.style.display = 'block';
    } else {
        cartItemList.innerHTML = 'Nenhum item no carrinho.';
        if (totalElement) totalElement.remove();
        if (clearBtn) clearBtn.style.display = 'none';
    }
}

// Nova função para alterar quantidade
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        
        // Remove item se quantidade chegar a zero
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    hideCheckout();
}

// Funções para o checkout
function showCheckout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    document.getElementById('checkout-section').style.display = 'block';
    document.getElementById('checkout-btn').style.display = 'none';
    
    // Atualizar resumo do pedido
    const orderSummary = document.getElementById('order-summary');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    orderSummary.innerHTML = `
        <ul>
            ${cart.map(item => `
                <li>${item.name} - ${item.quantity}x R$${item.price.toFixed(2)} = R$${(item.price * item.quantity).toFixed(2)}</li>
            `).join('')}
        </ul>
        <p><strong>Total: R$${total.toFixed(2)}</strong></p>
    `;
}

function hideCheckout() {
    document.getElementById('checkout-section').style.display = 'none';
    document.getElementById('checkout-btn').style.display = 'block';
}

// Event listener para o formulário de checkout
document.getElementById('checkout-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    
    // Simular processamento do pedido
    alert(`Pedido confirmado!\n\nNome: ${name}\nEmail: ${email}\nEndereço: ${address}\n\nTotal: R$${
        cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
    }`);
    
    // Limpar carrinho após compra
    clearCart();
});

function toggleCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.classList.toggle('hidden');
}

// Tabs
function switchTab(tab) {
    currentTab = tab;
    document.getElementById('games-section').style.display = tab === 'games' ? 'block' : 'none';
    document.getElementById('cart-section').style.display = tab === 'cart' ? 'block' : 'none';
}

// Funções para página de detalhes do produto
function loadProductDetails(productId) {
    const product = Object.values(products).find(p => p.id == productId);
    if (product) {
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-price').textContent = `R$${product.price.toFixed(2)}`;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-img').src = product.image;
    }
}

function addToCartCurrentProduct() {
    const productId = window.location.pathname.split('/')[2];
    const product = Object.values(products).find(p => p.id == productId);
    if (product) {
        addToCart(product.title);
        // Redirecionar para a página do carrinho após adicionar o produto
        window.location.href = '/cart';
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Inicialização
window.onload = function() {
    // Aplicar tema salvo
    if (localStorage.getItem('darkMode') === 'true') {
        toggleTheme();
    }
    
    // Atualizar carrinho
    updateCart();
    
    // Verificar se estamos na página de produtos ou na loja
    if (window.location.pathname.startsWith('/produto/')) {
        const productId = window.location.pathname.split('/')[2];
        loadProductDetails(productId);
    } else {
        // Verificar parâmetro tab na URL para abrir aba correta
        const tabParam = getQueryParam('tab');
        if (tabParam === 'cart' || tabParam === 'games') {
            switchTab(tabParam);
        } else {
            switchTab(currentTab);
        }
    }
}

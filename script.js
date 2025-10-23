const products = [
    { id: 1, name: 'Samsung Refrigerator', category: 'Refrigerator', price: 50000, icon: 'fa-snowflake', image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400' },
    { id: 2, name: 'LG Washing Machine', category: 'Washing Machine', price: 35000, icon: 'fa-soap', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400' },
    { id: 3, name: 'Panasonic Microwave', category: 'Microwave', price: 29000, icon: 'fa-fire', image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400' },
    { id: 4, name: 'Dell Laptop', category: 'Laptop', price: 42000, icon: 'fa-laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
    { id: 5, name: 'iPhone 15', category: 'Mobile', price:48999 , icon: 'fa-mobile-alt', image: 'iphone 15.jpg' },
    { id: 6, name: 'Canon Camera', category: 'Camera', price: 69999, icon: 'fa-camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' },
    { id: 7, name: 'Whirlpool Refrigerator', category: 'Refrigerator', price: 33000, icon: 'fa-snowflake', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400' },
    { id: 8, name: 'Bosch Washing Machine', category: 'Washing Machine', price: 28000, icon: 'fa-soap', image: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400' },
    { id: 9, name: 'HP Laptop', category: 'Laptop', price: 78000, icon: 'fa-laptop', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400' },
];

let cart = [];
let currentFilter = 'all';

function displayProducts(productsToShow) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productList.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No products found matching your criteria.</p>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <i class="fas ${product.icon}" style="display: none;"></i>
            </div>
            <h3>${product.name}</h3>
            <p class="category">${product.category}</p>
            <p class="price">Rs ${product.price}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                 Add to Cart
            </button>
        `;
        productList.appendChild(productCard);
    });
}

function filterCategory(category) {
    currentFilter = category;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (typeof event !== 'undefined' && event.target) {
        event.target.classList.add('active');
    }
    
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
});

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    showNotification(product);
}

function showNotification(product) {
    const notificationContainer = document.getElementById('notificationContainer');
    const notificationId = 'notification-' + Date.now();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.id = notificationId;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-check"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">Added to Cart!</div>
            <div class="notification-message">${product.name} has been added to your shopping cart.</div>
        </div>
        <button class="notification-close" onclick="removeNotification('${notificationId}')">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress"></div>
    `;
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        
        const progressBar = notification.querySelector('.notification-progress');
        setTimeout(() => {
            progressBar.style.transform = 'scaleX(0)';
        }, 10);
    }, 10);
    
    setTimeout(() => {
        removeNotification(notificationId);
    }, 4000);
}

function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function showCart() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = 'Rs 0';
    } else {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            const lineTotal = item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    Rs ${item.price} x ${item.quantity}
                </div>
                <div>
                    <strong>Rs ${lineTotal}</strong>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        document.getElementById('cartTotal').textContent = 'Rs ' + total;
    }
    
    modal.style.display = 'block';
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    showCart();
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function showCheckout() {
    if (cart.length === 0) {
        showNotification({ name: 'Your cart is empty! Add some items before checkout.' });
        return;
    }
    closeCart();
    document.getElementById('checkout-modal').style.display = 'block';
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function submitPayment(event) {
    event.preventDefault();
    showNotification({ name: 'Order placed successfully! Thank you for shopping with us.' });
    cart = [];
    updateCartCount();
    closeCheckout();
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', function() {
    const scrollTop = document.getElementById('scrollTop');
    if (window.pageYOffset > 300) {
        scrollTop.style.display = 'block';
    } else {
        scrollTop.style.display = 'none';
    }
});

window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === checkoutModal) {
        closeCheckout();
    }
}

displayProducts(products);

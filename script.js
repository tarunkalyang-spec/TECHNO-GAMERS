// Cart Management
let cart = JSON.parse(localStorage.getItem('gameHubCart')) || [];

// Update cart count on all pages
function updateCartCount() {
    const cartCounts = document.querySelectorAll('#cart-count');
    cartCounts.forEach(count => {
        count.textContent = cart.length;
    });
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('gameHubCart', JSON.stringify(cart));
    updateCartCount();
}

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const gameName = this.getAttribute('data-name');
        const gamePrice = parseFloat(this.getAttribute('data-price'));
        
        // Check if item already in cart
        const existingItem = cart.find(item => item.name === gameName);
        
        if (!existingItem) {
            cart.push({
                name: gameName,
                price: gamePrice
            });
            
            saveCart();
            
            // Visual feedback
            this.textContent = '✓ Added to Cart!';
            this.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '';
            }, 2000);
            
            showNotification(`${gameName} added to cart!`);
        } else {
            showNotification(`${gameName} is already in your cart!`);
        }
    });
});

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #00d9ff, #7b2ff7);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 217, 255, 0.5);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        showNotification('Thank you for subscribing! Check your email for exclusive deals! 🎮');
        this.reset();
    });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Thank you for contacting us! We\'ll get back to you within 24 hours.');
        this.reset();
    });
}

// Cart page functionality
if (window.location.pathname.includes('cart.html')) {
    const emptyCart = document.getElementById('emptyCart');
    const cartLayout = document.getElementById('cartLayout');
    const cartItemsList = document.getElementById('cartItemsList');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartLayout.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartLayout.style.display = 'grid';
        
        // Display cart items
        renderCartItems();
        updateCartSummary();
    }
}

function renderCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    const itemCount = document.getElementById('itemCount');
    const summaryItemCount = document.getElementById('summaryItemCount');
    
    if (!cartItemsList) return;
    
    cartItemsList.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-image-small pc-badge">🎮</div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-platform">Digital Download</p>
            </div>
            <div class="item-price">$${item.price.toFixed(2)}</div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        cartItemsList.appendChild(cartItem);
    });
    
    // Update item counts
    if (itemCount) itemCount.textContent = cart.length;
    if (summaryItemCount) summaryItemCount.textContent = cart.length;
    
    // Add remove button listeners
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const itemName = cart[index].name;
            cart.splice(index, 1);
            saveCart();
            showNotification(`${itemName} removed from cart`);
            
            if (cart.length === 0) {
                location.reload();
            } else {
                renderCartItems();
                updateCartSummary();
            }
        });
    });
}

function updateCartSummary() {
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (!subtotalEl) return;
    
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.09;
    const total = subtotal + tax;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// Promo code functionality
const applyPromo = document.getElementById('applyPromo');
if (applyPromo) {
    applyPromo.addEventListener('click', function() {
        const promoInput = document.getElementById('promoInput');
        const code = promoInput.value.toUpperCase().trim();
        const discountRow = document.getElementById('discountRow');
        const discountCode = document.getElementById('discountCode');
        const discountEl = document.getElementById('discount');
        const totalEl = document.getElementById('total');
        
        if (code === 'SAVE10') {
            const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
            const discount = subtotal * 0.10;
            const tax = subtotal * 0.09;
            const total = subtotal + tax - discount;
            
            discountRow.style.display = 'flex';
            discountCode.textContent = code;
            discountEl.textContent = `-$${discount.toFixed(2)}`;
            totalEl.textContent = `$${total.toFixed(2)}`;
            
            showNotification('Promo code applied! 10% discount');
            promoInput.value = '';
        } else if (code === 'GAME20') {
            const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
            const discount = subtotal * 0.20;
            const tax = subtotal * 0.09;
            const total = subtotal + tax - discount;
            
            discountRow.style.display = 'flex';
            discountCode.textContent = code;
            discountEl.textContent = `-$${discount.toFixed(2)}`;
            totalEl.textContent = `$${total.toFixed(2)}`;
            
            showNotification('Promo code applied! 20% discount');
            promoInput.value = '';
        } else if (code === '') {
            showNotification('Please enter a promo code');
        } else {
            showNotification('Invalid promo code. Try SAVE10 or GAME20');
        }
    });
}

// Checkout button
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            showNotification('Processing your order... 🎮');
            setTimeout(() => {
                alert('Thank you for your order! This is a demo - no actual payment will be processed. In a real store, you would be redirected to a secure payment page.');
            }, 1000);
        } else {
            showNotification('Your cart is empty!');
        }
    });
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#pc' && href !== '#ps' && href !== '#xbox' && href !== '#switch') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Filter functionality
const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        showNotification('Filters applied! Updating results...');
    });
});

// Sort functionality
const sortSelect = document.querySelector('.sort-select');
if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex].text;
        showNotification(`Sorted by: ${selectedOption}`);
    });
}

// Filter reset button
const filterReset = document.querySelector('.filter-reset');
if (filterReset) {
    filterReset.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        showNotification('Filters reset!');
    });
}

// Initialize cart count on page load
updateCartCount();

// Add active class to mobile menu items
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Responsive mobile menu styles
if (window.innerWidth <= 768) {
    const mobileMenuStyle = document.createElement('style');
    mobileMenuStyle.textContent = `
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(10, 14, 39, 0.98);
            padding: 2rem;
            gap: 1rem;
            border-top: 2px solid #00d9ff;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    document.head.appendChild(mobileMenuStyle);
}

// Page load animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('GameHub website loaded successfully! 🎮');
console.log(`Cart contains ${cart.length} items`);
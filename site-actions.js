// site-actions.js - simple click handlers for UI buttons
(function(){
    // Navigate for elements with data-href
    document.querySelectorAll('[data-href]').forEach(el => {
        el.addEventListener('click', (e) => {
            const href = el.getAttribute('data-href');
            if (!href) return;
            // If inside a link - allow default behavior
            window.location.href = href;
        });
        el.style.cursor = 'pointer';
    });

    // Logout action (data-action="logout")
    document.querySelectorAll('[data-action="logout"]').forEach(el => {
        el.addEventListener('click', (e) => {
            // Do client side cleanup if needed
            try { localStorage.removeItem('stylehub_user'); } catch (err) {}
            // Redirect to login page
            const redirect = el.getAttribute('data-href') || 'index.html';
            window.location.href = redirect;
        });
        el.style.cursor = 'pointer';
    });

    // Subscribe action
    document.querySelectorAll('[data-action="subscribe"]').forEach(el => {
        el.addEventListener('click', (e) => {
            const input = document.getElementById('newsletter-email');
            if (!input) {
                alert('Email input not found.');
                return;
            }
            const val = input.value.trim();
            if (!val) {
                alert('Please enter an email address.');
                input.focus();
                return;
            }
            // Basic email check
            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(val)) {
                alert('Please provide a valid email address.');
                input.focus();
                return;
            }

            // For demo — show message and clear input
            alert('Thanks for subscribing with ' + val + '!');
            input.value = '';
        });
        el.style.cursor = 'pointer';
    });

    // Safe guard for buttons inside forms - prevent default if data-href is present
    document.querySelectorAll('form button[data-href]').forEach(b => {
        b.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = b.getAttribute('data-href');
        });
    });

    // Provide quick-view action (data-action="quick-view")
    document.querySelectorAll('[data-action="quick-view"]').forEach(el => {
        el.addEventListener('click', (e) => {
            const href = el.getAttribute('data-href') || 'Products Page.html';
            window.location.href = href;
        });
        el.style.cursor = 'pointer';
    });

    // Add to cart action (data-action="add-to-cart")
    document.querySelectorAll('[data-action="add-to-cart"]').forEach(el => {
        el.addEventListener('click', (e) => {
            const product = el.getAttribute('data-product') || 'Unknown product';
            const price = parseFloat(el.getAttribute('data-price') || '0');
            // Read the cart from localStorage, or start new
            let cart = [];
            try { cart = JSON.parse(localStorage.getItem('stylehub_cart') || '[]'); } catch (err) { cart = []; }
            // If item exists, increment qty, otherwise add new
            const existing = cart.find(c => c.product === product);
            if (existing) {
                existing.qty = (existing.qty || 1) + 1;
            } else {
                cart.push({ product, price, qty: 1, addedAt: new Date().toISOString() });
            }
            localStorage.setItem('stylehub_cart', JSON.stringify(cart));
            alert('Added to cart: ' + product);
        });
        el.style.cursor = 'pointer';
    });

    // Update cart badges
    function refreshCartBadges() {
        let cart = [];
        try { cart = JSON.parse(localStorage.getItem('stylehub_cart') || '[]'); } catch (err) { cart = []; }
        const count = Array.isArray(cart) ? cart.reduce((acc, i) => acc + (i.qty || 1), 0) : 0;
        document.querySelectorAll('[data-cart-badge]').forEach(b => {
            b.innerText = count;
            if (count === 0) b.style.display = 'none';
            else b.style.display = 'flex';
        });
    }

    // Run refresh on load
    refreshCartBadges();

    // Also run refresh after adding to cart
    const originalAddHandlers = document.querySelectorAll('[data-action="add-to-cart"]');
    originalAddHandlers.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(refreshCartBadges, 10);
        });
    });

    // Cart page rendering and interactions
    function getCart() {
        try { return JSON.parse(localStorage.getItem('stylehub_cart') || '[]'); }
        catch (err) { return []; }
    }
    function saveCart(cart) { localStorage.setItem('stylehub_cart', JSON.stringify(cart)); }

    function renderCartPage() {
        const itemsEl = document.getElementById('cart-items');
        const countEl = document.getElementById('cart-count');
        const subtotalEl = document.getElementById('cart-subtotal');
        const shippingEl = document.getElementById('cart-shipping');
        const taxesEl = document.getElementById('cart-taxes');
        const totalEl = document.getElementById('cart-total');
        if (!itemsEl) return; // not on cart page

        const cart = getCart();
        itemsEl.innerHTML = '';
        if (!cart || cart.length === 0) {
            itemsEl.innerHTML = `<div class="py-12 text-center text-gray-500 dark:text-gray-400">Your bag is empty. <a href=\"new_arrivals.html\" class=\"text-primary hover:underline\">Start shopping</a>.</div>`;
            if (countEl) countEl.innerText = '0';
            if (subtotalEl) subtotalEl.innerText = '$0.00';
            if (shippingEl) shippingEl.innerText = '$0.00';
            if (taxesEl) taxesEl.innerText = '$0.00';
            if (totalEl) totalEl.innerText = '$0.00';
            refreshCartBadges();
            return;
        }

        let subtotal = 0;
        cart.forEach((item, idx) => {
            const price = parseFloat(item.price || 0);
            const qty = parseInt(item.qty || 1);
            subtotal += price * qty;
            const itemRow = document.createElement('div');
            itemRow.className = 'flex gap-4 py-6 justify-between items-center';
            itemRow.innerHTML = `
                <div class="flex items-start gap-4">
                    <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-24 w-24 shrink-0" style="background-color: #f1f5f9; display:flex;align-items:center;justify-content:center;"> <span class=\"text-sm\">🛍️</span></div>
                    <div class="flex flex-1 flex-col justify-center gap-1">
                        <p class="text-gray-900 dark:text-white text-base font-semibold leading-normal">${escapeHtml(item.product)}</p>
                        <p class="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Quantity: <span class=\"font-medium\">${qty}</span></p>
                        <p class="text-gray-900 dark:text-white text-base font-medium leading-normal mt-1">$${price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-4 shrink-0">
                    <div class="flex items-center gap-2 text-gray-900 dark:text-white">
                        <button data-action=\"decrease\" data-index=\"${idx}\" class="qty-minus text-base font-medium h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">-</button>
                        <input data-idx=\"${idx}\" class="qty-input text-base font-medium w-8 p-0 text-center bg-transparent" type="number" value="${qty}" min="1" />
                        <button data-action=\"increase\" data-index=\"${idx}\" class="qty-plus text-base font-medium h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">+</button>
                    </div>
                    <button data-action="remove" data-index="${idx}" class="remove-item text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 text-sm flex items-center gap-1"><span class="material-symbols-outlined text-base">delete</span> Remove</button>
                </div>
            `;
            itemsEl.appendChild(itemRow);
        });

        // Shipping flat rate if subtotal > 0
        const shipping = subtotal > 0 ? 8.00 : 0.00;
        const taxes = subtotal * 0.08; // 8% taxes
        const total = subtotal + shipping + taxes;
        if (countEl) countEl.innerText = String(cart.reduce((acc, i) => acc + (i.qty || 1), 0));
        if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.innerText = `$${shipping.toFixed(2)}`;
        if (taxesEl) taxesEl.innerText = `$${taxes.toFixed(2)}`;
        if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
        refreshCartBadges();

        // Hook up qty controls and remove buttons
        itemsEl.querySelectorAll('.qty-minus').forEach(b => b.addEventListener('click', (e) => {
            const idx = parseInt(b.getAttribute('data-index'));
            const cart = getCart();
            if (!cart[idx]) return;
            cart[idx].qty = Math.max(1, (cart[idx].qty || 1) - 1);
            saveCart(cart);
            renderCartPage();
        }));
        itemsEl.querySelectorAll('.qty-plus').forEach(b => b.addEventListener('click', (e) => {
            const idx = parseInt(b.getAttribute('data-index'));
            const cart = getCart();
            if (!cart[idx]) return;
            cart[idx].qty = (cart[idx].qty || 1) + 1;
            saveCart(cart);
            renderCartPage();
        }));
        itemsEl.querySelectorAll('.qty-input').forEach(input => input.addEventListener('change', (e) => {
            const idx = parseInt(input.getAttribute('data-idx'));
            const cart = getCart();
            let val = parseInt(input.value) || 1;
            val = Math.max(1, val);
            cart[idx].qty = val;
            saveCart(cart);
            renderCartPage();
        }));
        itemsEl.querySelectorAll('.remove-item').forEach(b => b.addEventListener('click', (e) => {
            const idx = parseInt(b.getAttribute('data-index'));
            const cart = getCart();
            if (!cart[idx]) return;
            cart.splice(idx, 1);
            saveCart(cart);
            renderCartPage();
        }));
    }

    function escapeHtml(unsafe) {
        return (''+unsafe).replace(/[&<>"'`]/g, function (m) {
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;","`":"&#x60;"}[m];
        });
    }

    // Initial render if on cart page
    if (document.getElementById('cart-items')) {
        renderCartPage();
    }

    // Accessibility: enable Enter key for clickable non-button elements with data-href
    document.querySelectorAll('[data-href]').forEach(el => {
        el.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
        if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '0');
    });
})();

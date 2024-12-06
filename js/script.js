// Deklarasikan variabel global
let currentProduct = null;
let cart = [];

// Tambahkan event listener untuk tombol checkout
document.querySelector('.checkout-btn').addEventListener('click', showAddressModal);

// Fungsi-fungsi yang perlu diakses secara global
window.increaseQty = function() {
    const qtyInput = document.getElementById('quantity');
    qtyInput.value = parseInt(qtyInput.value) + 1;
    updateModalTotal();
};

window.decreaseQty = function() {
    const qtyInput = document.getElementById('quantity');
    if (parseInt(qtyInput.value) > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
        updateModalTotal();
    }
};

window.addToCart = function() {
    const qty = parseInt(document.getElementById('quantity').value);
    const item = {
        ...currentProduct,
        quantity: qty,
        total: currentProduct.price * qty
    };
    
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += qty;
        cart[existingItemIndex].total = cart[existingItemIndex].quantity * cart[existingItemIndex].price;
    } else {
        cart.push(item);
    }
    
    updateCartDisplay();
    closeModal();
    showNotification('Produk ditambahkan ke keranjang');
};

window.removeFromCart = function(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
};

// Fungsi untuk format currency
function formatCurrency(number) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// Fungsi untuk menampilkan modal alamat
function showAddressModal() {
    if (cart.length === 0) {
        alert('Keranjang belanja masih kosong!');
        return;
    }

    const addressModal = document.createElement('div');
    addressModal.className = 'address-modal';
    addressModal.innerHTML = `
        <div class="address-modal-content">
            <h3>Masukkan Alamat Pengiriman</h3>
            <form id="addressForm">
                <div class="form-group">
                    <label>Nama Penerima:</label>
                    <input type="text" id="receiverName" required>
                </div>
                <div class="form-group">
                    <label>Nomor HP:</label>
                    <input type="tel" id="receiverPhone" required>
                </div>
                <div class="form-group">
                    <label>Alamat Lengkap:</label>
                    <textarea id="fullAddress" required></textarea>
                </div>
                <div class="modal-buttons">
                    <button type="button" id="btnBatal" class="btn-cancel">BATALKAN</button>
                    <button type="button" id="btnCheckoutWA" class="btn-submit">CHECKOUT VIA WHATSAPP</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(addressModal);

    // Event untuk tombol batalkan
    document.getElementById('btnBatal').onclick = function() { 
        console.log('Tombol BATALKAN ditekan'); // Tambahkan ini
        addressModal.remove(); 
    };

    // Event untuk tombol checkout WhatsApp
    document.getElementById('btnCheckoutWA').onclick = function() { 
        const name = document.getElementById('receiverName').value; 
        const phone = document.getElementById('receiverPhone').value; 
        const address = document.getElementById('fullAddress').value; 

        console.log('Tombol CHECKOUT VIA WHATSAPP ditekan'); // Tambahkan ini
        console.log('Nama:', name, 'No. HP:', phone, 'Alamat:', address); // Tambahkan ini
    
    
        if (!name || !phone || !address) { 
            alert('Mohon lengkapi semua data'); 
            return; 
        } 
    
        // Generate nomor invoice 
        const date = new Date(); 
        const invoiceNumber = `INV/${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}/${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`; 
    
        // Format pesan WhatsApp dengan invoice 
        let message = `*INVOICE: ${invoiceNumber}*\n`; 
        message += `================================\n`; 
        message += `*WARUNG NASI PADANG DIKA MINANG*\n`; 
        message += `================================\n\n`; 
        message += `Tanggal: ${date.toLocaleDateString('id-ID')}\n`; 
        message += `Waktu: ${date.toLocaleTimeString('id-ID')}\n\n`; 
        message += `*DETAIL PESANAN:*\n`; 
        message += `--------------------------------\n`; 
    
        let totalAmount = 0; 
        cart.forEach((item, index) => { 
            const itemTotal = item.price * item.quantity; 
            totalAmount += itemTotal; 
            message += `${index + 1}. ${item.name}\n`; 
            message += `   ${item.quantity} x ${formatCurrency(item.price)}\n`; 
            message += `   Subtotal: ${formatCurrency(itemTotal)}\n`; 
            message += `--------------------------------\n`; 
        }); 
    
        message += `\n*TOTAL PEMBAYARAN: ${formatCurrency(totalAmount)}*\n`; 
        message += `================================\n\n`; 
        message += `*DETAIL PENGIRIMAN:*\n`; 
        message += `Nama: ${name}\n`; 
        message += `No. HP: ${phone}\n`; 
        message += `Alamat: ${address}\n\n`; 
        message += `================================\n`; 
        message += `Silakan melakukan pembayaran dan\n`; 
        message += `kirim bukti transfer ke nomor ini.\n\n`; 
        message += `*Terima kasih telah memesan di\n`; 
        message += `Warung Nasi Padang Dika Minang! *`; 
    
        // Kirim ke WhatsApp 
        const waNumber = "628882025165"; // Ganti dengan nomor WhatsApp 
        const waURL = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`; 
    
        // Buka WhatsApp di tab baru 
        window.open(waURL, '_blank'); 
    
        // Bersihkan keranjang dan tutup modal 
       cart = []; 
updateCartDisplay(); 
console.log('Keranjang telah dibersihkan'); // Tambahkan ini
addressModal.remove(); 
    };
}

// Fungsi format currency
function formatCurrency(number) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// Event listener untuk tombol checkout
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showAddressModal);
    }
});

// Fungsi untuk generate invoice
function generateInvoice(deliveryDetails) {
    const date = new Date();
    const invoiceNumber = 'INV/' + date.getFullYear() + '/' + 
        String(date.getMonth() + 1).padStart(2, '0') + '/' +
        String(date.getDate()).padStart(2, '0') + '/' +
        Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    let message = `*INVOICE ${invoiceNumber}*\n`;
    message += `*WARUNG NASI PADANG DIKA MINANG*\n\n`;
    message += `Tanggal: ${date.toLocaleDateString('id-ID')}\n`;
    message += `Waktu: ${date.toLocaleTimeString('id-ID')}\n\n`;
    message += `Detail Pesanan:\n`;
    message += `${'-'.repeat(30)}\n`;

    let totalAmount = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        message += `${index + 1}. ${item.name}\n`;
        message += `   ${item.quantity}x ${formatCurrency(item.price)} = ${formatCurrency(itemTotal)}\n`;
    });

    message += `${'-'.repeat(30)}\n`;
    message += `Total: ${formatCurrency(totalAmount)}\n\n`;
    message += `Detail Pengiriman:\n`;
    message += `Nama: ${deliveryDetails.name}\n`;
    message += `No. HP: ${deliveryDetails.phone}\n`;
    message += `Alamat: ${deliveryDetails.address}\n\n`;
    message += `Untuk konfirmasi pesanan, silakan kirim bukti transfer ke nomor ini.\n\n`;
    message += `Terima kasih telah memesan di Warung Nasi Padang Dika Minang!`;

    return message;
}

// Fungsi untuk melanjutkan ke WhatsApp
function proceedToWhatsApp(deliveryDetails) {
    const invoice = generateInvoice(deliveryDetails);
    const encodedMessage = encodeURIComponent(invoice);
    const phoneNumber = '628882025165';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    // Reset keranjang setelah checkout
    cart = [];
    updateCartDisplay();
    const cartPanel = document.querySelector('.cart-panel');
    cartPanel.classList.remove('active');
}

// Update fungsi checkout
function checkout() {
    // Nomor WhatsApp tujuan
    const phoneNumber = "628882025165"; // Ganti dengan nomor WhatsApp warung
    
    // Membuat pesan untuk WhatsApp
    let message = "Halo, saya ingin memesan:%0A%0A";
    
    // Menambahkan setiap item dari keranjang ke pesan
    cart.forEach(item => {
        message += `${item.name} x${item.quantity} = Rp ${item.total.toLocaleString()}%0A`;
    });
    
    // Menambahkan total pesanan
    const totalOrder = cart.reduce((total, item) => total + item.total, 0);
    message += `%0ATotal Pesanan: Rp ${totalOrder.toLocaleString()}`;
    
    // Membuka WhatsApp dengan pesan
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

window.closeCart = function() {
    document.getElementById('cartPanel').classList.remove('active');
};

document.addEventListener('DOMContentLoaded', function() {
    // Toggle untuk hamburger menu
    const hamburger = document.querySelector('#hamburger-menu');
    const navbarNav = document.querySelector('.navbar-nav');
    const modal = document.getElementById('cartModal');
    const cartPanel = document.getElementById('cartPanel');
    const closeCartBtn = document.querySelector('.close-cart');
    const shoppingCartBtn = document.querySelector('.shopping-cart');

    // Event listener untuk hamburger menu
    hamburger.addEventListener('click', () => {
        navbarNav.classList.toggle('active');
    });

    // Event listener untuk tombol keranjang
    shoppingCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartPanel.classList.contains('active')) {
            cartPanel.classList.remove('active');
        } else {
            cartPanel.classList.add('active');
        }
    });

    // Event listener untuk tombol tutup keranjang
    closeCartBtn.addEventListener('click', () => {
        cartPanel.classList.remove('active');
    });

    // Event listener untuk tombol pesan
    document.querySelectorAll('.btn-pesan').forEach(button => {
        button.addEventListener('click', function() {
            currentProduct = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseInt(this.dataset.price),
                image: this.dataset.image
            };
            
            // Update modal content
            document.getElementById('modalProductImage').src = currentProduct.image;
            document.getElementById('modalProductName').textContent = currentProduct.name;
            document.getElementById('modalProductPrice').textContent = `IDR ${currentProduct.price.toLocaleString()}`;
            document.getElementById('quantity').value = 1;
            updateModalTotal();
            
            modal.style.display = "block";
        });
    });

    // Close modal when clicking X
    document.querySelector('.modal .close').onclick = function() {
        modal.style.display = "none";
    };

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Klik di luar area untuk menutup hamburger menu
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
            navbarNav.classList.remove('active');
        }
    });

    // Mencegah keranjang tertutup saat mengklik di dalam keranjang
    cartPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Menutup keranjang saat mengklik di luar keranjang
    document.addEventListener('click', (e) => {
        if (!cartPanel.contains(e.target) && !shoppingCartBtn.contains(e.target)) {
            cartPanel.classList.remove('active');
        }
    });

    // Tambahkan event listener untuk form
    document.querySelector('.contact form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(this);
            await fetch('https://formsubmit.co/dikaminang51@gmail.com', {
                method: 'POST',
                body: formData
            });
            
            // Tampilkan pesan sukses
            alert('Terima kasih! Pesan Anda telah terkirim.');
            this.reset(); // Reset form
        } catch (error) {
            alert('Maaf, terjadi kesalahan. Silakan coba lagi.');
        }
    });

    // Tambahkan fungsi search
    
    const searchForm = document.querySelector('.search-form');
    const searchBox = document.querySelector('#search-box');
    const searchButton = document.querySelector('#search-button');
    const menuItems = document.querySelectorAll('menu-card-title');

    // Toggle search form
    document.querySelector('#search').onclick = (e) => {
        e.preventDefault();
        searchForm.classList.toggle('active');
        searchBox.focus();
    };

    // Search functionality
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        menuItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            
            if (title.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // Reset tampilan jika search box kosong
        if (searchTerm === '') {
            menuItems.forEach(item => {
                item.style.display = 'block';
            });
        }
    });

    // Close search form when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchForm.contains(e.target) && !searchButton.contains(e.target)) {
            searchForm.classList.remove('active');
        }
    });

    // Tambahkan event listener untuk mobile
    document.addEventListener('DOMContentLoaded', function() {
        // Hamburger menu
        const hamburger = document.querySelector('#hamburger-menu');
        const navbarNav = document.querySelector('.navbar-nav');
        
        hamburger.onclick = (e) => {
            e.preventDefault();
            navbarNav.classList.toggle('active');
        };

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
                navbarNav.classList.remove('active');
            }
        });

        // Prevent scroll when modal is open
        function toggleScroll(disable) {
            document.body.style.overflow = disable ? 'hidden' : 'auto';
        }

        // Handle modal open/close
        function handleModal(modalElement, isOpen) {
            modalElement.style.display = isOpen ? 'block' : 'none';
            toggleScroll(isOpen);
        }

        // Update cart display for mobile
        function updateCartDisplay() {
            // ... kode yang sudah ada ...
            
            // Tambahan untuk mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = cart.length > 0 ? 'hidden' : 'auto';
            }
        }

        // Handle touch events for mobile
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', e => {
            touchStartY = e.changedTouches[0].screenY;
        }, false);

        document.addEventListener('touchend', e => {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeDistance = touchEndY - touchStartY;
            const cartPanel = document.querySelector('.cart-panel');
            
            if (Math.abs(swipeDistance) > 50) { // Minimal swipe distance
                if (swipeDistance > 0 && cartPanel.classList.contains('active')) {
                    cartPanel.classList.remove('active');
                }
            }
        }
    });
});
// Fungsi helper
function updateModalTotal() {
    const qty = parseInt(document.getElementById('quantity').value);
    const total = currentProduct.price * qty;
    document.getElementById('modalTotal').textContent = `IDR ${total.toLocaleString()}`;
}

// Update fungsi updateCartDisplay untuk menambahkan total
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    let grandTotal = 0;
    
    cart.forEach(item => {
        grandTotal += item.total;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="quantity-controls">
                        <button onclick="updateCartItemQuantity('${item.id}', -1)" class="qty-btn">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartItemQuantity('${item.id}', 1)" class="qty-btn">+</button>
                    </div>
                    <p class="item-total">${formatCurrency(item.total)}</p>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="remove-item">&times;</button>
            </div>
        `;
    });
    
    document.getElementById('cartTotal').textContent = formatCurrency(grandTotal);
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

window.updateCartItemQuantity = function(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        const newQuantity = cart[itemIndex].quantity + change;
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
            cart[itemIndex].total = cart[itemIndex].price * newQuantity;
            updateCartDisplay();
        } else if (newQuantity === 0) {
            removeFromCart(itemId);
        }
    }
};

// Fungsi untuk menambahkan item ke keranjang
function addToCart(menuItem) {
    // Menambahkan item ke keranjang
    const existingItem = cart.find(item => item.id === menuItem.id);
    if (existingItem) {
        existingItem.quantity += menuItem.quantity;
        existingItem.total = existingItem.quantity * existingItem.price;
    } else {
        cart.push({
            ...menuItem,
            total: menuItem.quantity * menuItem.price
        });
    }

    // Update tampilan keranjang
    updateCartDisplay();
    updateCartCount();

    // Menutup modal dengan mencari dan menghapus semua modal yang ada
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.remove();
    });

    // Hapus overlay jika ada
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
        overlay.remove();
    });

    // Reset scroll
    document.body.style.overflow = 'auto';
}

// Fungsi untuk menampilkan modal pilih jumlah
function showModal(menuId) {
    const menu = menus.find(item => item.id === menuId);
    if (!menu) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>Pilih Jumlah Pesanan</h3>
            <div class="modal-body">
                <img src="${menu.image}" alt="${menu.name}">
                <h4>${menu.name}</h4>
                <p>IDR ${menu.price.toLocaleString()}</p>
                <div class="quantity-controls">
                    <button class="qty-btn minus">-</button>
                    <input type="number" value="1" min="1" class="qty-input">
                    <button class="qty-btn plus">+</button>
                </div>
                <p class="total">Total: IDR ${menu.price.toLocaleString()}</p>
                <button class="add-to-cart-btn">Tambah ke Keranjang</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const closeBtn = modal.querySelector('.close');
    const minusBtn = modal.querySelector('.minus');
    const plusBtn = modal.querySelector('.plus');
    const qtyInput = modal.querySelector('.qty-input');
    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    const totalText = modal.querySelector('.total');

    closeBtn.onclick = () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    };

    minusBtn.onclick = () => {
        if (qtyInput.value > 1) {
            qtyInput.value--;
            updateTotal();
        }
    };

    plusBtn.onclick = () => {
        qtyInput.value++;
        updateTotal();
    };

    qtyInput.onchange = () => {
        if (qtyInput.value < 1) qtyInput.value = 1;
        updateTotal();
    };

    function updateTotal() {
        const total = menu.price * qtyInput.value;
        totalText.textContent = `Total: IDR ${total.toLocaleString()}`;
    }

    // Event listener untuk tombol tambah ke keranjang
    addToCartBtn.onclick = () => {
        const quantity = parseInt(qtyInput.value);
        addToCart({
            id: menu.id,
            name: menu.name,
            price: menu.price,
            quantity: quantity,
            image: menu.image
        });
        return false; // Mencegah event bubbling
    };

    // Menutup modal ketika klik di luar modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

// Fungsi notifikasi (opsional)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Hilangkan notifikasi setelah beberapa detik
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// CSS untuk notifikasi (opsional)
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 9999;
        animation: fadeInOut 2s ease-in-out;
    }

    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, 20px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        85% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;

document.head.appendChild(style);


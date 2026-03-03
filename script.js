const firebaseConfig = {
    apiKey: "AIzaSyAY3G265zTP5Qpf9EoGlGy2sSrVYGI4LGk",
    authDomain: "zyracollective.shop",
    projectId: "genzfood2-96e43",
    storageBucket: "genzfood2-96e43.firebasestorage.app",
    messagingSenderId: "410241064931",
    appId: "1:410241064931:web:a9dcb7f9401d22b2a30ad6"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 1. Data Generation (42 Products)
const categories = ["Burkha", "Abaya", "Hijab", "Kurta", "Prayer Mat", "Attar"];
const products = [];
categories.forEach((cat, cIdx) => {
    for (let i = 1; i <= 7; i++) {
        products.push({
            id: `${cat.slice(0,2).toUpperCase()}${i}`,
            name: `Elite ${cat} ${i}`,
            price: 1500 + (i * 300),
            category: cat,
            img: `images/cat${cIdx+1}.png`,
            rating: 4.9
        });
    }
});

// 2. UI Rendering
function initStore() {
    const mainView = document.getElementById('main-view');
    categories.forEach(cat => {
        const section = document.createElement('section');
        section.className = "mb-16";
        section.innerHTML = `
            <h2 class="text-3xl font-serif text-gold mb-8 tracking-widest border-b border-gold/20 pb-2">${cat}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${products.filter(p => p.category === cat).map(p => `
                    <div class="product-card rounded-2xl p-4 group">
                        <div class="relative overflow-hidden rounded-xl h-80">
                            <img src="${p.img}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                        </div>
                        <div class="mt-4 flex justify-between">
                            <div>
                                <h3 class="text-lg font-bold">${p.name}</h3>
                                <p class="text-gold tracking-widest">₹${p.price}</p>
                            </div>
                            <div class="text-gold text-sm"><i class="fas fa-star"></i> 4.9</div>
                        </div>
                        <button onclick="handlePurchase('${p.id}', '${p.name}', ${p.price})" class="w-full mt-4 py-3 bg-gold text-black font-bold rounded-lg uppercase text-xs tracking-tighter">Buy Now</button>
                    </div>
                `).join('')}
            </div>
        `;
        mainView.appendChild(section);
    });
}

// 3. Purchase & Payment Logic
function handlePurchase(id, name, price) {
    const user = auth.currentUser;
    if(!user) {
        alert("Please login to place an order.");
        return;
    }
    
    // Show Prompt for Payment Method
    const method = confirm("Select Payment: OK for Prepaid (UPI), Cancel for COD (+₹99)") ? 'UPI' : 'COD';
    const finalPrice = method === 'COD' ? price + 99 : price;

    if(method === 'UPI') {
        const upiUrl = `upi://pay?pa=7385009275@ptsbi&pn=Zyra%20Collective&am=${finalPrice}&cu=INR`;
        const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
        
        // Custom Overlay for QR
        const overlay = document.createElement('div');
        overlay.className = "fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6";
        overlay.innerHTML = `
            <div class="bg-white/5 p-8 border border-gold rounded-2xl text-center glass-effect">
                <h3 class="text-gold text-xl mb-4 font-serif">Scan to Pay ₹${finalPrice}</h3>
                <img src="${qrImg}" class="mx-auto border-4 border-white rounded-lg mb-4">
                <input type="text" id="txId" placeholder="Enter Transaction ID" class="w-full bg-black border border-gold/40 p-2 mb-4 text-center">
                <button onclick="confirmOrder('${name}', ${finalPrice}, 'UPI')" class="bg-gold text-black px-8 py-2 font-bold rounded">Confirm Order</button>
            </div>
        `;
        document.body.appendChild(overlay);
    } else {
        confirmOrder(name, finalPrice, 'COD');
    }
}

async function confirmOrder(name, price, method) {
    const user = auth.currentUser;
    const orderObj = {
        userId: user.uid,
        userName: user.displayName || "Customer",
        product: name,
        amount: price,
        method: method,
        status: "Processing",
        date: new Date().toLocaleDateString()
    };

    // Save to Firestore
    await db.collection("orders").add(orderObj);

    // Formspree Automation (Silent Submit)
    const formData = new FormData();
    Object.keys(orderObj).forEach(key => formData.append(key, orderObj[key]));
    fetch("https://formspree.io/f/xvgzlowq", { method: 'POST', body: formData, headers: {'Accept': 'application/json'}});

    // WhatsApp Redirect
    const msg = `*Order Placed!*%0AProduct: ${name}%0APrice: ₹${price}%0AMethod: ${method}`;
    window.location.href = `https://wa.me/917385009275?text=${msg}`;
}

// 4. Order History Fetching
async function showOrders() {
    const user = auth.currentUser;
    if(!user) return alert("Login to see orders");
    
    document.getElementById('order-modal').classList.remove('hidden');
    const container = document.getElementById('orders-container');
    container.innerHTML = `<p class="text-gold animate-pulse">Fetching your luxury vault...</p>`;

    const snapshot = await db.collection("orders").where("userId", "==", user.uid).get();
    
    if(snapshot.empty) {
        container.innerHTML = `<div class="text-center py-10"><p class="mb-4 text-gray-400">Your journey hasn't started yet.</p><button onclick="closeModal('order-modal')" class="bg-gold text-black px-6 py-2 rounded font-bold">Start Shopping</button></div>`;
        return;
    }

    container.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        const card = document.createElement('div');
        card.className = "glass-effect border border-gold/10 p-5 rounded-xl flex justify-between items-center slide-up";
        card.innerHTML = `
            <div>
                <p class="text-xs text-gray-500">${data.date} • ID: ${doc.id.slice(0,5)}</p>
                <h4 class="font-bold text-lg">${data.product}</h4>
                <p class="text-gold">₹${data.amount}</p>
            </div>
            <span class="status-badge">${data.status}</span>
        `;
        container.appendChild(card);
    });
}

// Sidebar & Modals Controls
const sidebar = document.getElementById('sidebar');
document.getElementById('menu-open').onclick = () => sidebar.classList.remove('-translate-x-full');
document.getElementById('menu-close').onclick = () => sidebar.classList.add('-translate-x-full');

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function toggleFaq(btn) { btn.nextElementSibling.classList.toggle('hidden'); }

// Init Store
window.onload = initStore;

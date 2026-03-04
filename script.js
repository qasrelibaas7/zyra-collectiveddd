const firebaseConfig = {
    apiKey: "AIzaSyAY3G265zTP5Qpf9EoGlGy2sSrVYGI4LGk",
    authDomain: "genzfood2-96e43.firebaseapp.com",
    databaseURL: "https://genzfood2-96e43-default-rtdb.firebaseio.com",
    projectId: "genzfood2-96e43",
    storageBucket: "genzfood2-96e43.firebasestorage.app",
    messagingSenderId: "410241064931",
    appId: "1:410241064931:web:a9dcb7f9401d22b2a30ad6"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 42 Products Structure (6 Categories x 7 Products)
const categories = ["Burkha", "Hijab", "Abaya", "Kurta", "Attar", "Prayermat"];
const inventory = {};

categories.forEach((cat, idx) => {
    inventory[cat] = Array.from({length: 7}, (_, i) => ({
        id: `${cat.toLowerCase()}${i+1}`,
        name: `Luxury ${cat} - Edition ${i+1}`,
        price: 2499 + (i * 150),
        desc: "Handcrafted with premium fabrics and gold-thread embroidery for a regal finish.",
        img: `images/${cat.toLowerCase()}${i+1}.png`
    }));
});

// Auto Slider (3s Interval)
let slideIdx = 0;
function startHero() {
    const track = document.getElementById('slider-track');
    const vid = document.getElementById('hero-vid');
    setInterval(() => {
        slideIdx = (slideIdx + 1) % 4;
        track.style.transform = `translateX(-${slideIdx * 25}%)`;
        if(slideIdx === 1) vid.play(); else vid.pause();
    }, 3000);
}

// Render Categories
function initHome() {
    const list = document.getElementById('category-list');
    list.innerHTML = '';
    categories.forEach((cat, i) => {
        list.innerHTML += `
            <div onclick="openCategory('${cat}')" class="cat-card h-52 relative rounded-[45px] overflow-hidden group shadow-lg animate-slide">
                <img src="images/category${i+1}.png" class="w-full h-full object-cover transition duration-1000 group-hover:scale-110">
                <div class="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                    <h4 class="hero-title text-white text-3xl italic tracking-tighter">${cat}</h4>
                </div>
            </div>`;
    });
}

function openCategory(cat) {
    showSection('list-page');
    document.getElementById('current-cat-name').innerText = cat;
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    inventory[cat].forEach(p => {
        grid.innerHTML += `
            <div class="prod-card bg-white p-6 rounded-[50px] border border-[#D4AF37]/10 shadow-sm animate-slide">
                <img src="${p.img}" class="w-full h-80 object-cover rounded-[40px] mb-6 shadow-md" onerror="this.src='https://via.placeholder.com/400x500?text=${p.name}'">
                <h4 class="font-bold text-[11px] uppercase tracking-tighter">${p.name}</h4>
                <p class="text-[9px] opacity-40 mt-1 mb-6 italic">${p.desc}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-[#D4AF37]">₹${p.price}</span>
                    <button onclick="triggerCheckout('${p.name}')" class="bg-black text-white px-10 py-4 rounded-[30px] text-[10px] font-bold uppercase tracking-[3px]">Order</button>
                </div>
            </div>`;
    });
}

// Policies & FAQs
const data = {
    "Privacy": "Zyra Collective protects your data. We use encryption for all luxury transactions and never share your details.",
    "Return": "Exchanges available within 14 days for unworn items with original tags. Hygiene products like Attar are non-returnable.",
    "FAQ": "1. Shipping? 3-7 days PAN India. <br>2. Fabric? Premium Korean Nida & Egyptian Cotton. <br>3. Tracking? Sent via WhatsApp after dispatch. <br>4. Customization? Available on specific Abayas. <br>5. Payment? Secure UPI and COD accepted."
};

function showPolicy(type) {
    alert(`${type} Policy:\n\n${data[type].replace('<br>', '\n')}`);
}

function triggerCheckout(name) {
    document.getElementById('checkout-prod-name').value = name;
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function toggleQR(show) {
    document.getElementById('upi-qr').classList.toggle('hidden', !show);
}

function showSection(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    toggleSidebar(false);
    window.scrollTo(0,0);
}

function toggleSidebar(open) {
    document.getElementById('sidebar').style.transform = open ? 'translateX(0)' : 'translateX(-100%)';
    document.getElementById('overlay').classList.toggle('hidden', !open);
}

// Authentication Logic
async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider).catch(e => alert("Login Error: " + e.message));
}

auth.onAuthStateChanged(user => {
    if(user) {
        document.getElementById('auth-ui').classList.add('hidden');
        document.getElementById('user-ui').classList.remove('hidden');
        document.getElementById('user-img').src = user.photoURL;
        document.getElementById('user-name').innerText = user.displayName;
        document.getElementById('user-email').innerText = user.email;
    } else {
        document.getElementById('auth-ui').classList.remove('hidden');
        document.getElementById('user-ui').classList.add('hidden');
    }
});

window.onload = () => { initHome(); startHero(); };

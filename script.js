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

const categories = ["Burkha", "Hijab", "Abaya", "Kurta", "Attar", "Prayer Mat"];
const stock = {};

// Generating 42 Products Logic
categories.forEach(cat => {
    stock[cat] = Array.from({length: 7}, (_, i) => ({
        name: `Premium ${cat} Series ${i+1}`,
        price: 1999 + (i * 100),
        desc: "Exclusive artisan-crafted luxury wear, specifically designed for Zyra Collective.",
        img: `images/${cat.toLowerCase().replace(' ', '')}${i+1}.png`
    }));
});

// Slider Controller
let currentSlide = 0;
function initSlider() {
    const track = document.getElementById('slider-track');
    const vid = document.getElementById('hero-vid');
    setInterval(() => {
        currentSlide = (currentSlide + 1) % 4;
        track.style.transform = `translateX(-${currentSlide * 25}%)`;
        if(currentSlide === 1) vid.play(); else vid.pause();
    }, 3000);
}

// UI Rendering
function loadHome() {
    const grid = document.getElementById('cat-grid');
    grid.innerHTML = '';
    categories.forEach((cat, i) => {
        grid.innerHTML += `
            <div onclick="openCategory('${cat}')" class="cat-card h-52 relative rounded-[40px] overflow-hidden group shadow-lg animate-slide">
                <img src="images/category${i+1}.png" class="w-full h-full object-cover transition duration-1000 group-hover:scale-110">
                <div class="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                    <h4 class="hero-title text-white text-3xl italic tracking-tighter">${cat}</h4>
                </div>
            </div>`;
    });
}

function openCategory(cat) {
    showSection('list-page');
    document.getElementById('cat-title').innerText = cat;
    const grid = document.getElementById('prod-grid');
    grid.innerHTML = '';
    stock[cat].forEach(p => {
        grid.innerHTML += `
            <div class="prod-card bg-white p-6 rounded-[50px] border border-gold/5 shadow-sm animate-slide">
                <img src="${p.img}" class="w-full h-80 object-cover rounded-[40px] mb-6 shadow-md" onerror="this.src='https://via.placeholder.com/400x500?text=${p.name}'">
                <h4 class="font-bold text-[11px] uppercase tracking-tight">${p.name}</h4>
                <p class="text-[9px] opacity-40 mt-1 mb-6">${p.desc}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-gold">₹${p.price}</span>
                    <button onclick="openCheckout('${p.name}')" class="bg-black text-white px-8 py-4 rounded-[25px] text-[10px] font-bold uppercase tracking-[3px]">Order</button>
                </div>
            </div>`;
    });
}

// Policy & FAQ Content
const policies = {
    "Privacy": "Zyra Collective respects your privacy. We collect data solely to enhance your luxury shopping experience.",
    "Return": "Luxury items can be exchanged within 7 days. Returns must be in original condition with tags intact.",
    "FAQ": "1. Delivery time? 3-5 days. <br>2. Genuine materials? Yes, premium fabrics only. <br>3. Shipping charges? Free across India.<br>4. International shipping? Coming soon.<br>5. Authenticity? Guaranteed original Zyra designs."
};

function showPolicy(type) {
    alert(`${type} Policy: \n\n ${policies[type]}`);
}

function openCheckout(name) {
    document.getElementById('form-prod-name').value = name;
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function toggleQR(show) {
    document.getElementById('qr-display').classList.toggle('hidden', !show);
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

// Firebase Auth Login
async function login(type) {
    if(type === 'google') {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider).catch(e => alert(e.message));
    }
}

auth.onAuthStateChanged(user => {
    if(user) {
        document.getElementById('auth-ui').classList.add('hidden');
        document.getElementById('user-ui').classList.remove('hidden');
        document.getElementById('u-img').src = user.photoURL;
        document.getElementById('u-name').innerText = user.displayName;
    }
});

window.onload = () => { loadHome(); initSlider(); };

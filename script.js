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

// 42 Products Array
const categories = ["Burkha", "Abaya", "Hijab", "Kurta", "Prayer Mat", "Attar"];
const productData = {};
categories.forEach(cat => {
    productData[cat] = Array(7).fill(0).map((_, i) => ({
        id: `${cat}-${i}`,
        name: `${cat} Premium Series ${i+1}`,
        price: "1,499",
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        desc: "Exclusive Zyra Collective design with luxury finishing and premium materials."
    }));
});

// Slider Animation
let step = 0;
function runSlider() {
    const track = document.getElementById('slider-track');
    const vid = document.getElementById('h-vid');
    setInterval(() => {
        step = (step + 1) % 4;
        track.style.transform = `translateX(-${step * 25}%)`;
        if(step === 1) vid.play(); else vid.pause();
    }, 5000);
}

// Render Categories
function loadHome() {
    const container = document.getElementById('cat-container');
    container.innerHTML = '';
    categories.forEach((cat, i) => {
        container.innerHTML += `
            <div onclick="openCategory('${cat}')" class="cat-card h-56 relative rounded-[40px] overflow-hidden group shadow-lg">
                <img src="images/cat${i+1}.png" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" onerror="this.src='https://via.placeholder.com/400x200?text=${cat}'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <h3 class="hero-title text-white text-3xl italic">${cat}</h3>
                </div>
            </div>`;
    });
}

function openCategory(cat) {
    showPage('list-page');
    document.getElementById('cat-title-display').innerText = cat;
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    productData[cat].forEach(p => {
        grid.innerHTML += `
            <div class="prod-card bg-white p-5 rounded-[50px] border border-gold/5 shadow-sm relative animate-slide-up">
                <div class="absolute top-8 right-8 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-bold text-gold z-10">★ ${p.rating}</div>
                <img src="images/prod-${p.id}.png" class="w-full h-96 object-cover rounded-[40px] mb-6 shadow-md" onerror="this.src='https://via.placeholder.com/400x500?text=${p.name}'">
                <h4 class="font-bold text-xs uppercase tracking-tight">${p.name}</h4>
                <p class="text-[9px] opacity-40 mt-2 mb-6 leading-relaxed">${p.desc}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-gold">₹${p.price}</span>
                    <button onclick="orderWhatsApp('${p.name}')" class="bg-black text-white px-8 py-4 rounded-3xl text-[9px] font-bold uppercase tracking-[3px] active:scale-90 transition">Buy Now</button>
                </div>
            </div>`;
    });
}

// Firebase Auth Login
async function login(type) {
    const provider = type === 'google' ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.FacebookAuthProvider();
    try {
        await auth.signInWithPopup(provider);
    } catch (err) {
        if(err.code === 'auth/popup-blocked') await auth.signInWithRedirect(provider);
        else alert(err.message);
    }
}

auth.onAuthStateChanged(user => {
    const loginUI = document.getElementById('login-ui');
    const dashUI = document.getElementById('dash-ui');
    if(user) {
        loginUI.classList.add('hidden');
        dashUI.classList.remove('hidden');
        document.getElementById('u-pic').src = user.photoURL;
        document.getElementById('u-name').innerText = user.displayName;
        document.getElementById('u-mail').innerText = user.email;
    } else {
        loginUI.classList.remove('hidden');
        dashUI.classList.add('hidden');
    }
});

function orderWhatsApp(item) {
    const msg = encodeURIComponent(`Hi Zyra Collective, I want to order: ${item}. Please share payment details.`);
    window.open(`https://wa.me/917385009275?text=${msg}`);
}

function showPage(id) {
    document.querySelectorAll('.page-view').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    toggleMenu(false);
    window.scrollTo(0,0);
}

function toggleMenu(open) {
    document.getElementById('sidebar').style.transform = open ? 'translateX(0)' : 'translateX(-100%)';
    document.getElementById('overlay').classList.toggle('hidden', !open);
    setTimeout(() => document.getElementById('overlay').style.opacity = open ? '1' : '0', 10);
}

window.onload = () => { loadHome(); runSlider(); };

// FIREBASE CONFIG (Aapka original config yahan rahega)
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

// 42 PRODUCTS DATA (6 Categories x 7 Products)
const zyraStock = {
    "Burkha": Array(7).fill(0).map((_, i) => ({ id: `B${i}`, name: `Classic Nida ${i+1}`, price: 1499, rating: 4.8, desc: "Premium Korean Nida fabric with elegant draping." })),
    "Abaya": Array(7).fill(0).map((_, i) => ({ id: `A${i}`, name: `Luxury Abaya ${i+1}`, price: 2999, rating: 4.9, desc: "Hand-embroidered designer abaya for special occasions." })),
    "Hijab": Array(7).fill(0).map((_, i) => ({ id: `H${i}`, name: `Chiffon Luxe ${i+1}`, price: 499, rating: 4.7, desc: "Non-slip premium chiffon with soft finish." })),
    "Kurta": Array(7).fill(0).map((_, i) => ({ id: `K${i}`, name: `Designer Kurta ${i+1}`, price: 1899, rating: 4.8, desc: "Pure cotton hand-stitched kurta for men." })),
    "Prayer Mat": Array(7).fill(0).map((_, i) => ({ id: `P${i}`, name: `Turkish Sajadah ${i+1}`, price: 1299, rating: 5.0, desc: "Orthopedic foam padded luxury Turkish mat." })),
    "Attar": Array(7).fill(0).map((_, i) => ({ id: `T${i}`, name: `Oud Royale ${i+1}`, price: 899, rating: 4.9, desc: "Pure alcohol-free concentrated perfume oil." }))
};

// HERO SLIDER LOGIC
let slideIx = 0;
function runHero() {
    const track = document.getElementById('slider-track');
    const vid = document.getElementById('heroVid');
    setInterval(() => {
        slideIx = (slideIx + 1) % 4;
        track.style.transform = `translateX(-${slideIx * 25}%)`;
        if(slideIx === 1) vid.play(); else vid.pause();
    }, 6000);
}

// UI RENDERING
function initHome() {
    const container = document.getElementById('vertical-cats');
    container.innerHTML = '';
    Object.keys(zyraStock).forEach((cat, idx) => {
        container.innerHTML += `
            <div onclick="loadCategory('${cat}')" class="category-card-vertical relative h-48 rounded-[35px] overflow-hidden group shadow-lg">
                <img src="images/cat${idx+1}.png" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                <div class="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[2px]">
                    <h4 class="hero-title text-white text-3xl uppercase tracking-tighter italic">${cat}</h4>
                </div>
            </div>`;
    });
}

function loadCategory(name) {
    showPage('list-page');
    document.getElementById('current-cat-name').innerText = name;
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    zyraStock[name].forEach(p => {
        grid.innerHTML += `
            <div class="product-3d-card bg-white p-4 rounded-[45px] border border-gray-100 shadow-sm relative group">
                <div class="absolute top-6 right-6 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-bold text-gold z-10">★ ${p.rating}</div>
                <img src="images/${name.toLowerCase()}${p.id}.png" class="w-full h-80 object-cover rounded-[35px] mb-6 shadow-inner" onerror="this.src='https://via.placeholder.com/400x500?text=${p.name}'">
                <div class="px-2">
                    <h4 class="font-bold text-[12px] uppercase tracking-tighter">${p.name}</h4>
                    <p class="text-[9px] opacity-40 mt-1 mb-4 leading-tight">${p.desc}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-gold font-bold text-lg">₹${p.price}</span>
                        <button onclick="alert('Added to Cart')" class="bg-black text-white px-8 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest active:scale-90 transition">Buy</button>
                    </div>
                </div>
            </div>`;
    });
}

// NAVIGATION & AUTH
function showPage(id) {
    document.querySelectorAll('.page-view').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    window.scrollTo(0,0);
}

function toggleMenu(open) {
    document.getElementById('sidebar').classList.toggle('-translate-x-full', !open);
    document.getElementById('overlay').classList.toggle('hidden', !open);
}

// Firebase Auth Observer
auth.onAuthStateChanged(user => {
    const authUI = document.getElementById('auth-ui');
    const userDash = document.getElementById('user-dashboard');
    if(user) {
        authUI.classList.add('hidden');
        userDash.classList.remove('hidden');
        document.getElementById('profilePic').src = user.photoURL || 'https://via.placeholder.com/100';
        document.getElementById('profileName').innerText = user.displayName || 'Guest User';
        document.getElementById('profileEmail').innerText = user.email || user.phoneNumber;
    } else {
        authUI.classList.remove('hidden');
        userDash.classList.add('hidden');
    }
});

function authAction(type) {
    let provider;
    if(type === 'google') provider = new firebase.auth.GoogleAuthProvider();
    if(type === 'facebook') provider = new firebase.auth.FacebookAuthProvider();
    
    if(provider) auth.signInWithPopup(provider);
    else if(type === 'mobile') alert("Firebase Phone Auth triggered for: " + document.getElementById('mobileInput').value);
}

window.onload = () => { initHome(); runHero(); };

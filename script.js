const firebaseConfig = {
    apiKey: "AIzaSyAY3G265zTP5Qpf9EoGlGy2sSrVYGI4LGk",
    authDomain: "zyracollective.shop", 
    projectId: "genzfood2-96e43",
    storageBucket: "genzfood2-96e43.firebasestorage.app",
    messagingSenderId: "410241064931",
    appId: "1:410241064931:web:a9dcb7f9401d22b2a30ad6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
let user = null;

const productsData = {
    "Burkha": Array(7).fill({ name: "Premium Burkha", price: "499" }),
    "Abaya": Array(7).fill({ name: "Luxury Abaya", price: "499" }),
    "Hijab": Array(7).fill({ name: "Silk Hijab", price: "499" }),
    "Kurta": Array(7).fill({ name: "Designer Kurta", price: "499" }),
    "Prayer Mat": Array(7).fill({ name: "Soft Sajadah", price: "499" }),
    "Attar": Array(7).fill({ name: "Royal Attar", price: "499" })
};

// SLIDER LOGIC (4 ITEMS)
let slideIndex = 0;
function startSlider() {
    const slider = document.getElementById('slider-container');
    if(!slider) return;
    setInterval(() => {
        slideIndex++;
        if(slideIndex >= 4) slideIndex = 0;
        slider.style.transform = `translateX(-${slideIndex * 25}%)`;
    }, 4000);
}

function initHome() {
    const grid = document.getElementById('category-grid');
    if(!grid) return;
    grid.innerHTML = '';
    Object.keys(productsData).forEach((cat, index) => {
        grid.innerHTML += `
            <div onclick="openCat('${cat}')" class="bg-gray-50 p-2 rounded-3xl border text-center cursor-pointer">
                <img src="images/category${index + 1}.png" class="h-44 w-full object-cover rounded-2xl">
                <p class="mt-2 text-[10px] font-bold uppercase tracking-[2px] text-gray-600">${cat}</p>
            </div>`;
    });
}

function showSection(id) {
    document.querySelectorAll('.app-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    toggleSidebar(false);
}

function handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => alert(err.message));
}

auth.onAuthStateChanged(u => {
    user = u;
    if(u) {
        document.getElementById('u-img').src = u.photoURL;
        document.getElementById('u-name').innerText = u.displayName;
        document.getElementById('u-email').innerText = u.email;
    }
});

function toggleSidebar(f) {
    document.getElementById('sidebar').classList.toggle('active', f);
    document.getElementById('overlay').classList.toggle('active', f);
}

window.onload = () => {
    initHome();
    startSlider();
};

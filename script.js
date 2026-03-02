const firebaseConfig = {
    apiKey: "AIzaSyAY3G265zTP5Qpf9EoGlGy2sSrVYGI4LGk",
    authDomain: "genzfood2-96e43.firebaseapp.com",
    projectId: "genzfood2-96e43",
    storageBucket: "genzfood2-96e43.firebasestorage.app",
    messagingSenderId: "410241064931",
    appId: "1:410241064931:web:a9dcb7f9401d22b2a30ad6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
let user = null;
let currentItem = null;

const FORMSPREE_ID = "mkovazzj"; 

const productsData = {
    "Burkha": [
        { name: "Classic Nida", price: "499" }, { name: "Lace Luxe", price: "499" },
        { name: "Stone Work", price: "499" }, { name: "Dubai Style", price: "499" },
        { name: "Butterfly Cut", price: "499" }, { name: "Satin Silk", price: "499" },
        { name: "Daily Wear", price: "499" }
    ],
    "Abaya": [
        { name: "A-Line Cut", price: "499" }, { name: "Kimono Style", price: "499" },
        { name: "Open Front", price: "499" }, { name: "Zari Abaya", price: "499" },
        { name: "Premium Velvet", price: "499" }, { name: "Summer Breeze", price: "499" },
        { name: "Luxe Satin", price: "499" }
    ],
    "Hijab": [
        { name: "Chiffon Soft", price: "499" }, { name: "Premium Jersey", price: "499" },
        { name: "Crinkle Silk", price: "499" }, { name: "Satin Pearl", price: "499" },
        { name: "Instant Hijab", price: "499" }, { name: "Viscose Matte", price: "499" },
        { name: "Modal Hijab", price: "499" }
    ],
    "Kurta": [
        { name: "Floral Print", price: "499" }, { name: "Casual Linen", price: "499" },
        { name: "Festive Cut", price: "499" }, { name: "Embroidered", price: "499" },
        { name: "Luxe Rayon", price: "499" }, { name: "Long Flared", price: "499" },
        { name: "Party Wear", price: "499" }
    ],
    "Prayer Mat": [
        { name: "Turkish Padded", price: "499" }, { name: "Velvet Mat", price: "499" },
        { name: "Travel Mat", price: "499" }, { name: "Orthopedic", price: "499" },
        { name: "Kids Mat", price: "499" }, { name: "Royal Thread", price: "499" },
        { name: "Silk Mat", price: "499" }
    ],
    "Attar": [
        { name: "Oud Al-Layl", price: "499" }, { name: "White Musk", price: "499" },
        { name: "Dehn Oud", price: "499" }, { name: "Rose Special", price: "499" },
        { name: "Arabian Night", price: "499" }, { name: "Sweet Amber", price: "499" },
        { name: "Sandalwood", price: "499" }
    ]
};

function initHome() {
    const grid = document.getElementById('category-grid');
    if(!grid) return;
    grid.innerHTML = '';
    Object.keys(productsData).forEach((cat, index) => {
        const catImg = `images/category${index + 1}.png`; 
        grid.innerHTML += `
            <div onclick="openCat('${cat}')" class="bg-gray-50 p-2 rounded-3xl border text-center cursor-pointer transform active:scale-95 transition-transform shadow-sm hover:shadow-md">
                <img src="${catImg}" class="h-44 w-full object-cover rounded-2xl" onerror="this.src='https://via.placeholder.com/300?text=${cat}'">
                <p class="mt-2 text-[10px] font-bold uppercase tracking-[2px] text-gray-600">${cat}</p>
            </div>`;
    });
}

function showSection(id, type) {
    if((id === 'checkout-page' || id === 'orders-page') && !user) { 
        handleAuth(); return; 
    }

    document.querySelectorAll('.app-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');

    document.querySelectorAll('.fixed.bottom-0 div').forEach(d => d.classList.replace('text-gold', 'text-gray-400'));
    if(id === 'home-page') document.getElementById('nav-home').classList.replace('text-gray-400', 'text-gold');
    if(id === 'orders-page') document.getElementById('nav-orders').classList.replace('text-gray-400', 'text-gold');
    if(id === 'profile-page') document.getElementById('nav-profile').classList.replace('text-gray-400', 'text-gold');

    if(id === 'policy-page') {
        document.getElementById('pol-title').innerText = type + " Policy";
        document.getElementById('pol-body').innerText = type === 'Return' 
            ? "Items can be exchanged within 7 days. Product must be unused with tags." 
            : "Your data is 100% secure with Zyra Collective for order processing only.";
    }
    if(id === 'orders-page' && user) fetchOrders();
    toggleSidebar(false);
    window.scrollTo(0,0);
}

function toggleSidebar(f) {
    document.getElementById('sidebar').classList.toggle('active', f);
    document.getElementById('overlay').classList.toggle('active', f);
}

function toggleQR(show) { document.getElementById('qr-section').classList.toggle('hidden', !show); }

function handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(() => {
        console.log("Logged In Successfully");
    }).catch(err => alert(err.message));
}

auth.onAuthStateChanged(u => {
    user = u;
    if(u) {
        document.getElementById('top-auth').innerHTML = `<img src="${u.photoURL}" class="w-8 h-8 rounded-full border border-gold">`;
        document.getElementById('u-img').src = u.photoURL;
        document.getElementById('u-name').innerText = u.displayName;
        document.getElementById('u-email').innerText = u.email;
        document.getElementById('cust-name').value = u.displayName;
        document.getElementById('auth-btn').innerText = "Sign Out";
        document.getElementById('auth-btn').onclick = () => auth.signOut().then(() => location.reload());
    } else {
        document.getElementById('top-auth').innerHTML = `<button class="text-[10px] font-bold border-b-2 border-gold uppercase">Login</button>`;
        document.getElementById('u-img').src = "https://via.placeholder.com/100";
        document.getElementById('u-name').innerText = "Guest User";
        document.getElementById('auth-btn').innerText = "Login with Google";
        document.getElementById('auth-btn').onclick = handleAuth;
    }
});

function openCat(name) {
    showSection('product-view');
    document.getElementById('cat-title').innerText = name;
    const list = document.getElementById('prod-list');
    list.innerHTML = '';
    const folderName = name.toLowerCase().replace(/\s/g, '');

    productsData[name].forEach((item, i) => {
        const pImg = `images/${folderName}${i + 1}.png`; 
        list.innerHTML += `
        <div class="bg-white p-4 rounded-[40px] border shadow-sm">
            <img src="${pImg}" class="w-full h-80 object-cover rounded-[30px]" onerror="this.src='https://via.placeholder.com/400?text=${item.name}'">
            <div class="mt-4 flex justify-between items-center px-2">
                <div><h4 class="font-bold text-[11px] uppercase tracking-tighter">${item.name}</h4><p class="text-gold font-bold">₹${item.price}</p></div>
                <button onclick="startCheckout('${item.name}', '₹${item.price}')" class="bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Buy Now</button>
            </div>
        </div>`;
    });
}

function startCheckout(name, price) {
    currentItem = { name, price };
    showSection('checkout-page');
    document.getElementById('item-summary').innerHTML = `
        <p class="text-[10px] font-bold opacity-30 uppercase mb-1">Your Selection</p>
        <h4 class="font-bold text-lg">${name}</h4>
        <p class="text-gold font-bold text-xl">${price}</p>
    `;
}

document.getElementById('order-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('order-btn');
    btn.innerText = "Processing...";
    btn.disabled = true;

    const data = {
        Name: document.getElementById('cust-name').value,
        Email: user.email,
        Phone: document.getElementById('cust-phone').value,
        Address: document.getElementById('cust-address').value,
        Payment: document.querySelector('input[name="pay-method"]:checked').value,
        Item: currentItem.name,
        Price: currentItem.price,
        Date: new Date().toLocaleString()
    };

    try {
        await db.collection("orders").add(data);
        await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert("✨ Order Placed Successfully!");
        showSection('orders-page');
    } catch (err) { alert("Error: " + err.message); }
    btn.innerText = "Place Order"; btn.disabled = false;
});

async function fetchOrders() {
    const list = document.getElementById('order-list');
    list.innerHTML = '<p class="text-center opacity-30 py-10">Searching orders...</p>';
    try {
        const snap = await db.collection("orders").where("Email", "==", user.email).get();
        list.innerHTML = '';
        if(snap.empty) {
            list.innerHTML = '<div class="text-center py-20 opacity-30"><i class="fas fa-box-open text-4xl mb-4"></i><p>No orders yet.</p></div>';
            return;
        }
        snap.forEach(doc => {
            const d = doc.data();
            list.innerHTML += `<div class="p-5 bg-white border rounded-[30px] mb-4 shadow-sm">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-[8px] bg-gold/10 text-gold px-3 py-1 rounded-full font-bold uppercase">${d.Payment}</span>
                    <p class="text-[8px] opacity-40">${d.Date}</p>
                </div>
                <h4 class="font-bold text-sm uppercase">${d.Item}</h4>
                <p class="text-gold font-bold text-lg">${d.Price}</p>
            </div>`;
        });
    } catch(e) { list.innerHTML = "Error loading orders."; }
}

// Auto Slider
let cur = 0;
setInterval(() => {
    const s = document.getElementById('slider-container');
    if(s) { cur = (cur + 1) % 3; s.style.transform = `translateX(-${cur * 33.33}%)`; }
}, 4000);

initHome();
      

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
let currentItem = null;

// RESTORED: All 7 Products per Category
const productsData = {
    "Burkha": [
        { name: "Classic Nida", price: "499" }, { name: "Lace Luxe", price: "499" }, 
        { name: "Stone Work", price: "499" }, { name: "Premium Dubai", price: "499" },
        { name: "Daily Wear", price: "499" }, { name: "Party Wear", price: "499" }, { name: "Zari Work", price: "499" }
    ],
    "Abaya": [
        { name: "A-Line Cut", price: "499" }, { name: "Kimono Style", price: "499" }, 
        { name: "Open Front", price: "499" }, { name: "Butterfly", price: "499" },
        { name: "Coat Style", price: "499" }, { name: "Classic Black", price: "499" }, { name: "Modest Fit", price: "499" }
    ],
    "Hijab": [
        { name: "Chiffon Soft", price: "499" }, { name: "Premium Jersey", price: "499" },
        { name: "Cotton Silk", price: "499" }, { name: "Crinkle", price: "499" },
        { name: "Satin Silk", price: "499" }, { name: "Georgette", price: "499" }, { name: "Modal", price: "499" }
    ],
    "Kurta": [
        { name: "Floral Print", price: "499" }, { name: "Casual Linen", price: "499" },
        { name: "Cotton Blend", price: "499" }, { name: "Embroidered", price: "499" },
        { name: "Straight Cut", price: "499" }, { name: "Anarkali", price: "499" }, { name: "Office Wear", price: "499" }
    ],
    "Prayer Mat": [
        { name: "Turkish Padded", price: "499" }, { name: "Velvet Mat", price: "499" },
        { name: "Foam Base", price: "499" }, { name: "Travel Foldable", price: "499" },
        { name: "Sajadah Lux", price: "499" }, { name: "Kids Mat", price: "499" }, { name: "Classic Red", price: "499" }
    ],
    "Attar": [
        { name: "Oud Al-Layl", price: "499" }, { name: "White Musk", price: "499" },
        { name: "Rose Sandal", price: "499" }, { name: "Majmua", price: "499" },
        { name: "Amber", price: "499" }, { name: "Jasmine", price: "499" }, { name: "Mogra", price: "499" }
    ]
};

function initHome() {
    const grid = document.getElementById('category-grid');
    if(!grid) return;
    grid.innerHTML = '';
    Object.keys(productsData).forEach((cat, index) => {
        const catImg = `images/category${index + 1}.png`; 
        grid.innerHTML += `
            <div onclick="openCat('${cat}')" class="bg-gray-50 p-2 rounded-3xl border text-center cursor-pointer shadow-sm transform active:scale-95 transition">
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
    
    if(id === 'policy-page') {
        document.getElementById('pol-title').innerText = type + " Policy";
        document.getElementById('pol-body').innerHTML = type === 'Return' ? "7-Days Return Policy for unused items." : "Your data is safe with Zyra Collective.";
    }
    if(id === 'orders-page') fetchOrders();
    window.scrollTo(0,0);
}

function handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => {
        if(err.code === 'auth/popup-blocked') auth.signInWithRedirect(provider);
        else alert(err.message);
    });
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
    document.getElementById('item-summary').innerHTML = `<h4 class="font-bold">${name}</h4><p class="text-gold font-bold">${price}</p>`;
}

document.getElementById('order-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('order-btn');
    btn.innerText = "Processing...";
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
        alert("✨ Order Placed Successfully!");
        showSection('orders-page');
    } catch (err) { alert(err.message); }
    btn.innerText = "Place Order";
});

async function fetchOrders() {
    const list = document.getElementById('order-list');
    if(!user) return;
    list.innerHTML = '<p class="text-center opacity-30 py-10">Searching...</p>';
    const snap = await db.collection("orders").where("Email", "==", user.email).get();
    list.innerHTML = '';
    if(snap.empty) { list.innerHTML = '<p class="text-center py-20 opacity-30">No orders found.</p>'; return; }
    snap.forEach(doc => {
        const d = doc.data();
        list.innerHTML += `<div class="p-5 bg-white border rounded-[30px] mb-4 shadow-sm">
            <div class="flex justify-between"><span class="text-[8px] bg-gold/10 text-gold px-2 py-1 rounded-full font-bold uppercase">${d.Payment}</span><p class="text-[8px] opacity-40">${d.Date}</p></div>
            <h4 class="font-bold text-sm uppercase mt-2">${d.Item}</h4>
            <p class="text-gold font-bold">${d.Price}</p>
        </div>`;
    });
}

function toggleSidebar(f) {
    document.getElementById('sidebar').classList.toggle('active', f);
    document.getElementById('overlay').classList.toggle('active', f);
}

function toggleQR(show) { document.getElementById('qr-section').classList.toggle('hidden', !show); }

initHome();
            

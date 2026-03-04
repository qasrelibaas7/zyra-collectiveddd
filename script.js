// FIREBASE CONFIG
const firebaseConfig = {
apiKey: "AIzaSyAY3G265zTP5Qpf9EoGlGy2sSrVYGI4LGk",
authDomain: "genzfood2-96e43.firebaseapp.com",
projectId: "genzfood2-96e43",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// HERO SLIDER
let slides = document.querySelectorAll(".slide");
let current = 0;

setInterval(() => {
slides[current].classList.remove("active");
current = (current + 1) % slides.length;
slides[current].classList.add("active");
},3000);

// MENU
function toggleMenu(){
document.getElementById("sidebar").classList.toggle("active");
}

// CATEGORY + PRODUCT DATA
const categories = ["burkha","hijab","abaya","kurta","attar","prayermat"];

const categoryContainer = document.getElementById("categories");

categories.forEach((cat,index)=>{
categoryContainer.innerHTML += `
<div class="category" onclick="showProducts('${cat}')">
<img src="images/category${index+1}.png" width="100%">
<h4>${cat.toUpperCase()}</h4>
</div>`;
});

function showProducts(cat){
const container = document.getElementById("products");
container.innerHTML = "";

for(let i=1;i<=7;i++){
container.innerHTML += `
<div class="product">
<img src="images/${cat}${i}.png" width="100%">
<h4>${cat.toUpperCase()} Premium ${i}</h4>
<p>Luxury ${cat} design.</p>
<p>₹${1999 + i*100}</p>
<button onclick="openCheckout('${cat} ${i}',${1999 + i*100})">Buy Now</button>
</div>`;
}
}

// CHECKOUT
let selectedProduct = "";
let selectedPrice = 0;

function openCheckout(name,price){
selectedProduct = name;
selectedPrice = price;
document.getElementById("checkout").style.display="flex";
}

function paymentToggle(){
let method = document.getElementById("paymentMethod").value;
document.getElementById("qrBox").style.display = method==="upi"?"block":"none";
}

function placeOrder(){
let name = document.getElementById("custName").value;
let address = document.getElementById("custAddress").value;
let payment = document.getElementById("paymentMethod").value;

fetch("https://formspree.io/f/mkovazzj",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
name,
address,
product:selectedProduct,
price:selectedPrice,
payment
})
}).then(()=>{
window.location.href=`https://wa.me/917385009275?text=New Order: ${selectedProduct} ₹${selectedPrice}`;
});
}

// GOOGLE LOGIN
function googleLogin(){
let provider = new firebase.auth.GoogleAuthProvider();
auth.signInWithPopup(provider);
}

// SEARCH
function searchProducts(){
let input = document.getElementById("searchInput").value.toLowerCase();
document.querySelectorAll(".product").forEach(card=>{
card.style.display = card.innerText.toLowerCase().includes(input) ? "block":"none";
});
}

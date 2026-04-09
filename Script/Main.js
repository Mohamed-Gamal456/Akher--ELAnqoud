// ===============================
// -------- إخفاء الهيدر العلوي عند النزول --------
let lastScroll = 0;
const headerUp = document.querySelector('.header-up');

if (headerUp) {
    window.addEventListener("scroll", () => {
        let currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 50) {
            // النزول
            headerUp.classList.add("hide");
        } else {
            // الصعود
            headerUp.classList.remove("hide");
        }

        lastScroll = currentScroll;
    });
}

// ===============================
// -------- سلايدر متكامل --------
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetAutoScroll();
}

let autoScroll = setInterval(() => changeSlide(1), 5000);

function resetAutoScroll() {
    clearInterval(autoScroll);
    autoScroll = setInterval(() => changeSlide(1), 5000);
}

// ===============================
// -------- المنيو المنسدلة للهاتف --------
const menuBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');

if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mainNav.classList.toggle('active');
    });

    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });
    });

    document.addEventListener('click', (event) => {
        const isClickInside = mainNav.contains(event.target) || menuBtn.contains(event.target);
        if (!isClickInside && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
        }
    });
}

// ===============================
// -------- إضافة المنتج للسلة مع دعم الكمية ومنع التكرار --------
document.addEventListener("click", function (e) {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;

    const product = {
        name: btn.dataset.name,
        sku: btn.dataset.sku,
        price: Number(btn.dataset.price),
        image: btn.dataset.image,
        quantity: Number(btn.dataset.qty) || 1
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingIndex = cart.findIndex(item => item.sku === product.sku);

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += product.quantity;
        showToast("المنتج في السلة", "success");
    } else {
        cart.push(product);
        showToast("تم إضافة المنتج للسلة", "success");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
});

// كود ترتيب المنتجات حسب السعر في الصفات المنتجات
document.getElementById("sort-select").addEventListener("change", function () {
    sortByPrice(this.value);
});

function sortByPrice(type) {
    const container = document.querySelector(".products-grid");
    const products = Array.from(container.querySelectorAll(".product-card"));

    products.sort((a, b) => {
        const priceA = Number(a.dataset.price);
        const priceB = Number(b.dataset.price);

        if (type === "price-high") {
            return priceB - priceA; // الأعلى الأول
        }
        if (type === "price-low") {
            return priceA - priceB; // الأقل الأول
        }
        return 0;
    });

    container.innerHTML = "";
    products.forEach(product => container.appendChild(product));
}

// 🛒 كود السلة الأساسي (زي ما انت كتبته)
// let cart = JSON.parse(localStorage.getItem("cart")) || [];

// function updateCartDisplay() {
//     const cartItems = document.getElementById("cart-items");
//     const cartTotal = document.getElementById("cart-total");
//     const cartCountSide = document.getElementById("cart-count"); // الرقم اللي على الجنب
//     const cartCountHeader = document.getElementById("cart-count-header"); // الرقم اللي في الهيدر

//     cartItems.innerHTML = "";
//     let total = 0;
//     let count = 0;

//     cart.forEach((item, index) => {
//         total += item.price * item.quantity;
//         count += item.quantity;

//         const itemDiv = document.createElement("div");
//         itemDiv.classList.add("cart-item-detailed"); // كلاس جديد لتنسيق أفضل
//         itemDiv.innerHTML = `
//             <div class="item-info">
//                 <img src="${item.image}" width="50">
//                 <div>
//                     <h4>${item.name}</h4>
//                     <p>مقاس: ${item.size} | لون: ${item.color}</p>
//                     <span>${item.quantity} × ${item.price} EGP</span>
//                 </div>
//             </div>
//             <button onclick="removeItem(${index})">❌</button>
//         `;
//         cartItems.appendChild(itemDiv);
//     });

//     // تحديث الأرقام في كل مكان
//     cartTotal.textContent = total;
//     if(cartCountSide) cartCountSide.textContent = count;
//     if(cartCountHeader) cartCountHeader.textContent = count;

//     localStorage.setItem("cart", JSON.stringify(cart));
// }
// function addToCart(name, price) {
//     const existing = cart.find(item => item.name === name);
//     if (existing) {
//     existing.quantity += 1;
//     } else {
//     cart.push({ name, price, quantity: 1 });
//     }
//     updateCartDisplay();
// }

// function removeItem(index) {
//     cart.splice(index, 1);
//     updateCartDisplay();
// }

// document.getElementById("clear-cart").addEventListener("click", () => {
//     cart = [];
//     updateCartDisplay();
// });

// document.getElementById("cart-btn").addEventListener("click", () => {
//     document.getElementById("cart-modal").classList.toggle("show");
// });

// updateCartDisplay();

// // 👇 كود إخفاء الزر عند النزول وظهوره عند الصعود
// let lastScrollTop = 0;
// const cartContainer = document.querySelector('.cart-container');

// window.addEventListener("scroll", function () {
//     let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//     if (scrollTop > lastScrollTop) {
//     cartContainer.style.opacity = "0";
//     cartContainer.style.pointerEvents = "none";
//     } else {
//     cartContainer.style.opacity = "1";
//     cartContainer.style.pointerEvents = "auto";
//     }

//     lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
// }, false);

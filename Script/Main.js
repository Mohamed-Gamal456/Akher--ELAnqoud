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

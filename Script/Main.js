// -------- إخفاء الهيدر العلوي عند النزول --------
let lastScroll = 0;
const headerUp = document.querySelector('.header-up');

window.addEventListener("scroll", () => {
    let currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 50) {
        // نزول
        headerUp.classList.add("hide");
    } else {
        // صعود
        headerUp.classList.remove("hide");
    }

    lastScroll = currentScroll;
});
// 🛒 كود السلة الأساسي (زي ما انت كتبته)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
        <span>${item.name} (${item.quantity})</span>
        <span>${item.price * item.quantity} EGP</span>
        <button onclick="removeItem(${index})">❌</button>
    `;
    cartItems.appendChild(itemDiv);
    });

    cartTotal.textContent = total;
    cartCount.textContent = count;

    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
    existing.quantity += 1;
    } else {
    cart.push({ name, price, quantity: 1 });
    }
    updateCartDisplay();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    updateCartDisplay();
});

document.getElementById("cart-btn").addEventListener("click", () => {
    document.getElementById("cart-modal").classList.toggle("show");
});

updateCartDisplay();

// 👇 كود إخفاء الزر عند النزول وظهوره عند الصعود
let lastScrollTop = 0;
const cartContainer = document.querySelector('.cart-container');

window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
    cartContainer.style.opacity = "0";
    cartContainer.style.pointerEvents = "none";
    } else {
    cartContainer.style.opacity = "1";
    cartContainer.style.pointerEvents = "auto";
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);
//-------- نظام السلايدر المتكامل -----------//
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');

    function showSlide(index) {
        // إزالة الكلاس من الجميع
        slides.forEach(slide => slide.classList.remove('active'));

        // ضبط الـ index
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;

        // إضافة الكلاس للشريحة المطلوبة
        slides[currentSlide].classList.add('active');
    }

    function changeSlide(direction) {
        showSlide(currentSlide + direction);
        resetAutoScroll();
    }

    // التبديل التلقائي
    let autoScroll = setInterval(() => changeSlide(1), 5000);

    function resetAutoScroll() {
        clearInterval(autoScroll);
        autoScroll = setInterval(() => changeSlide(1), 5000);
    }
    // --------------- المنيو المنسدلة لأسفل -----------------------
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    // عند الضغط على زر المنيو (الثلاث شرط)
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // منع غلق المنيو فوراً عند الضغط على الزر نفسه
        mainNav.classList.toggle('active');
    });

    // إغلاق المنيو عند الضغط على أي رابط بداخلها
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });
    });

    // إغلاق المنيو تلقائياً إذا ضغط المستخدم في أي مكان خارجها
    document.addEventListener('click', (event) => {
        const isClickInside = mainNav.contains(event.target) || menuBtn.contains(event.target);
        
        if (!isClickInside && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
        }
    });
    // ------------------ نظام السلايدر للمنتجات المحدث -------------------//
    function moveSlide(direction) {
        const wrapper = document.getElementById('productsWrapper');
        const productItem = document.querySelector('.product-item');
        
        if (productItem) {
            // حساب عرض الكارت الواحد مع المسافة (gap)
            const cardWidth = productItem.offsetWidth + 15; 

            // التمرير بناءً على الاتجاه
            // في المواقع العربية (RTL)، نحتاج لضرب القيمة في -1 ليعمل السهم بشكل صحيح
            wrapper.scrollBy({
                left: (direction * cardWidth) * -1, 
                behavior: 'smooth'
            });
        }
    }
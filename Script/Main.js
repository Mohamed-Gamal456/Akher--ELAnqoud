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
    const cartCountSide = document.getElementById("cart-count"); // الرقم اللي على الجنب
    const cartCountHeader = document.getElementById("cart-count-header"); // الرقم اللي في الهيدر

    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item-detailed"); // كلاس جديد لتنسيق أفضل
        itemDiv.innerHTML = `
            <div class="item-info">
                <img src="${item.image}" width="50">
                <div>
                    <h4>${item.name}</h4>
                    <p>مقاس: ${item.size} | لون: ${item.color}</p>
                    <span>${item.quantity} × ${item.price} EGP</span>
                </div>
            </div>
            <button onclick="removeItem(${index})">❌</button>
        `;
        cartItems.appendChild(itemDiv);
    });

    // تحديث الأرقام في كل مكان
    cartTotal.textContent = total;
    if(cartCountSide) cartCountSide.textContent = count;
    if(cartCountHeader) cartCountHeader.textContent = count;

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


// ------------------ 1. نظام تصفية المنتجات (Price & Sizes) -------------------//

// تحديث قيمة شريط السعر (Slider) وعرضها للعميل
const priceSlider = document.querySelector('.price-slider');
const priceLabels = document.querySelectorAll('.price-labels span');

if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
        const currentVal = e.target.value;
        // تحديث الرقم اللي على اليسار في الفلتر
        priceLabels[1].textContent = `${currentVal} EGP`;
        
        // منطق الفلترة الفعلي: إخفاء المنتجات الأغلى من السعر المختار
        filterProductsByPrice(currentVal);
    });
}

function filterProductsByPrice(maxPrice) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const priceText = product.querySelector('.current-price').textContent;
        const price = parseFloat(priceText.replace(' EGP', '').replace(',', ''));
        
        if (price <= maxPrice) {
            product.style.display = "block";
            product.style.animation = "fadeIn 0.5s";
        } else {
            product.style.display = "none";
        }
    });
}

// نظام اختيار وتصفية المقاسات المحدث (Real Filtering)
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // 1. التنسيق البصري: تلوين الزرار المختار
        this.parentElement.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const selectedSize = this.textContent.trim(); // هيجيب مثلاً "2Y"
        const products = document.querySelectorAll('.product-card');

        // 2. منطق الفلترة
        products.forEach(product => {
            // هنجيب المقاسات المكتوبة في الـ data-size اللي شرحناه
            const productSizes = product.getAttribute('data-size') || ""; 
            
            // تحويل النص لمصفوفة (Array) عشان نتأكد من المقاس بدقة
            const sizesArray = productSizes.split(',');

            if (sizesArray.includes(selectedSize)) {
                product.style.display = "block";
                product.style.animation = "fadeIn 0.5s";
            } else {
                product.style.display = "none";
            }
        });

        console.log("تم عرض المنتجات المتوفرة بمقاس:", selectedSize);
    });
});
// ------------------ 2. نظام تصفية المنتجات (Categories) -------------------//
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // تغيير الشكل البصري للزر النشط
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const category = this.getAttribute('data-category');
        const products = document.querySelectorAll('.product-card');

        products.forEach(product => {
            if (category === 'all' || product.getAttribute('data-category') === category) {
                product.style.display = "block";
                product.style.animation = "fadeIn 0.5s";
            } else {
                product.style.display = "none";
            }
        });
    });
});

// دالة التمرير التلقائي للمنتجات
function scrollToProducts() {
    if (window.innerWidth <= 768) { // تعمل فقط في شاشات الموبايل
        const target = document.querySelector('.products-toolbar') || document.querySelector('.products-grid');
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
}

// ربط التمرير بفلتر المقاسات
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', scrollToProducts);
});

// ربط التمرير بفلتر الفئات
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', scrollToProducts);
});

// ربط التمرير بشريط السعر (عند الانتهاء من التحريك)
if (priceSlider) {
    priceSlider.addEventListener('change', scrollToProducts); 
}
// ------------------ 3. نظام ترتيب المنتجات (Sorting) -------------------//

const sortSelect = document.getElementById('sort-select');
if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const criteria = this.value;
        const grid = document.querySelector('.products-grid');
        const products = Array.from(grid.querySelectorAll('.product-card'));

        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.current-price').textContent.replace(' EGP', '').replace(',', ''));
            const priceB = parseFloat(b.querySelector('.current-price').textContent.replace(' EGP', '').replace(',', ''));

            if (criteria === 'price-low') return priceA - priceB;
            if (criteria === 'price-high') return priceB - priceA;
            if (criteria === 'new') return 0; // محتاجة data-date لترتيبها فعلياً
            return 0;
        });

        // إعادة ترتيب العناصر في الصفحة
        grid.innerHTML = "";
        products.forEach(p => grid.appendChild(p));
    });
}


// ------------------ 4. تحسينات بسيطة للأنيميشن -------------------//
// إضافة تأثير ظهور ناعم للمنتجات
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .size-btn.active {
        background-color: #ff3b3b !important;
        color: white !important;
        border-color: #ff3b3b !important;
    }
`;
document.head.appendChild(style);


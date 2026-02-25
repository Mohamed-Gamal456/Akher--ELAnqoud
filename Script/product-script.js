// 1. المتغيرات الأساسية لتخزين اختيارات العميل
let productSelection = {
    color: 'كحلي', // اللون الافتراضي بناءً على الصورة الأولى
    size: null,
    qty: 1
};

// --- أ- وظيفة تبديل الصور والألوان ---
const thumbnails = document.querySelectorAll('.thumb');
const mainView = document.getElementById('main-view');

thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
        // تغيير الصورة الرئيسية
        const newImgSrc = this.querySelector('img').src;
        mainView.src = newImgSrc;

        // تحديث اللون المختار من الـ data-attribute
        productSelection.color = this.getAttribute('data-color');

        // تحديث شكل المصغرات (إضافة الـ active)
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        console.log("اللون المختار حالياً:", productSelection.color);
    });
});

// --- ب- وظيفة اختيار المقاس ---
const sizeButtons = document.querySelectorAll('.size-btn');

sizeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        // تحديث المقاس المختار
        productSelection.size = this.innerText;

        // تحديث الشكل الجمالي للأزرار
        sizeButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        console.log("المقاس المختار:", productSelection.size);
    });
});

// --- ج- التحكم في الكمية ---
const qtyInput = document.getElementById('product-qty');
const plusBtn = document.querySelector('.qty-btn.plus');
const minusBtn = document.querySelector('.qty-btn.minus');

plusBtn.addEventListener('click', () => {
    productSelection.qty++;
    qtyInput.value = productSelection.qty;
});

minusBtn.addEventListener('click', () => {
    if (productSelection.qty > 1) {
        productSelection.qty--;
        qtyInput.value = productSelection.qty;
    }
});

// --- د- وظيفة الـ Zoom (اختياري احترافي) ---
const zoomContainer = document.getElementById('zoom-container');
const lens = document.getElementById('zoom-lens');

zoomContainer.addEventListener('mousemove', (e) => {
    const rect = zoomContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // تحريك العدسة وتكبير الصورة خلفها
    mainView.style.transformOrigin = `${x}px ${y}px`;
    mainView.style.transform = "scale(1.7)";
});

zoomContainer.addEventListener('mouseleave', () => {
    mainView.style.transform = "scale(1)";
});

// --- هـ- وظيفة الأكورديون (فتح وقفل المعلومات) ---
const accHeaders = document.querySelectorAll('.acc-header');

accHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const body = this.nextElementSibling;
        const icon = this.querySelector('i');
        
        body.classList.toggle('show');
        icon.classList.toggle('fa-plus');
        icon.classList.toggle('fa-minus');
    });
});

// --- و- إضافة المنتج للسلة (الترحيل النهائي) ---
const addToCartBtn = document.getElementById('add-btn');

addToCartBtn.addEventListener('click', () => {
    // التأكد من اختيار المقاس أولاً
    if (!productSelection.size) {
        alert("يا بطل، لازم تختار المقاس الأول! 🧥");
        return;
    }

    // تجميع الكائن النهائي اللي هيروح للـ LocalStorage أو الـ API
    const finalOrder = {
        name: document.querySelector('.p-title').innerText,
        sku: document.querySelector('.p-sku span').innerText,
        price: 880, // يفضل سحبه من الـ DOM برضه
        color: productSelection.color,
        size: productSelection.size,
        quantity: productSelection.qty,
        image: mainView.src
    };

    console.log("تم إرسال الطلب للسلة بنجاح:", finalOrder);
    alert(`تمت إضافة ${finalOrder.name} (مقاس: ${finalOrder.size} - لون: ${finalOrder.color}) للسلة!`);
    
    // هنا تقدر تبعت الـ finalOrder للـ API بتاعك في Node.js
});


// --- ز- إرسال الطلب لـ WhatsApp ---
function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        alert("السلة فاضية يا بطل! 🛒");
        return;
    }

    let phoneNumber = "2010XXXXXXXX"; // اكتب رقمك هنا
    let message = "📦 *طلب شراء جديد* 📦\n\n";
    
    cart.forEach((item, index) => {
        message += `*${index + 1}- ${item.name}*\n`;
        message += `• كود: ${item.id}\n`;
        message += `• مقاس: ${item.size}\n`;
        message += `• لون: ${item.color}\n`;
        message += `• كمية: ${item.quantity}\n`;
        message += `• سلع: ${item.price * item.quantity} EGP\n`;
        message += `------------------\n`;
    });

    let finalTotal = document.getElementById("cart-total").textContent;
    message += `💰 *الإجمالي الكلي:* ${finalTotal} EGP\n\n`;
    message += `📍 متاح دفع كاش أو عند الاستلام.`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}
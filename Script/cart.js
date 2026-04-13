// ===============================
// عرض المنتجات في السلة
// ===============================
function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const tableBody = document.getElementById("cart-table-body");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    cart.forEach((item, index) => {
        tableBody.innerHTML += `
        <tr class="cart-row">
            <td><img src="${item.image}" class="cart-thumb"></td>
            <td class="name">${item.name}</td>
            <td class="sku-cell">${item.sku}</td>
            <td class="unit-price">${item.price} EGP</td>
            <td class="row-total-red">${item.price} EGP</td>

            <td>
                <input type="checkbox" class="select-item" data-index="${index}">
            </td>

            <td>
                <button class="remove-x" data-index="${index}">×</button>
            </td>
        </tr>
        `;
    });
}

// ===============================
// حذف منتج من السلة
// ===============================
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-x")) {
        const index = e.target.dataset.index;

        if (index === undefined) return;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(cart));

        renderCart();
        updateTotal();
    }
});

// ===============================
// اختيار المنتجات + تلوين الصف
// ===============================
document.addEventListener("change", function (e) {
    if (e.target.classList.contains("select-item")) {
        const row = e.target.closest("tr");

        if (row) {
            row.classList.toggle("selected", e.target.checked);
        }

        updateTotal();
    }
});

// ===============================
// حساب الإجمالي (للمحدد فقط)
// ===============================
function updateTotal() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkboxes = document.querySelectorAll(".select-item");

    let total = 0;

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const index = checkbox.dataset.index;
            total += cart[index].price;
        }
    });

    const totalElement = document.getElementById("grand-total");
    if (totalElement) {
        totalElement.textContent = total + " EGP";
    }
}

// ===============================
// إرسال الطلب على واتساب
// ===============================
function sendOrderToWhatsApp() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkboxes = document.querySelectorAll(".select-item");

    let message = "طلب جديد:\n\n";
    let hasItems = false;
    let count = 1;

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const index = checkbox.dataset.index;

            hasItems = true;

            message += `${count}- ${cart[index].name}\n`;
            message += `كود: ${cart[index].sku}\n`;
            message += `اللون: \n`;
            message += `المقاس: \n\n`;

            count++;
        }
    });

    if (!hasItems) {
        showToast("اختار منتجات الأول", "error");
        return;
    }

    // رسالة نجاح قبل التحويل
    showToast("جاري تحويلك إلى واتساب...", "success");

    const phone = "201015393524";

    setTimeout(() => {
        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    }, 1000); // تأخير بسيط عشان المستخدم يشوف الرسالة
}


// ===============================
// ارسال منتج واحد فقط للواتساب
// ===============================
document.querySelectorAll(".whatsapp-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        sendSingleProductToWhatsApp(this);
    });
});
function sendSingleProductToWhatsApp(button) {
    const name = button.dataset.name;
    const sku = button.dataset.sku;
    const price = button.dataset.price;

    let message = "طلب جديد:\n\n";
    message += `المنتج: ${name}\n`;
    message += `كود: ${sku}\n`;
    message += `السعر: ${price} جنيه\n`;
    message += `اللون: \n`;
    message += `المقاس: \n`;

    const phone = "201015393524";

    window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}

// ===============================
// تشغيل الصفحة
// ===============================
if (document.getElementById("cart-table-body")) {
    renderCart();
    updateTotal();
}

//===============================
// رسالة التنبيه
//===============================
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return; // حماية

    toast.textContent = message;

    toast.style.backgroundColor =
        type === "error" ? "#f44336" : "#4caf50";

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
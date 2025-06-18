function adjustZoomForMobile() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // خفض الزوم شوية عشان يظهر كأنه زي الكمبيوتر
        document.body.style.zoom = "90%";

        // أو استخدم scale لو zoom مش شغال كويس في بعض الموبايلات
        document.body.style.transform = "scale(0.9)";
        document.body.style.transformOrigin = "top center";
    } else {
        document.body.style.zoom = "100%";
        document.body.style.transform = "none";
    }
}

// نفذها أول مرة عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", adjustZoomForMobile);

// ولو الشاشة اتغيرت حجمها (موبايل لف أو تصغير متصفح)
window.addEventListener("resize", adjustZoomForMobile);
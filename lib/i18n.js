const translations = {
  EN: {
    nav: { home: "Home", features: "Features", languages: "Languages", pricing: "Pricing", contact: "Contact", dashboard: "Dashboard", tryFree: "Try Free" },
    hero: { title: "AI-Powered Language Intelligence Platform", subtitle: "Advanced AI text generation, translation, and grammar correction across 12 languages with specialized Kurdish dialect support.", cta1: "Start Generating Free", cta2: "Try Demo", stats: { languages: "Languages", accuracy: "Accuracy", speed: "Response Time" } },
    demo: { title: "Experience the Power", subtitle: "Try our AI with a quick interactive demo", placeholder: "Enter your text here...", generate: "Generate", clear: "Clear", result: "Result", copy: "Copy", generating: "Generating...", tabs: { generate: "Generate", rewrite: "Rewrite", grammar: "Grammar", translate: "Translate" } },
    features: { title: "Powerful Features", subtitle: "Everything you need for multilingual AI content creation", items: [{ title: "AI Text Generation", description: "Create high-quality content in 12 languages." }, { title: "Precise Translation", description: "Industry-leading translation with Kurdish dialect expertise." }, { title: "Grammar Perfection", description: "Advanced grammar correction across all supported languages." }, { title: "Lightning Fast", description: "Powered by Google Gemini 1.5 Flash for instant responses." }, { title: "RTL Support", description: "Full right-to-left support for Arabic, Kurdish, Persian." }, { title: "Smart Rewriting", description: "Intelligent text rewriting that improves clarity." }] },
    languages: { title: "12 Languages Supported", subtitle: "Including specialized Kurdish dialect support", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "Simple Pricing", subtitle: "Start free, upgrade when you need more power", free: { name: "Free", price: "$0", period: "/month", description: "Perfect for getting started", features: ["5 AI generations per day", "12 language support", "Basic grammar correction", "Standard translation", "Community support"], cta: "Get Started Free" }, pro: { name: "Pro", price: "$9.99", period: "/month", description: "For power users and professionals", features: ["Unlimited AI generations", "Advanced Kurdish dialect tuning", "Extended context window", "Priority processing speed", "Advanced grammar correction", "Priority support", "Early access to new features"], cta: "Upgrade to Pro", badge: "Most Popular" } },
    owner: { title: "App & Web Developer", subtitle: "Taha Sardar", description: "I build custom high-performance websites, mobile applications, and AI integrations tailored to your business needs at highly reasonable & competitive prices.", cta: "Order Custom App/Website", skills: "Full-Stack Developer | AI Integration Specialist" },
    contact: { title: "Get in Touch", subtitle: "Have questions? We're here to help!", whatsapp: "Chat on WhatsApp", telegram: "Join on Telegram", email: "Send Email", instagram: "Follow on Instagram", snapchat: "Add on Snapchat" },
    footer: { copyright: "© 2024 AIVision. All rights reserved.", tagline: "AI-Powered Multi-Lingual Platform" },
    dashboard: { title: "AI Generator", credits: "Credits", remaining: "remaining", unlimited: "Unlimited", history: "History", noHistory: "No history yet", upgrade: "Upgrade to Pro", pro: "Pro", free: "Free", dailyLimit: "Daily limit reached", placeholder: "Enter your prompt here...", send: "Send", clear: "Clear" },
    checkout: { title: "Upgrade to Pro", subtitle: "$9.99/month - Choose your payment method", back: "Back to Home", paymentDetails: "Payment Details", copyAddress: "Copy", copied: "Copied!", showQR: "Show QR Code", hideQR: "Hide QR Code", amount: "Amount to Pay", monthly: "Monthly subscription", submitProof: "Submit Payment Proof", fullName: "Full Name", email: "Email", transactionId: "Transaction ID / Hash", uploadReceipt: "Upload Receipt Screenshot", dragDrop: "Drag & drop or click to upload", fileTypes: "PNG, JPG, or PDF (max 5MB)", submit: "Submit Payment for Verification", submitting: "Submitting...", important: "Important:", notes: ["Verification usually takes 1-24 hours", "Make sure to send the exact amount", "Keep your transaction ID safe", "Contact support if not verified within 24 hours"], success: "Payment proof submitted successfully! We will verify and activate your Pro account within 24 hours.", networks: { fib: "First Iraqi Bank (FIB)", fastpay: "FastPay Wallet", usdt: "USDT (TRC20)" } }
  },
  'KU-BD': {
    nav: { home: "سەرەکی", features: "تایبەتمەندییەکان", languages: "زمانەکان", pricing: "نرخەکان", contact: "پەیوەندی", dashboard: "داشبۆرد", tryFree: "بەخۆڕایی تاقیبکە" },
    hero: { title: "پلاتفۆرمی زیرەکی زمانی بە AI", subtitle: "دروستکردنی دەقی پێشکەوتووی AI بە 12 زمان لەگەڵ پشتگیری شێوەزاری کوردی.", cta1: "بەخۆڕایی دەستپێبکە", cta2: "دیمۆ تاقیبکە", stats: { languages: "زمان", accuracy: "ڕێکی", speed: "کاتی وەڵام" } },
    demo: { title: "هێزەکە ئەزمون بکە", subtitle: "AI ی ئێمە بە دیمۆ تاقیبکە", placeholder: "دەقەکەت لێرە بنووسە...", generate: "دروستبکە", clear: "پاکبکەرەوە", result: "ئەنجام", copy: "کۆپیکردن", generating: "دروستدەکرێت...", tabs: { generate: "دروستکردن", rewrite: "دووبارە نووسین", grammar: "ڕێزمان", translate: "وەرگێڕان" } },
    features: { title: "تایبەتمەندییە بەهێزەکان", subtitle: "هەموو شتێک بۆ ناوەڕۆکی فرەزمانی", items: [{ title: "دروستکردنی دەقی AI", description: "ناوەڕۆکی کوالیتی بەرز دروستبکە." }, { title: "وەرگێڕانی ورد", description: "وەرگێڕانی پێشەنگ لەگەڵ شارەزایی کوردی." }, { title: "ڕێزمانی بێخەوش", description: "ڕاستکردنەوەی ڕێزمانی پێشکەوتوو." }, { title: "زۆر خێرا", description: "بە Gemini 1.5 Flash بەهێزکراوە." }, { title: "پشتگیری RTL", description: "پشتگیری تەواوی ڕاست-بۆ-چەپ." }, { title: "دووبارە نووسینی زیرەک", description: "دووبارە نووسینەوەی زیرەکی دەق." }] },
    languages: { title: "12 زمان پشتگیری دەکرێن", subtitle: "لەوانە شێوەزاری کوردی", rtl: "ڕاست-بۆ-چەپ", ltr: "چەپ-بۆ-ڕاست" },
    pricing: { title: "نرخی سادە", subtitle: "بەخۆڕایی دەستپێبکە", free: { name: "بەخۆڕایی", price: "$0", period: "/مانگ", description: "گونجاوە بۆ دەستپێکردن", features: ["5 دروستکردن لە ڕۆژێکدا", "پشتگیری 12 زمان", "ڕاستکردنەوەی ڕێزمانی سەرەتایی", "وەرگێڕانی ستاندارد", "پشتگیری کۆمەڵگە"], cta: "بەخۆڕایی دەستپێبکە" }, pro: { name: "پیشەگەر", price: "$9.99", period: "/مانگ", description: "بۆ بەکارهێنەرانی هێزدار", features: ["دروستکردنی بێسنوور", "ڕێکخستنی شێوەزاری کوردی", "پەنجەرەی کۆنتێکستی درێژکراوە", "خێرایی پێواژۆی پێشینە", "ڕێزمانی پێشکەوتوو", "پشتگیری پێشینە", "دەستپێگەیشتنی زوو"], cta: "بەرزیکردنەوە بۆ پیشەگەر", badge: "زۆرترین هەڵبژێردراو" } },
    owner: { title: "ئەپ و وێب پەرەپێدەر", subtitle: "تەها سەردار", description: "من ماڵپەڕ و ئەپی تایبەت دروستدەکەم بە نرخی گونجاو.", cta: "داواکردنی ئەپ/ماڵپەڕ", skills: "پەرەپێدەری Full-Stack" },
    contact: { title: "پەیوەندی بگرە", subtitle: "پرسیارت هەیە؟ ئێمە لێرەین!", whatsapp: "واتساپ", telegram: "تێلێگرام", email: "ئیمەیل", instagram: "ئینستاگرام", snapchat: "سپناپ" },
    footer: { copyright: "© 2024 AIVision. هەموو مافەکان پارێزراون.", tagline: "پلاتفۆرمی فرەزمانی بە AI" },
    dashboard: { title: "دروستکەری AI", credits: "کرێدیتەکان", remaining: "ماوە", unlimited: "بێسنوور", history: "مێژوو", noHistory: "هێشتا مێژوو نییە", upgrade: "بەرزیکردنەوە", pro: "پیشەگەر", free: "بەخۆڕایی", dailyLimit: "سنووری ڕۆژانە", placeholder: "داواکارییەکەت لێرە بنووسە...", send: "ناردن", clear: "پاککردنەوە" },
    checkout: { title: "بەرزیکردنەوە بۆ پیشەگەر", subtitle: "$9.99/مانگ - شێوازی پارەدان", back: "گەڕانەوە", paymentDetails: "وردەکاری پارەدان", copyAddress: "کۆپیکردن", copied: "کۆپیکرا!", showQR: "نیشاندانی QR", hideQR: "شاردنەوە", amount: "بڕی پارەدان", monthly: "ئابوونەی مانگانە", submitProof: "ناردنی بەڵگە", fullName: "ناوی تەواو", email: "ئیمەیل", transactionId: "ناسنامەی مامەڵە", uploadReceipt: "بارکردنی وێنە", dragDrop: "ڕاکێشان و دانان", fileTypes: "PNG, JPG, PDF", submit: "ناردن", submitting: "دەنێردرێت...", important: "گرنگ:", notes: ["پشتڕاستکردنەوە 1-24 کاتژمێر", "بڕی تەواو بنێرە", "ناسنامەکەت بپارێزە"], success: "بە سەرکەوتوویی نێردرا!", networks: { fib: "بانکی FIB", fastpay: "FastPay", usdt: "USDT" } }
  },
  'KU-SO': {
    nav: { home: "سەرەکی", features: "تایبەتمەندییەکان", languages: "زمانەکان", pricing: "نرخەکان", contact: "پەیوەندی", dashboard: "داشبۆرد", tryFree: "بەخۆڕایی تاقیبکەرەوە" },
    hero: { title: "پلاتفۆرمی ژیری زمانی بە AI", subtitle: "دروستکردنی دەقی پێشکەوتووی AI بە 12 زمان.", cta1: "بەخۆڕایی دەستپێبکە", cta2: "دیمۆ", stats: { languages: "زمان", accuracy: "ڕێکی", speed: "خێرایی" } },
    demo: { title: "هێزەکە ئەزمون بکە", subtitle: "AI ی ئێمە تاقیبکەرەوە", placeholder: "دەقەکەت بنووسە...", generate: "دروستبکە", clear: "پاکبکەرەوە", result: "ئەنجام", copy: "کۆپی", generating: "دروستدەکرێت...", tabs: { generate: "دروستکردن", rewrite: "دووبارە نووسینەوە", grammar: "ڕێزمان", translate: "وەرگێڕان" } },
    features: { title: "تایبەتمەندییەکان", subtitle: "هەموو شتێک بۆ ناوەڕۆکی فرەزمانی", items: [{ title: "دروستکردنی دەق", description: "ناوەڕۆکی کوالیتی بەرز." }, { title: "وەرگێڕانی ورد", description: "شارەزایی کوردی." }, { title: "ڕێزمانی بێخەوش", description: "ڕاستکردنەوەی پێشکەوتوو." }, { title: "خێرا", description: "بە Gemini بەهێزکراوە." }, { title: "RTL", description: "پشتگیری ڕاست-بۆ-چەپ." }, { title: "نووسینەوە", description: "دووبارە نووسینەوەی زیرەک." }] },
    languages: { title: "12 زمان", subtitle: "شێوەزاری کوردی", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "نرخ", subtitle: "بەخۆڕایی دەستپێبکە", free: { name: "بەخۆڕایی", price: "$0", period: "/مانگ", description: "بۆ دەستپێکردن", features: ["5 دروستکردن"], cta: "دەستپێبکە" }, pro: { name: "پیشەگەر", price: "$9.99", period: "/مانگ", description: "بۆ پیشەگەران", features: ["بێسنوور"], cta: "بەرزیکردنەوە", badge: "هەڵبژێردراو" } },
    owner: { title: "پەرەپێدەر", subtitle: "تەها سەردار", description: "ماڵپەڕ و ئەپی تایبەت دروستدەکەم.", cta: "داواکردن", skills: "پەرەپێدەر" },
    contact: { title: "پەیوەندی", subtitle: "پرسیارت هەیە؟", whatsapp: "واتساپ", telegram: "تێلێگرام", email: "ئیمەیل", instagram: "ئینستاگرام", snapchat: "سپناپ" },
    footer: { copyright: "© 2024 AIVision", tagline: "پلاتفۆرمی فرەزمانی" },
    dashboard: { title: "دروستکەری AI", credits: "کرێدیت", remaining: "ماوە", unlimited: "بێسنوور", history: "مێژوو", noHistory: "مێژوو نییە", upgrade: "بەرزیکردنەوە", pro: "پیشەگەر", free: "بەخۆڕایی", dailyLimit: "سنوور", placeholder: "داواکاری بنووسە...", send: "ناردن", clear: "پاککردنەوە" },
    checkout: { title: "بەرزیکردنەوە", subtitle: "$9.99/مانگ", back: "گەڕانەوە", paymentDetails: "وردەکاری", copyAddress: "کۆپی", copied: "کۆپیکرا", showQR: "QR", hideQR: "شاردنەوە", amount: "بڕ", monthly: "مانگانە", submitProof: "ناردن", fullName: "ناو", email: "ئیمەیل", transactionId: "ناسنامە", uploadReceipt: "بارکردن", dragDrop: "ڕاکێشان", fileTypes: "PNG, JPG", submit: "ناردن", submitting: "دەنێردرێت", important: "گرنگ", notes: ["1-24 کاتژمێر"], success: "سەرکەوتوو", networks: { fib: "FIB", fastpay: "FastPay", usdt: "USDT" } }
  },
  AR: {
    nav: { home: "الرئيسية", features: "المميزات", languages: "اللغات", pricing: "الأسعار", contact: "اتصل بنا", dashboard: "لوحة التحكم", tryFree: "جرب مجاناً" },
    hero: { title: "منصة ذكاء اللغة بالذكاء الاصطناعي", subtitle: "توليد نصوص وترجمة وتصحيح نحوي عبر 12 لغة.", cta1: "ابدأ مجاناً", cta2: "جرب العرض", stats: { languages: "لغة", accuracy: "دقة", speed: "سرعة" } },
    demo: { title: "جرب القوة", subtitle: "جرب الذكاء الاصطناعي", placeholder: "أدخل نصك...", generate: "توليد", clear: "مسح", result: "النتيجة", copy: "نسخ", generating: "جارٍ التوليد...", tabs: { generate: "توليد", rewrite: "إعادة كتابة", grammar: "قواعد", translate: "ترجمة" } },
    features: { title: "ميزات قوية", subtitle: "كل ما تحتاجه", items: [{ title: "توليد النصوص", description: "محتوى عالي الجودة." }, { title: "ترجمة دقيقة", description: "خبرة في اللهجات الكردية." }, { title: "إتقان القواعد", description: "تصحيح نحوي متقدم." }, { title: "سرعة فائقة", description: "مدعوم بـ Gemini." }, { title: "دعم RTL", description: "دعم كامل لليمين." }, { title: "إعادة كتابة", description: "تحسين الوضوح." }] },
    languages: { title: "12 لغة", subtitle: "دعم اللهجات الكردية", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "أسعار بسيطة", subtitle: "ابدأ مجاناً", free: { name: "مجاني", price: "$0", period: "/شهر", description: "مثالي للبدء", features: ["5 توليدات يومياً", "12 لغة", "تصحيح أساسي", "ترجمة قياسية", "دعم المجتمع"], cta: "ابدأ مجاناً" }, pro: { name: "احترافي", price: "$9.99", period: "/شهر", description: "للمحترفين", features: ["توليد غير محدود", "ضبط اللهجات الكردية", "نافذة سياق ممتدة", "سرعة أولوية", "تصحيح متقدم", "دعم أولوية", "ميزات جديدة"], cta: "الترقية", badge: "الأكثر شيوعاً" } },
    owner: { title: "مطور تطبيقات وويب", subtitle: "طه سردار", description: "أبني مواقع وتطبيقات مخصصة بأسعار تنافسية.", cta: "اطلب تطبيق/موقع", skills: "مطور Full-Stack" },
    contact: { title: "تواصل معنا", subtitle: "هل لديك أسئلة؟", whatsapp: "واتساب", telegram: "تيليجرام", email: "بريد", instagram: "إنستغرام", snapchat: "سناب" },
    footer: { copyright: "© 2024 AIVision", tagline: "منصة متعددة اللغات" },
    dashboard: { title: "مولد AI", credits: "الرصيد", remaining: "متبقي", unlimited: "غير محدود", history: "السجل", noHistory: "لا يوجد", upgrade: "ترقية", pro: "احترافي", free: "مجاني", dailyLimit: "الحد اليومي", placeholder: "أدخل طلبك...", send: "إرسال", clear: "مسح" },
    checkout: { title: "الترقية", subtitle: "$9.99/شهر", back: "رجوع", paymentDetails: "تفاصيل الدفع", copyAddress: "نسخ", copied: "تم النسخ", showQR: "QR", hideQR: "إخفاء", amount: "المبلغ", monthly: "شهري", submitProof: "تقديم إثبات", fullName: "الاسم", email: "البريد", transactionId: "رقم المعاملة", uploadReceipt: "تحميل الإيصال", dragDrop: "اسحب وأفلت", fileTypes: "PNG, JPG", submit: "تقديم", submitting: "جارٍ...", important: "مهم", notes: ["التحقق 1-24 ساعة", "أرسل المبلغ بالضبط", "احتفظ بالرقم"], success: "تم التقديم بنجاح", networks: { fib: "FIB", fastpay: "FastPay", usdt: "USDT" } }
  },
  TR: {
    nav: { home: "Ana Sayfa", features: "Özellikler", languages: "Diller", pricing: "Fiyatlandırma", contact: "İletişim", dashboard: "Panel", tryFree: "Ücretsiz Dene" },
    hero: { title: "Yapay Zeka Dil Platformu", subtitle: "12 dilde gelişmiş metin oluşturma ve çeviri.", cta1: "Ücretsiz Başla", cta2: "Demo", stats: { languages: "Dil", accuracy: "Doğruluk", speed: "Hız" } },
    demo: { title: "Gücü Deneyimleyin", subtitle: "Hızlı demo", placeholder: "Metninizi girin...", generate: "Oluştur", clear: "Temizle", result: "Sonuç", copy: "Kopyala", generating: "Oluşturuluyor...", tabs: { generate: "Oluştur", rewrite: "Yeniden Yaz", grammar: "Dil Bilgisi", translate: "Çevir" } },
    features: { title: "Güçlü Özellikler", subtitle: "İhtiyacınız olan her şey", items: [{ title: "Metin Oluşturma", description: "12 dilde kaliteli içerik." }, { title: "Hassas Çeviri", description: "Kürt lehçeleri uzmanlığı." }, { title: "Dil Bilgisi", description: "Gelişmiş düzeltme." }, { title: "Yıldırım Hızı", description: "Gemini destekli." }, { title: "RTL Desteği", description: "Sağdan sola tam destek." }, { title: "Yeniden Yazma", description: "Netliği artırır." }] },
    languages: { title: "12 Dil", subtitle: "Kürt lehçeleri dahil", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "Basit Fiyatlandırma", subtitle: "Ücretsiz başlayın", free: { name: "Ücretsiz", price: "$0", period: "/ay", description: "Başlangıç için", features: ["Günde 5"], cta: "Başla" }, pro: { name: "Pro", price: "$9.99", period: "/ay", description: "Profesyoneller için", features: ["Sınırsız"], cta: "Yükselt", badge: "Popüler" } },
    owner: { title: "Uygulama ve Web Geliştirici", subtitle: "Taha Sardar", description: "Rekabetçi fiyatlarla özel web siteleri ve uygulamalar.", cta: "Sipariş Ver", skills: "Full-Stack Geliştirici" },
    contact: { title: "İletişim", subtitle: "Sorularınız mı var?", whatsapp: "WhatsApp", telegram: "Telegram", email: "E-posta", instagram: "Instagram", snapchat: "Snapchat" },
    footer: { copyright: "© 2024 AIVision", tagline: "Çok Dilli Platform" },
    dashboard: { title: "AI Oluşturucu", credits: "Kredi", remaining: "kaldı", unlimited: "Sınırsız", history: "Geçmiş", noHistory: "Geçmiş yok", upgrade: "Yükselt", pro: "Pro", free: "Ücretsiz", dailyLimit: "Limit doldu", placeholder: "İsteminizi girin...", send: "Gönder", clear: "Temizle" },
    checkout: { title: "Pro'ya Yükselt", subtitle: "$9.99/ay", back: "Geri", paymentDetails: "Ödeme Detayları", copyAddress: "Kopyala", copied: "Kopyalandı", showQR: "QR Göster", hideQR: "Gizle", amount: "Tutar", monthly: "Aylık", submitProof: "Kanıt Gönder", fullName: "Ad Soyad", email: "E-posta", transactionId: "İşlem No", uploadReceipt: "Makbuz Yükle", dragDrop: "Sürükle bırak", fileTypes: "PNG, JPG", submit: "Gönder", submitting: "Gönderiliyor...", important: "Önemli", notes: ["1-24 saat"], success: "Başarıyla gönderildi", networks: { fib: "FIB", fastpay: "FastPay", usdt: "USDT" } }
  },
  FA: {
    nav: { home: "خانه", features: "ویژگی‌ها", languages: "زبان‌ها", pricing: "قیمت‌ها", contact: "تماس", dashboard: "داشبورد", tryFree: "رایگان امتحان کنید" },
    hero: { title: "پلتفرم هوش زبانی", subtitle: "تولید متن و ترجمه در ۱۲ زبان.", cta1: "شروع رایگان", cta2: "دمو", stats: { languages: "زبان", accuracy: "دقت", speed: "سرعت" } },
    demo: { title: "قدرت را تجربه کنید", subtitle: "دموی سریع", placeholder: "متن خود را وارد کنید...", generate: "تولید", clear: "پاک کردن", result: "نتیجه", copy: "کپی", generating: "در حال تولید...", tabs: { generate: "تولید", rewrite: "بازنویسی", grammar: "گرامر", translate: "ترجمه" } },
    features: { title: "ویژگی‌های قدرتمند", subtitle: "همه چیز برای محتوای چندزبانه", items: [{ title: "تولید متن", description: "محتوای باکیفیت." }, { title: "ترجمه دقیق", description: "تخصص کردی." }, { title: "گرامر", description: "تصحیح پیشرفته." }, { title: "سریع", description: "Gemini." }, { title: "RTL", description: "راست به چپ." }, { title: "بازنویسی", description: "بهبود وضوح." }] },
    languages: { title: "۱۲ زبان", subtitle: "لهجه‌های کردی", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "قیمت‌گذاری", subtitle: "رایگان شروع کنید", free: { name: "رایگان", price: "$0", period: "/ماه", description: "برای شروع", features: ["۵ تولید"], cta: "شروع" }, pro: { name: "حرفه‌ای", price: "$9.99", period: "/ماه", description: "برای حرفه‌ای‌ها", features: ["نامحدود"], cta: "ارتقا", badge: "محبوب" } },
    owner: { title: "توسعه‌دهنده", subtitle: "طه سردار", description: "سایت و اپلیکیشن سفارشی می‌سازم.", cta: "سفارش", skills: "توسعه‌دهنده" },
    contact: { title: "تماس", subtitle: "سوالی دارید؟", whatsapp: "واتساپ", telegram: "تلگرام", email: "ایمیل", instagram: "اینستاگرام", snapchat: "اسنپ" },
    footer: { copyright: "© 2024 AIVision", tagline: "پلتفرم چندزبانه" },
    dashboard: { title: "مولد AI", credits: "اعتبار", remaining: "باقی", unlimited: "نامحدود", history: "تاریخچه", noHistory: "خالی", upgrade: "ارتقا", pro: "حرفه‌ای", free: "رایگان", dailyLimit: "سقف", placeholder: "درخواست خود را وارد کنید...", send: "ارسال", clear: "پاک کردن" },
    checkout: { title: "ارتقا", subtitle: "$9.99/ماه", back: "بازگشت", paymentDetails: "جزئیات", copyAddress: "کپی", copied: "کپی شد", showQR: "QR", hideQR: "مخفی", amount: "مبلغ", monthly: "ماهانه", submitProof: "ارسال مدرک", fullName: "نام", email: "ایمیل", transactionId: "شماره تراکنش", uploadReceipt: "آپلود", dragDrop: "کشیدن", fileTypes: "PNG", submit: "ارسال", submitting: "در حال ارسال", important: "مهم", notes: ["۱-۲۴ ساعت"], success: "موفق", networks: { fib: "FIB", fastpay: "FastPay", usdt: "USDT" } }
  },
  DE: {
    nav: { home: "Startseite", features: "Funktionen", languages: "Sprachen", pricing: "Preise", contact: "Kontakt", dashboard: "Dashboard", tryFree: "Kostenlos testen" },
    hero: { title: "KI-Sprachplattform", subtitle: "Texterstellung und Übersetzung in 12 Sprachen.", cta1: "Kostenlos starten", cta2: "Demo", stats: { languages: "Sprachen", accuracy: "Genauigkeit", speed: "Geschwindigkeit" } },
    demo: { title: "Power erleben", subtitle: "Schnelle Demo", placeholder: "Text eingeben...", generate: "Generieren", clear: "Löschen", result: "Ergebnis", copy: "Kopieren", generating: "Generierung...", tabs: { generate: "Generieren", rewrite: "Umschreiben", grammar: "Grammatik", translate: "Übersetzen" } },
    features: { title: "Funktionen", subtitle: "Alles für mehrsprachige Inhalte", items: [{ title: "Texterstellung", description: "Qualitätsinhalte." }, { title: "Übersetzung", description: "Kurdische Expertise." }, { title: "Grammatik", description: "Fortschrittlich." }, { title: "Schnell", description: "Gemini." }, { title: "RTL", description: "Rechts-nach-links." }, { title: "Umschreiben", description: "Verbessert Klarheit." }] },
    languages: { title: "12 Sprachen", subtitle: "Kurdische Dialekte", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "Preise", subtitle: "Kostenlos starten", free: { name: "Kostenlos", price: "$0", period: "/Monat", description: "Für Einsteiger", features: ["5/Tag"], cta: "Starten" }, pro: { name: "Pro", price: "$9.99", period: "/Monat", description: "Für Profis", features: ["Unbegrenzt"], cta: "Upgrade", badge: "Beliebt" } },
    owner: { title: "Entwickler", subtitle: "Taha Sardar", description: "Maßgeschneiderte Websites und Apps.", cta: "Bestellen", skills: "Full-Stack" },
    contact: { title: "Kontakt", subtitle: "Fragen?", whatsapp: "WhatsApp", telegram: "Telegram", email: "E-Mail", instagram: "Instagram", snapchat: "Snapchat" },
    footer: { copyright: "© 2024 AIVision", tagline: "Mehrsprachige Plattform" },
    dashboard: { title: "KI Generator", credits: "Guthaben", remaining: "übrig", unlimited: "Unbegrenzt", history: "Verlauf", noHistory: "Kein Verlauf", upgrade: "Upgrade", pro: "Pro", free: "Kostenlos", dailyLimit: "Limit erreicht", placeholder: "Prompt eingeben...", send: "Senden", clear: "Löschen" },
    checkout: { title: "Upgrade", subtitle: "$9.99/Monat", back: "Zurück", paymentDetails: "Details", copyAddress: "Kopieren", copied: "Kopiert", showQR: "QR", hideQR: "Ausblenden", amount: "Betrag", monthly: "Monatlich", submitProof: "Nachweis", fullName: "Name", email: "E-Mail", transactionId: "Transaktions-ID", uploadReceipt: "Beleg hochladen", dragDrop: "Ziehen", fileTypes: "PNG", submit: "Absenden", submitting: "Wird gesendet", important: "Wichtig", notes: ["1-24h"], success: "Erfolgreich", networks: { fib: "FIB", fastpay: "FastPay", usdt: "USDT" } }
  },
  FR: {
    nav: { home: "Accueil", features: "Fonctionnalités", languages: "Langues", pricing: "Tarifs", contact: "Contact", dashboard: "Tableau de bord", tryFree: "Essai gratuit" },
    hero: { title: "Plateforme IA Linguistique", subtitle: "Génération de texte et traduction en 12 langues.", cta1: "Commencer", cta2: "Démo", stats: { languages: "Langues", accuracy: "Précision", speed: "Vitesse" } },
    demo: { title: "Découvrez la puissance", subtitle: "Démo rapide", placeholder: "Entrez votre texte...", generate: "Générer", clear: "Effacer", result: "Résultat", copy: "Copier", generating: "Génération...", tabs: { generate: "Générer", rewrite: "Réécrire", grammar: "Grammaire", translate: "Traduire" } },
    features: { title: "Fonctionnalités", subtitle: "Tout pour le contenu multilingue", items: [{ title: "Génération", description: "Contenu de qualité." }, { title: "Traduction", description: "Expertise kurde." }, { title: "Grammaire", description: "Avancée." }, { title: "Rapide", description: "Gemini." }, { title: "RTL", description: "Droite à gauche." }, { title: "Réécriture", description: "Améliore la clarté." }] },
    languages: { title: "12 Langues", subtitle: "Dialectes kurdes", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "Tarifs", subtitle: "Commencez gratuitement", free: { name: "Gratuit", price: "$0", period: "/mois", description: "Pour débuter", features: ["5/jour"], cta: "Commencer" }, pro: { name: "Pro", price: "$9.99", period: "/mois", description: "Pour pros", features: ["Illimité"], cta: "Upgrade", badge: "Populaire" } },
    owner: { title: "Développeur", subtitle: "Taha Sardar", description: "Sites et apps sur mesure.", cta: "Commander", skills: "Full-Stack" },
    contact: { title: "Contact", subtitle: "Questions?", whatsapp: "WhatsApp", telegram: "Telegram", email: "Email", instagram: "Instagram", snapchat: "Snapchat" },
    footer: { copyright: "© 2024 AIVision", tagline: "Plateforme multilingue" },
    dashboard: { title: "Générateur IA", credits: "Crédits", remaining: "restant", unlimited: "Illimité", history: "Historique", noHistory: "Vide", upgrade: "Upgrade", pro: "Pro", free: "Gratuit", dailyLimit: "Limite", placeholder: "Entrez votre requête...", send: "Envoyer", clear: "Effacer" },
    checkout: { title: "Upgrade", subtitle: "$9.99/mois", back: "Retour", paymentDetails: "Détails", copyAddress: "Copier", copied: "Copié", showQR: "QR", hideQR: "Masquer", amount: "Montant", monthly: "Mensuel", submitProof: "Preuve", fullName: "Nom", email: "Email", transactionId: "ID", uploadReceipt: "Reçu", dragDrop: "Glisser", fileTypes: "PNG", submit: "Soumettre", submitting: "Envoi...", important: "Important", notes: ["1-24h"], success: "Succès", networks: { fib: "FIB", fastpay: "FastPay", usdt: "USDT" } }
  },
  ES: {
    nav: { home: "Inicio", features: "Características", languages: "Idiomas", pricing: "Precios", contact: "Contacto", dashboard: "Panel", tryFree: "Probar gratis" },
    hero: { title: "Plataforma IA Lingüística", subtitle: "Generación de texto y traducción en 12 idiomas.", cta1: "Comenzar", cta2: "Demo", stats: { languages: "Idiomas", accuracy: "Precisión", speed: "Velocidad" } },
    demo: { title: "Experimenta el poder", subtitle: "Demo rápida", placeholder: "Ingresa tu texto...", generate: "Generar", clear: "Limpiar", result: "Resultado", copy: "Copiar", generating: "Generando...", tabs: { generate: "Generar", rewrite: "Reescribir", grammar: "Gramática", translate: "Traducir" } },
    features: { title: "Características", subtitle: "Todo para contenido multilingüe", items: [{ title: "Generación", description: "Contenido de calidad." }, { title: "Traducción", description: "Experiencia kurda." }, { title: "Gramática", description: "Avanzada." }, { title: "Rápido", description: "Gemini." }, { title: "RTL", description: "Derecha a izquierda." }, { title: "Reescritura", description: "Mejora claridad." }] },
    languages: { title: "12 Idiomas", subtitle: "Dialectos kurdos", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "Precios", subtitle: "Comienza gratis", free: { name: "Gratis", price: "$0", period: "/mes", description: "Para empezar", features: ["5/día"], cta: "Comenzar" }, pro: { name: "Pro", price: "$9.99", period: "/mes", description: "Para profesionales", features: ["Ilimitado"], cta: "Actualizar", badge: "Popular" } },
    owner: { title: "Desarrollador", subtitle: "Taha Sardar", description: "Sitios web y apps a medida.", cta: "Ordenar", skills: "Full-Stack" },
    contact: { title: "Contacto", subtitle: "¿Preguntas?", whatsapp: "WhatsApp", telegram: "Telegram", email: "Correo", instagram: "Instagram", snapchat: "Snapchat" },
    footer: { copyright: "© 2024 AIVision", tagline: "Plataforma multilingüe" },
    dashboard: { title: "Generador IA", credits: "Créditos", remaining: "restante", unlimited: "Ilimitado", history: "Historial", noHistory: "Vacío", upgrade: "Actualizar", pro: "Pro", free: "Gratis", dailyLimit: "Límite", placeholder: "Ingresa tu consulta...", send: "Enviar", clear: "Limpiar" },
    checkout: { title: "Actualizar", subtitle: "$9.99/mes", back: "Volver", paymentDetails: "Detalles", copyAddress: "Copiar", copied: "Copiado", showQR: "QR", hideQR: "Ocultar", amount: "Monto", monthly: "Mensual", submitProof: "Comprobante", fullName: "Nombre", email: "Correo", transactionId: "ID", uploadReceipt: "Recibo", dragDrop: "Arrastrar", fileTypes: "PNG", submit: "Enviar", submitting: "Enviando...", important: "Importante", notes: ["1-24h"], success: "Éxito", networks: { fib: "FIB", fastpay: "FastPay", usdt: "USDT" } }
  },
  RU: {
    nav: { home: "Главная", features: "Функции", languages: "Языки", pricing: "Цены", contact: "Контакты", dashboard: "Панель", tryFree: "Попробовать" },
    hero: { title: "ИИ-платформа", subtitle: "Генерация текста и перевод на 12 языках.", cta1: "Начать", cta2: "Демо", stats: { languages: "Языков", accuracy: "Точность", speed: "Скорость" } },
    demo: { title: "Оцените мощь", subtitle: "Быстрая демо", placeholder: "Введите текст...", generate: "Создать", clear: "Очистить", result: "Результат", copy: "Копировать", generating: "Создание...", tabs: { generate: "Создать", rewrite: "Переписать", grammar: "Грамматика", translate: "Перевод" } },
    features: { title: "Функции", subtitle: "Всё для контента", items: [{ title: "Генерация", description: "Качественный контент." }, { title: "Перевод", description: "Курдские диалекты." }, { title: "Грамматика", description: "Продвинутая." }, { title: "Быстро", description: "Gemini." }, { title: "RTL", description: "Справа налево." }, { title: "Переписать", description: "Улучшение ясности." }] },
    languages: { title: "12 Языков", subtitle: "Курдские диалекты", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "Цены", subtitle: "Начните бесплатно", free: { name: "Бесплатно", price: "$0", period: "/мес", description: "Для начала", features: ["5/день"], cta: "Начать" }, pro: { name: "Pro", price: "$9.99", period: "/мес", description: "Для профи", features: ["Безлимит"], cta: "Улучшить", badge: "Популярно" } },
    owner: { title: "Разработчик", subtitle: "Таха Сардар", description: "Создаю сайты и приложения.", cta: "Заказать", skills: "Full-Stack" },
    contact: { title: "Контакты", subtitle: "Вопросы?", whatsapp: "WhatsApp", telegram: "Telegram", email: "Email", instagram: "Instagram", snapchat: "Snapchat" },
    footer: { copyright: "© 2024 AIVision", tagline: "Многоязычная платформа" },
    dashboard: { title: "ИИ-генератор", credits: "Кредиты", remaining: "осталось", unlimited: "Безлимит", history: "История", noHistory: "Пусто", upgrade: "Улучшить", pro: "Pro", free: "Бесплатно", dailyLimit: "Лимит", placeholder: "Введите запрос...", send: "Отправить", clear: "Очистить" },
    checkout: { title: "Улучшить", subtitle: "$9.99/мес", back: "Назад", paymentDetails: "Детали", copyAddress: "Копировать", copied: "Скопировано", showQR: "QR", hideQR: "Скрыть", amount: "Сумма", monthly: "Ежемесячно", submitProof: "Чек", fullName: "Имя", email: "Email", transactionId: "ID", uploadReceipt: "Загрузить", dragDrop: "Перетащить", fileTypes: "PNG", submit: "Отправить", submitting: "Отправка...", important: "Важно", notes: ["1-24ч"], success: "Успешно", networks: { fib: "FIB", fastpay: "FastPay", usdt: "USDT" } }
  },
  ZH: {
    nav: { home: "首页", features: "功能", languages: "语言", pricing: "价格", contact: "联系", dashboard: "仪表板", tryFree: "免费试用" },
    hero: { title: "AI语言智能平台", subtitle: "12种语言的高级AI文本生成和翻译。", cta1: "免费开始", cta2: "演示", stats: { languages: "语言", accuracy: "准确率", speed: "速度" } },
    demo: { title: "体验强大功能", subtitle: "快速演示", placeholder: "输入文本...", generate: "生成", clear: "清除", result: "结果", copy: "复制", generating: "生成中...", tabs: { generate: "生成", rewrite: "重写", grammar: "语法", translate: "翻译" } },
    features: { title: "强大功能", subtitle: "多语言内容所需一切", items: [{ title: "文本生成", description: "高质量内容。" }, { title: "精确翻译", description: "库尔德方言专业。" }, { title: "语法完美", description: "高级纠正。" }, { title: "闪电速度", description: "Gemini驱动。" }, { title: "RTL支持", description: "从右到左。" }, { title: "智能重写", description: "提高清晰度。" }] },
    languages: { title: "支持12种语言", subtitle: "包括库尔德方言", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "简单定价", subtitle: "免费开始", free: { name: "免费", price: "$0", period: "/月", description: "适合入门", features: ["每天5次"], cta: "开始" }, pro: { name: "专业版", price: "$9.99", period: "/月", description: "适合专业人士", features: ["无限次"], cta: "升级", badge: "最受欢迎" } },
    owner: { title: "应用和网页开发者", subtitle: "塔哈·萨达尔", description: "以有竞争力的价格构建定制网站和应用。", cta: "订购", skills: "全栈开发者" },
    contact: { title: "联系我们", subtitle: "有问题吗？", whatsapp: "WhatsApp", telegram: "Telegram", email: "邮箱", instagram: "Instagram", snapchat: "Snapchat" },
    footer: { copyright: "© 2024 AIVision", tagline: "AI多语言平台" },
    dashboard: { title: "AI生成器", credits: "积分", remaining: "剩余", unlimited: "无限", history: "历史", noHistory: "无历史", upgrade: "升级", pro: "专业版", free: "免费", dailyLimit: "达上限", placeholder: "输入您的提示...", send: "发送", clear: "清除" },
    checkout: { title: "升级", subtitle: "$9.99/月", back: "返回", paymentDetails: "支付详情", copyAddress: "复制", copied: "已复制", showQR: "二维码", hideQR: "隐藏", amount: "金额", monthly: "每月", submitProof: "提交证明", fullName: "姓名", email: "邮箱", transactionId: "交易ID", uploadReceipt: "上传收据", dragDrop: "拖放", fileTypes: "PNG", submit: "提交", submitting: "提交中...", important: "重要", notes: ["1-24小时"], success: "成功", networks: { fib: "FIB", fastpay: "FastPay", usdt: "USDT" } }
  },
  HI: {
    nav: { home: "होम", features: "सुविधाएं", languages: "भाषाएं", pricing: "मूल्य", contact: "संपर्क", dashboard: "डैशबोर्ड", tryFree: "मुफ्त आज़माएं" },
    hero: { title: "AI भाषा प्लेटफॉर्म", subtitle: "12 भाषाओं में उन्नत पाठ निर्माण और अनुवाद।", cta1: "मुफ्त शुरू करें", cta2: "डेमो", stats: { languages: "भाषाएं", accuracy: "सटीकता", speed: "गति" } },
    demo: { title: "शक्ति का अनुभव करें", subtitle: "त्वरित डेमो", placeholder: "अपना पाठ दर्ज करें...", generate: "उत्पन्न करें", clear: "साफ करें", result: "परिणाम", copy: "कॉपी", generating: "उत्पन्न हो रहा है...", tabs: { generate: "उत्पन्न", rewrite: "पुनर्लेखन", grammar: "व्याकरण", translate: "अनुवाद" } },
    features: { title: "शक्तिशाली सुविधाएं", subtitle: "बहुभाषी सामग्री के लिए सब कुछ", items: [{ title: "पाठ निर्माण", description: "गुणवत्ता सामग्री।" }, { title: "सटीक अनुवाद", description: "कुर्द विशेषज्ञता।" }, { title: "व्याकरण", description: "उन्नत सुधार।" }, { title: "तेज़", description: "Gemini संचालित।" }, { title: "RTL", description: "दाएं से बाएं।" }, { title: "पुनर्लेखन", description: "स्पष्टता में सुधार।" }] },
    languages: { title: "12 भाषाएं", subtitle: "कुर्द बोलियां शामिल", rtl: "RTL", ltr: "LTR" },
    pricing: { title: "सरल मूल्य", subtitle: "मुफ्त शुरू करें", free: { name: "मुफ्त", price: "$0", period: "/माह", description: "शुरुआत के लिए", features: ["5/दिन"], cta: "शुरू करें" }, pro: { name: "प्रो", price: "$9.99", period: "/माह", description: "पेशेवरों के लिए", features: ["असीमित"], cta: "अपग्रेड", badge: "सबसे लोकप्रिय" } },
    owner: { title: "ऐप और वेब डेवलपर", subtitle: "ताहा सरदार", description: "प्रतिस्पर्धी कीमतों पर कस्टम वेबसाइट और ऐप।", cta: "ऑर्डर करें", skills: "फुल-स्टैक डेवलपर" },
    contact: { title: "संपर्क", subtitle: "प्रश्न?", whatsapp: "WhatsApp", telegram: "Telegram", email: "ईमेल", instagram: "Instagram", snapchat: "Snapchat" },
    footer: { copyright: "© 2024 AIVision", tagline: "AI बहुभाषी प्लेटफॉर्म" },
    dashboard: { title: "AI जनरेटर", credits: "क्रेडिट", remaining: "शेष", unlimited: "असीमित", history: "इतिहास", noHistory: "खाली", upgrade: "अपग्रेड", pro: "प्रो", free: "मुफ्त", dailyLimit: "सीमा", placeholder: "अपना प्रॉम्प्ट दर्ज करें...", send: "भेजें", clear: "साफ करें" },
    checkout: { title: "अपग्रेड", subtitle: "$9.99/माह", back: "वापस", paymentDetails: "भुगतान विवरण", copyAddress: "कॉपी", copied: "कॉपी किया", showQR: "QR", hideQR: "छुपाएं", amount: "राशि", monthly: "मासिक", submitProof: "प्रमाण", fullName: "नाम", email: "ईमेल", transactionId: "ID", uploadReceipt: "रसीद", dragDrop: "खींचें", fileTypes: "PNG", submit: "जमा करें", submitting: "जमा हो रहा...", important: "महत्वपूर्ण", notes: ["1-24 घंटे"], success: "सफल", networks: { fib: "FIB", fastpay: "FastPay", usdt: "USDT" } }
  }
};

export const languageMeta = {
  EN: { name: 'English', nativeName: 'English', flag: '🇬🇧', direction: 'ltr' },
  'KU-BD': { name: 'Kurdish Badini', nativeName: 'کوردی بادینی', flag: '🏴', direction: 'rtl' },
  'KU-SO': { name: 'Kurdish Sorani', nativeName: 'کوردی سۆرانی', flag: '🏴', direction: 'rtl' },
  AR: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  TR: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', direction: 'ltr' },
  FA: { name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', direction: 'rtl' },
  DE: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  FR: { name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' },
  ES: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr' },
  RU: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr' },
  ZH: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', direction: 'ltr' },
  HI: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr' }
};

const rtlLanguages = ['KU-BD', 'KU-SO', 'AR', 'FA'];

export function getTranslation(lang, keyPath) {
  if (!lang || !keyPath) return keyPath;
  const keys = keyPath.split('.');
  let value = translations[lang] || translations['EN'];
  for (const key of keys) {
    if (value && typeof value === 'object' && value[key] !== undefined) {
      value = value[key];
    } else {
      let fallback = translations['EN'];
      for (const k of keys) {
        if (fallback && typeof fallback === 'object' && fallback[k] !== undefined) fallback = fallback[k];
        else return keyPath;
      }
      return typeof fallback === 'string' ? fallback : keyPath;
    }
  }
  return typeof value === 'string' ? value : keyPath;
}

export function getDirection(lang) { return languageMeta[lang]?.direction || 'ltr'; }
export function isRTL(lang) { return rtlLanguages.includes(lang); }
export default translations;

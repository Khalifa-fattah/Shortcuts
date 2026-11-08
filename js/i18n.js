/**
 * Internationalization (i18n) Module
 * Supports English (default) and Arabic (العربية) with RTL support.
 */

const TRANSLATIONS = {
  en: {
    // App Header & Branding
    appTitle: "Shortcuts Master",
    appSubtitle: "Instant keyboard shortcuts for Windows, Office & Software",
    searchPlaceholder: "Search shortcuts, apps, or keys (e.g. Ctrl+C, snap, table)...",
    
    // Top Bar Actions
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    toggleTheme: "Toggle Theme",
    language: "Language",
    settings: "Settings",
    installApp: "Install App",

    // Home View
    allCategories: "All Applications",
    categorySystem: "System & OS",
    categoryOffice: "Office & Productivity",
    categoryBrowser: "Browsers",
    categoryDeveloper: "Developer Tools",
    categoryCustom: "Custom Apps",
    shortcutsCount: "{count} shortcuts",
    addAppBtn: "Add Application",
    generateWithAiBtn: "Generate with Gemini AI",
    noAppsFound: "No applications found matching your search.",
    
    // App Card
    openShortcuts: "View Shortcuts",
    editApp: "Edit Application",
    deleteApp: "Delete Application",
    confirmDeleteApp: "Are you sure you want to delete this application and all its shortcuts?",
    
    // App Detail View
    backToApps: "All Applications",
    searchInAppPlaceholder: "Search in {appName} (e.g. 'save', 'Ctrl', 'format')...",
    allShortcutsTab: "All Shortcuts",
    addShortcutBtn: "Add Shortcut",
    aiExpandBtn: "Generate More with AI",
    noShortcutsFound: "No shortcuts found in this category or search query.",
    copiedToast: "Copied: {keys}",
    editShortcut: "Edit Shortcut",
    deleteShortcut: "Delete Shortcut",
    confirmDeleteShortcut: "Are you sure you want to delete this shortcut?",

    // Modal - Add/Edit Application
    modalAddAppTitle: "Add New Application",
    modalEditAppTitle: "Edit Application",
    appNameLabel: "Application Name",
    appNamePlaceholder: "e.g. Adobe Premiere Pro, Notion, Blender",
    appCategoryLabel: "Category",
    appColorLabel: "Accent Color",
    appIconLabel: "Application Icon",
    appDescLabel: "Description (optional)",
    appDescPlaceholder: "Brief summary of the application...",
    saveBtn: "Save",
    cancelBtn: "Cancel",

    // Modal - Add/Edit Shortcut
    modalAddShortcutTitle: "Add New Shortcut",
    modalEditShortcutTitle: "Edit Shortcut",
    shortcutKeysLabel: "Key Combination",
    shortcutKeysPlaceholder: "e.g. Ctrl + Shift + P, Alt + F4",
    shortcutKeysHint: "Separate multiple keys with '+' (e.g. Ctrl + Shift + N)",
    shortcutActionLabel: "Action / Title",
    shortcutActionPlaceholder: "e.g. Command Palette, Snap Window Left",
    shortcutCategoryLabel: "Category / Function Group",
    shortcutCategoryPlaceholder: "e.g. Navigation, Editing, Formatting",
    shortcutDescLabel: "Detailed Explanation (optional)",
    shortcutDescPlaceholder: "Explain what happens when this shortcut is triggered...",

    // Modal - Gemini AI Generator
    aiModalTitle: "Generate Shortcuts with Gemini AI",
    aiModalSubtitle: "Enter any software name and Gemini will automatically generate all categorized keyboard shortcuts.",
    aiAppNameLabel: "Software / Tool Name",
    aiAppNamePlaceholder: "e.g. Photoshop, AutoCAD, Figma, Blender, Slack, IntelliJ IDEA...",
    aiCategoryLabel: "Software Category",
    aiPromptHint: "Gemini will detect functions, categories, and key combinations for Windows.",
    aiGenerateBtn: "Generate with Gemini",
    aiGenerating: "Contacting Gemini AI and extracting shortcuts...",
    aiPreviewTitle: "Generated Shortcuts Preview ({count} found):",
    aiImportBtn: "Import into Library",
    aiMissingKeyWarning: "Gemini API Key is missing. Please add your free Gemini API key in Settings first.",
    aiError: "Failed to generate shortcuts. Please verify your API key and network connection.",

    // Modal - Settings
    settingsTitle: "Application Settings",
    geminiSection: "Gemini AI Configuration",
    geminiKeyLabel: "Gemini API Key",
    geminiKeyPlaceholder: "AIzaSy...",
    geminiKeyHelp: "Get a free API key at Google AI Studio (aistudio.google.com). Saved locally in your browser.",
    geminiModelLabel: "Gemini Model",
    saveSettingsBtn: "Save Settings",
    settingsSavedToast: "Settings saved successfully!",

    // Google Drive Sync
    driveSection: "Google Drive Cloud Sync",
    driveClientIdLabel: "Google OAuth 2.0 Client ID",
    driveClientIdPlaceholder: "e.g. xxxxx.apps.googleusercontent.com",
    driveClientIdHelp: "Required for Google Drive backup. Created in Google Cloud Console with Drive API enabled.",
    driveStatusNotConnected: "Not connected to Google Drive",
    driveStatusConnected: "Connected to Google Drive ({email})",
    driveStatusSyncing: "Syncing with Google Drive...",
    driveLastSync: "Last synced: {time}",
    driveConnectBtn: "Connect Google Drive",
    driveBackupBtn: "Backup to Google Drive",
    driveRestoreBtn: "Restore from Google Drive",
    driveConfirmRestore: "Restoring from Google Drive will replace or merge your local database. Do you want to proceed?",
    driveSyncSuccess: "Google Drive backup completed successfully!",
    driveRestoreSuccess: "Successfully restored from Google Drive!",
    driveError: "Google Drive operation failed: {error}",

    // Local Backup & Reset
    backupSection: "Local Backup & Data Management",
    exportJsonBtn: "Export All Data (JSON)",
    importJsonBtn: "Import Data (JSON)",
    resetDbBtn: "Reset to Default Shortcuts",
    confirmResetDb: "Are you sure you want to reset all data? Any custom apps and shortcuts will be replaced by the defaults.",
    resetSuccessToast: "Database successfully reset to defaults.",
    importSuccessToast: "Data successfully imported!",

    // General Toasts
    savedSuccess: "Saved successfully!",
    deletedSuccess: "Deleted successfully!",
    validationError: "Please fill in all required fields."
  },

  ar: {
    // App Header & Branding
    appTitle: "سيد الاختصارات | Shortcuts Master",
    appSubtitle: "المرجع الشامل لاختصارات لوحة المفاتيح لويندوز وتطبيقات الأوفيس والبرامج",
    searchPlaceholder: "ابحث عن أي اختصار، تطبيق، أو مفتاح (مثل Ctrl+C، جدول، نافذة)...",
    
    // Top Bar Actions
    themeLight: "الوضع النهاري",
    themeDark: "الوضع الليلي",
    toggleTheme: "تبديل المظهر",
    language: "اللغة",
    settings: "الإعدادات",
    installApp: "تثبيت التطبيق",

    // Home View
    allCategories: "جميع التطبيقات",
    categorySystem: "النظام والويندوز",
    categoryOffice: "الأوفيس والإنتاجية",
    categoryBrowser: "متصفحات الويب",
    categoryDeveloper: "أدوات المطورين",
    categoryCustom: "تطبيقات مخصصة",
    shortcutsCount: "{count} اختصار",
    addAppBtn: "إضافة تطبيق يدوياً",
    generateWithAiBtn: "توليد تلقائي عبر Gemini AI",
    noAppsFound: "لم يتم العثور على أي تطبيق يطابق بحثك.",
    
    // App Card
    openShortcuts: "عرض الاختصارات",
    editApp: "تعديل التطبيق",
    deleteApp: "حذف التطبيق",
    confirmDeleteApp: "هل أنت متأكد من حذف هذا التطبيق وجميع الاختصارات التابعة له؟",
    
    // App Detail View
    backToApps: "الرجوع لكافة التطبيقات",
    searchInAppPlaceholder: "بحث داخل {appName} (مثلاً 'حفظ', 'Ctrl', 'تنسيق')...",
    allShortcutsTab: "كافة الاختصارات",
    addShortcutBtn: "إضافة اختصار",
    aiExpandBtn: "جلب المزيد عبر الذكاء الاصطناعي",
    noShortcutsFound: "لا توجد اختصارات في هذا التصنيف أو نتيجة للبحث.",
    copiedToast: "تم النسخ: {keys}",
    editShortcut: "تعديل الاختصار",
    deleteShortcut: "حذف الاختصار",
    confirmDeleteShortcut: "هل أنت متأكد من حذف هذا الاختصار؟",

    // Modal - Add/Edit Application
    modalAddAppTitle: "إضافة تطبيق جديد",
    modalEditAppTitle: "تعديل بيانات التطبيق",
    appNameLabel: "اسم التطبيق",
    appNamePlaceholder: "مثلاً: فوتوشوب، بلندر، سلاك، نوشن",
    appCategoryLabel: "التصنيف",
    appColorLabel: "لون التمييز",
    appIconLabel: "أيقونة التطبيق",
    appDescLabel: "نبذة عن التطبيق (اختياري)",
    appDescPlaceholder: "وصف موجز لوظيفة التطبيق...",
    saveBtn: "حفظ",
    cancelBtn: "إلغاء",

    // Modal - Add/Edit Shortcut
    modalAddShortcutTitle: "إضافة اختصار جديد",
    modalEditShortcutTitle: "تعديل الاختصار",
    shortcutKeysLabel: "مزيج المفاتيح",
    shortcutKeysPlaceholder: "مثلاً: Ctrl + Shift + P أو Alt + F4",
    shortcutKeysHint: "افصل بين المفاتيح بعلامة '+' (مثال: Ctrl + Shift + N)",
    shortcutActionLabel: "الوظيفة / العنوان",
    shortcutActionPlaceholder: "مثلاً: حفظ الملف، توسيط الفقرة، إغلاق اللسان",
    shortcutCategoryLabel: "التصنيف الوظيفي / المجموعة",
    shortcutCategoryPlaceholder: "مثلاً: التنقل، التنسيق، التحرير، النوافذ",
    shortcutDescLabel: "شرح تفصيلي (اختياري)",
    shortcutDescPlaceholder: "شرح إضافي لما يحدث عند الضغط على هذا الاختصار...",

    // Modal - Gemini AI Generator
    aiModalTitle: "توليد الاختصارات آلياً عبر Gemini AI",
    aiModalSubtitle: "اكتب اسم أي برنامج تريده، وسيقوم نموذج Gemini بجلب كافة اختصاراته مصنفة تلقائياً.",
    aiAppNameLabel: "اسم البرنامج أو الأداة",
    aiAppNamePlaceholder: "مثلاً: Adobe Photoshop, Figma, AutoCAD, Blender, Notion...",
    aiCategoryLabel: "تصنيف البرنامج",
    aiPromptHint: "سيقوم Gemini باستخراج الوظائف والمجموعات ومجموعات المفاتيح لنظام الويندوز بدقة.",
    aiGenerateBtn: "توليد عبر Gemini",
    aiGenerating: "جاري الاتصال بـ Gemini AI وتوليد قائمة الاختصارات...",
    aiPreviewTitle: "معاينة الاختصارات المولدة (تم العثور على {count} اختصار):",
    aiImportBtn: "استيراد وحفظ في المكتبة",
    aiMissingKeyWarning: "مفتاح Gemini API غير متوفر. يرجى إدخال مفتاحك المجاني في صفحة الإعدادات أولاً.",
    aiError: "تعذر توليد الاختصارات. يرجى التحقق من صحة مفتاح API والاتصال بالإنترنت.",

    // Modal - Settings
    settingsTitle: "إعدادات التطبيق والمزامنة",
    geminiSection: "إعدادات ذكاء Gemini الاصطناعي",
    geminiKeyLabel: "مفتاح Gemini API Key",
    geminiKeyPlaceholder: "AIzaSy...",
    geminiKeyHelp: "احصل على مفتاح مجاني من موقع Google AI Studio (aistudio.google.com). يحفظ محلياً في متصفحك.",
    geminiModelLabel: "موديل الذكاء الاصطناعي",
    saveSettingsBtn: "حفظ الإعدادات",
    settingsSavedToast: "تم حفظ الإعدادات بنجاح!",

    // Google Drive Sync
    driveSection: "المزامنة السحابية عبر Google Drive",
    driveClientIdLabel: "معرّف عميل Google (OAuth Client ID)",
    driveClientIdPlaceholder: "مثلاً: xxxxx.apps.googleusercontent.com",
    driveClientIdHelp: "مطلوب لتمكين المزامنة مع Google Drive. يُستخرج من Google Cloud Console مع تفعيل Google Drive API.",
    driveStatusNotConnected: "غير متصل بـ Google Drive",
    driveStatusConnected: "متصل بـ Google Drive ({email})",
    driveStatusSyncing: "جاري المزامنة مع Google Drive...",
    driveLastSync: "آخر مزامنة: {time}",
    driveConnectBtn: "تسجيل الدخول وربط Google Drive",
    driveBackupBtn: "نسخ احتياطي إلى Drive",
    driveRestoreBtn: "استعادة من Google Drive",
    driveConfirmRestore: "الاستعادة من السحابة ستدمج أو تستبدل البيانات المحلية. هل ترغب بالاستمرار؟",
    driveSyncSuccess: "تم حفظ النسخة الاحتياطية على Google Drive بنجاح!",
    driveRestoreSuccess: "تمت الاستعادة من Google Drive بنجاح!",
    driveError: "فشلت عملية المزامنة مع Google Drive: {error}",

    // Local Backup & Reset
    backupSection: "النسخ الاحتياطي المحلي وإدارة البيانات",
    exportJsonBtn: "تصدير جميع البيانات (ملف JSON)",
    importJsonBtn: "استيراد بيانات من ملف JSON",
    resetDbBtn: "استعادة الاختصارات الافتراضية",
    confirmResetDb: "هل أنت متأكد من رغبتك في إعادة تعيين قاعدة البيانات؟ سيتم استبدال التطبيقات المخصصة بالاختصارات الأصلية.",
    resetSuccessToast: "تمت استعادة البيانات الافتراضية بنجاح.",
    importSuccessToast: "تم استيراد البيانات بنجاح!",

    // General Toasts
    savedSuccess: "تم الحفظ بنجاح!",
    deletedSuccess: "تم الحذف بنجاح!",
    validationError: "يرجى تعبئة كافة الحقول المطلوبة."
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('shortcuts_lang') || 'en';
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      localStorage.setItem('shortcuts_lang', lang);
      this.apply();
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  }

  t(key, params = {}) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || key;
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return text;
  }

  apply() {
    const isAr = this.currentLang === 'ar';
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl-mode', isAr);

    // Update document title
    document.title = this.t('appTitle');

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });

    // Update placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', this.t(key));
    });

    // Update titles with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.setAttribute('title', this.t(key));
    });
  }
}

const i18n = new I18nManager();

if (typeof window !== 'undefined') {
  window.i18n = i18n;
  window.t = (key, params) => i18n.t(key, params);
}

/**
 * Default Seed Data for Shortcuts Master
 * Includes comprehensive keyboard shortcuts for Windows 11, Microsoft Excel,
 * Microsoft Word, Google Chrome, Visual Studio Code, and Windows Terminal.
 */

const DEFAULT_APPS = [
  {
    id: 'windows-11',
    name: 'Windows 11',
    nameAr: 'ويندوز 11',
    category: 'system',
    icon: 'windows',
    color: '#0078D4',
    description: 'Core Windows 11 operating system navigation, window snapping, desktops, and tools.',
    descriptionAr: 'اختصارات نظام التشغيل ويندوز 11 وإدارة النوافذ وسطح المكتب والأدوات العامة.'
  },
  {
    id: 'ms-excel',
    name: 'Microsoft Excel',
    nameAr: 'مايكروسوفت إكسل',
    category: 'office',
    icon: 'excel',
    color: '#107C41',
    description: 'Spreadsheet navigation, formulas, formatting, row & column manipulation.',
    descriptionAr: 'جداول البيانات والصيغ الحسابية وتنسيق الخلايا وإدارة الصفوف والأعمدة.'
  },
  {
    id: 'ms-word',
    name: 'Microsoft Word',
    nameAr: 'مايكروسوفت وورد',
    category: 'office',
    icon: 'word',
    color: '#2B579A',
    description: 'Document editing, formatting, alignment, paragraphs, and quick navigation.',
    descriptionAr: 'تحرير وتنسيق المستندات والفقرات والمحاذاة والتنقل السريع.'
  },
  {
    id: 'google-chrome',
    name: 'Google Chrome',
    nameAr: 'جوجل كروم',
    category: 'browser',
    icon: 'chrome',
    color: '#EA4335',
    description: 'Tab management, window controls, bookmarking, history, and developer tools.',
    descriptionAr: 'إدارة علامات التبويب والنوافذ والتصفح والمفضلة وأدوات المطورين.'
  },
  {
    id: 'vs-code',
    name: 'Visual Studio Code',
    nameAr: 'فيجوال ستوديو كود',
    category: 'developer',
    icon: 'vscode',
    color: '#007ACC',
    description: 'Code editing, multi-cursor, navigation, command palette, terminal, and debugging.',
    descriptionAr: 'تحرير الأكواد والمؤشرات المتعددة والتنقل ولوحة الأوامر والطرفية.'
  },
  {
    id: 'windows-terminal',
    name: 'Windows Terminal / PowerShell',
    nameAr: 'ويندوز تيرمينال / باور شيل',
    category: 'developer',
    icon: 'terminal',
    color: '#4D4D4D',
    description: 'Terminal tab management, pane splitting, command execution, and search.',
    descriptionAr: 'إدارة ألسنة الطرفية وتقسيم الشاشات والبحث وتنفيذ الأوامر.'
  }
];

const DEFAULT_SHORTCUTS = [
  // ===================== WINDOWS 11 =====================
  // Window Management
  {
    id: 'win-1',
    appId: 'windows-11',
    category: 'Window Management',
    categoryAr: 'إدارة النوافذ',
    keys: 'Win + Left / Right',
    action: 'Snap window left or right',
    actionAr: 'محاذاة النافذة إلى اليسار أو اليمين',
    description: 'Snaps the active window to the left or right half of the screen.'
  },
  {
    id: 'win-2',
    appId: 'windows-11',
    category: 'Window Management',
    categoryAr: 'إدارة النوافذ',
    keys: 'Win + Up',
    action: 'Maximize active window',
    actionAr: 'تكبير النافذة الحالية',
    description: 'Maximizes the current window to fill the entire display.'
  },
  {
    id: 'win-3',
    appId: 'windows-11',
    category: 'Window Management',
    categoryAr: 'إدارة النوافذ',
    keys: 'Win + Down',
    action: 'Minimize or restore window',
    actionAr: 'تصغير أو استعادة حجم النافذة',
    description: 'Restores the window size if maximized, or minimizes it if already normal.'
  },
  {
    id: 'win-4',
    appId: 'windows-11',
    category: 'Window Management',
    categoryAr: 'إدارة النوافذ',
    keys: 'Win + Z',
    action: 'Open Snap layouts menu',
    actionAr: 'فتح قائمة تخطيطات المحاذاة (Snap Layouts)',
    description: 'Displays the modern Windows 11 snap layout grid to organize multiple windows.'
  },
  {
    id: 'win-5',
    appId: 'windows-11',
    category: 'Window Management',
    categoryAr: 'إدارة النوافذ',
    keys: 'Win + D',
    action: 'Show / hide Desktop',
    actionAr: 'إظهار / إخفاء سطح المكتب',
    description: 'Minimizes all open windows to reveal the desktop; press again to restore.'
  },
  {
    id: 'win-6',
    appId: 'windows-11',
    category: 'Window Management',
    categoryAr: 'إدارة النوافذ',
    keys: 'Alt + Tab',
    action: 'Switch between open apps',
    actionAr: 'التبديل بين التطبيقات المفتوحة',
    description: 'Quickly cycle through active running applications.'
  },
  // System Tools & Settings
  {
    id: 'win-7',
    appId: 'windows-11',
    category: 'System & Tools',
    categoryAr: 'النظام والأدوات',
    keys: 'Win + I',
    action: 'Open Settings',
    actionAr: 'فتح إعدادات ويندوز',
    description: 'Instantly opens the Windows Settings app.'
  },
  {
    id: 'win-8',
    appId: 'windows-11',
    category: 'System & Tools',
    categoryAr: 'النظام والأدوات',
    keys: 'Win + E',
    action: 'Open File Explorer',
    actionAr: 'فتح مستكشف الملفات',
    description: 'Launches a new File Explorer window.'
  },
  {
    id: 'win-9',
    appId: 'windows-11',
    category: 'System & Tools',
    categoryAr: 'النظام والأدوات',
    keys: 'Ctrl + Shift + Esc',
    action: 'Open Task Manager directly',
    actionAr: 'فتح إدارة المهام مباشرة',
    description: 'Directly opens Task Manager without passing through the Ctrl+Alt+Del lock screen.'
  },
  {
    id: 'win-10',
    appId: 'windows-11',
    category: 'System & Tools',
    categoryAr: 'النظام والأدوات',
    keys: 'Win + L',
    action: 'Lock PC',
    actionAr: 'قفل شاشة الكمبيوتر',
    description: 'Locks your PC and protects your current desktop session.'
  },
  {
    id: 'win-11',
    appId: 'windows-11',
    category: 'System & Tools',
    categoryAr: 'النظام والأدوات',
    keys: 'Win + V',
    action: 'Open Clipboard history',
    actionAr: 'فتح سجل الحافظة',
    description: 'Shows recent copied texts, images, and pinned items.'
  },
  {
    id: 'win-12',
    appId: 'windows-11',
    category: 'System & Tools',
    categoryAr: 'النظام والأدوات',
    keys: 'Win + Shift + S',
    action: 'Take screen snippet / screenshot',
    actionAr: 'أخذ لقطة شاشة عبر أداة القصاصة',
    description: 'Opens Snipping Tool bar to capture rectangular, freeform, or full-screen screenshots.'
  },
  {
    id: 'win-13',
    appId: 'windows-11',
    category: 'System & Tools',
    categoryAr: 'النظام والأدوات',
    keys: 'Win + . (Period)',
    action: 'Open Emoji and Symbols picker',
    actionAr: 'فتح لوحة الرموز التعبيرية والإيموجي',
    description: 'Quickly insert emojis, GIFs, kaomoji, and special symbols anywhere.'
  },
  {
    id: 'win-14',
    appId: 'windows-11',
    category: 'Virtual Desktops',
    categoryAr: 'أسطح المكتب الافتراضية',
    keys: 'Win + Tab',
    action: 'Open Task View',
    actionAr: 'فتح عرض المهام (Task View)',
    description: 'Shows all active windows and virtual desktops.'
  },
  {
    id: 'win-15',
    appId: 'windows-11',
    category: 'Virtual Desktops',
    categoryAr: 'أسطح المكتب الافتراضية',
    keys: 'Win + Ctrl + D',
    action: 'Create new virtual desktop',
    actionAr: 'إنشاء سطح مكتب افتراضي جديد',
    description: 'Adds a new blank virtual desktop workspace.'
  },
  {
    id: 'win-16',
    appId: 'windows-11',
    category: 'Virtual Desktops',
    categoryAr: 'أسطح المكتب الافتراضية',
    keys: 'Win + Ctrl + Left / Right',
    action: 'Switch between virtual desktops',
    actionAr: 'التبديل بين أسطح المكتب الافتراضية',
    description: 'Flips smoothly between your created virtual desktop spaces.'
  },
  {
    id: 'win-17',
    appId: 'windows-11',
    category: 'Virtual Desktops',
    categoryAr: 'أسطح المكتب الافتراضية',
    keys: 'Win + Ctrl + F4',
    action: 'Close current virtual desktop',
    actionAr: 'إغلاق سطح المكتب الافتراضي الحالي',
    description: 'Closes the active virtual desktop and moves open windows to the left desktop.'
  },

  // ===================== MICROSOFT EXCEL =====================
  {
    id: 'xl-1',
    appId: 'ms-excel',
    category: 'Formulas & Calculations',
    categoryAr: 'الصيغ والحسابات',
    keys: 'Alt + =',
    action: 'AutoSum selected cells',
    actionAr: 'الجمع التلقائي للخلايا المحددة',
    description: 'Inserts the SUM formula automatically for the row or column of cells above/left.'
  },
  {
    id: 'xl-2',
    appId: 'ms-excel',
    category: 'Formulas & Calculations',
    categoryAr: 'الصيغ والحسابات',
    keys: 'F4',
    action: 'Toggle absolute/relative cell references ($A$1)',
    actionAr: 'تثبيت مرجع الخلية ($A$1) أو تكرار الإجراء',
    description: 'In formula bar: cycles $A$1, A$1, $A1, A1. In normal grid: repeats last action.'
  },
  {
    id: 'xl-3',
    appId: 'ms-excel',
    category: 'Formulas & Calculations',
    categoryAr: 'الصيغ والحسابات',
    keys: 'Ctrl + ` (Backquote)',
    action: 'Toggle show formulas / values',
    actionAr: 'التبديل بين إظهار الصيغ أو القيم',
    description: 'Switches the worksheet between displaying cell values and formulas.'
  },
  {
    id: 'xl-4',
    appId: 'ms-excel',
    category: 'Formulas & Calculations',
    categoryAr: 'الصيغ والحسابات',
    keys: 'Shift + F3',
    action: 'Insert Function dialog',
    actionAr: 'فتح نافذة إدراج دالة',
    description: 'Opens the Insert Function dialog box to search and build formulas.'
  },
  {
    id: 'xl-5',
    appId: 'ms-excel',
    category: 'Editing & Formatting',
    categoryAr: 'التحرير والتنسيق',
    keys: 'Ctrl + 1',
    action: 'Open Format Cells dialog',
    actionAr: 'فتح نافذة تنسيق الخلايا (Format Cells)',
    description: 'Opens full format options: Number, Alignment, Font, Border, Fill, Protection.'
  },
  {
    id: 'xl-6',
    appId: 'ms-excel',
    category: 'Editing & Formatting',
    categoryAr: 'التحرير والتنسيق',
    keys: 'Ctrl + T',
    action: 'Create table from selected data',
    actionAr: 'إنشاء جدول من البيانات المحددة',
    description: 'Converts selected range into an official Excel structured table with filter headers.'
  },
  {
    id: 'xl-7',
    appId: 'ms-excel',
    category: 'Editing & Formatting',
    categoryAr: 'التحرير والتنسيق',
    keys: 'Alt + Enter',
    action: 'Insert line break inside cell',
    actionAr: 'إدراج سطر جديد داخل نفس الخلية',
    description: 'Starts a new line within the same active cell while in edit mode.'
  },
  {
    id: 'xl-8',
    appId: 'ms-excel',
    category: 'Editing & Formatting',
    categoryAr: 'التحرير والتنسيق',
    keys: 'Ctrl + Shift + L',
    action: 'Toggle filters on / off',
    actionAr: 'تفعيل أو إلغاء عوامل التصفية (الفلتر)',
    description: 'Applies or removes AutoFilter dropdown arrows on headers.'
  },
  {
    id: 'xl-9',
    appId: 'ms-excel',
    category: 'Editing & Formatting',
    categoryAr: 'التحرير والتنسيق',
    keys: 'Ctrl + ; (Semicolon)',
    action: 'Insert current date',
    actionAr: 'إدراج التاريخ الحالي فوراً',
    description: 'Inserts today’s date into the selected cell.'
  },
  {
    id: 'xl-10',
    appId: 'ms-excel',
    category: 'Editing & Formatting',
    categoryAr: 'التحرير والتنسيق',
    keys: 'Ctrl + Shift + :',
    action: 'Insert current time',
    actionAr: 'إدراج الوقت الحالي فوراً',
    description: 'Inserts the current system time into the selected cell.'
  },
  {
    id: 'xl-11',
    appId: 'ms-excel',
    category: 'Navigation & Selection',
    categoryAr: 'التنقل والتحديد',
    keys: 'Ctrl + Arrow Keys',
    action: 'Jump to edge of data region',
    actionAr: 'القفز إلى حافة نطاق البيانات',
    description: 'Moves cursor quickly to the last non-empty cell in the arrow direction.'
  },
  {
    id: 'xl-12',
    appId: 'ms-excel',
    category: 'Navigation & Selection',
    categoryAr: 'التنقل والتحديد',
    keys: 'Ctrl + Shift + Arrow Keys',
    action: 'Select to edge of data region',
    actionAr: 'تحديد الخلايا حتى نهاية نطاق البيانات',
    description: 'Extends the cell selection to the last cell with data in that direction.'
  },
  {
    id: 'xl-13',
    appId: 'ms-excel',
    category: 'Navigation & Selection',
    categoryAr: 'التنقل والتحديد',
    keys: 'Shift + Space',
    action: 'Select entire row',
    actionAr: 'تحديد كامل الصف الحالي',
    description: 'Highlights the entire current row.'
  },
  {
    id: 'xl-14',
    appId: 'ms-excel',
    category: 'Navigation & Selection',
    categoryAr: 'التنقل والتحديد',
    keys: 'Ctrl + Space',
    action: 'Select entire column',
    actionAr: 'تحديد كامل العمود الحالي',
    description: 'Highlights the entire current column.'
  },
  {
    id: 'xl-15',
    appId: 'ms-excel',
    category: 'Navigation & Selection',
    categoryAr: 'التنقل والتحديد',
    keys: 'Ctrl + + (Plus)',
    action: 'Insert row or column dialog',
    actionAr: 'إدراج صفوف أو أعمدة أو خلايا جديدة',
    description: 'Opens insert dialog or inserts selected full row/column.'
  },
  {
    id: 'xl-16',
    appId: 'ms-excel',
    category: 'Navigation & Selection',
    categoryAr: 'التنقل والتحديد',
    keys: 'Ctrl + - (Minus)',
    action: 'Delete row or column dialog',
    actionAr: 'حذف صفوف أو أعمدة أو خلايا محددة',
    description: 'Deletes selected rows, columns, or opens delete cell shift dialog.'
  },

  // ===================== MICROSOFT WORD =====================
  {
    id: 'wd-1',
    appId: 'ms-word',
    category: 'Text Formatting',
    categoryAr: 'تنسيق النصوص',
    keys: 'Ctrl + B',
    action: 'Bold text',
    actionAr: 'تغميق الخط (عريض)',
    description: 'Applies or removes bold style to selected text.'
  },
  {
    id: 'wd-2',
    appId: 'ms-word',
    category: 'Text Formatting',
    categoryAr: 'تنسيق النصوص',
    keys: 'Ctrl + I',
    action: 'Italic text',
    actionAr: 'إمالة الخط',
    description: 'Applies or removes italic formatting.'
  },
  {
    id: 'wd-3',
    appId: 'ms-word',
    category: 'Text Formatting',
    categoryAr: 'تنسيق النصوص',
    keys: 'Ctrl + U',
    action: 'Underline text',
    actionAr: 'تسطير الخط',
    description: 'Underlines selected text.'
  },
  {
    id: 'wd-4',
    appId: 'ms-word',
    category: 'Text Formatting',
    categoryAr: 'تنسيق النصوص',
    keys: 'Ctrl + Shift + > / <',
    action: 'Increase / decrease font size',
    actionAr: 'تكبير أو تصغير حجم الخط',
    description: 'Increases or decreases font size by preset points.'
  },
  {
    id: 'wd-5',
    appId: 'ms-word',
    category: 'Text Formatting',
    categoryAr: 'تنسيق النصوص',
    keys: 'Ctrl + Space',
    action: 'Clear character formatting',
    actionAr: 'مسح التنسيق اليدوي والعودة للافتراضي',
    description: 'Resets selected text back to the default style of the current paragraph.'
  },
  {
    id: 'wd-6',
    appId: 'ms-word',
    category: 'Paragraph & Alignment',
    categoryAr: 'الفقرات والمحاذاة',
    keys: 'Ctrl + E',
    action: 'Center align paragraph',
    actionAr: 'توسيط الفقرة',
    description: 'Centers the current paragraph on the page.'
  },
  {
    id: 'wd-7',
    appId: 'ms-word',
    category: 'Paragraph & Alignment',
    categoryAr: 'الفقرات والمحاذاة',
    keys: 'Ctrl + L',
    action: 'Left align paragraph',
    actionAr: 'محاذاة الفقرة لليسار',
    description: 'Aligns the current paragraph to the left margin.'
  },
  {
    id: 'wd-8',
    appId: 'ms-word',
    category: 'Paragraph & Alignment',
    categoryAr: 'الفقرات والمحاذاة',
    keys: 'Ctrl + R',
    action: 'Right align paragraph',
    actionAr: 'محاذاة الفقرة لليمين',
    description: 'Aligns the current paragraph to the right margin.'
  },
  {
    id: 'wd-9',
    appId: 'ms-word',
    category: 'Paragraph & Alignment',
    categoryAr: 'الفقرات والمحاذاة',
    keys: 'Ctrl + J',
    action: 'Justify paragraph',
    actionAr: 'ضبط محاذاة الفقرة (Justify)',
    description: 'Justifies text evenly between left and right margins.'
  },
  {
    id: 'wd-10',
    appId: 'ms-word',
    category: 'Paragraph & Alignment',
    categoryAr: 'الفقرات والمحاذاة',
    keys: 'Ctrl + 1 / 2 / 5',
    action: 'Set line spacing (Single / Double / 1.5)',
    actionAr: 'ضبط تباعد الأسطر (مفرد / مزدوج / 1.5)',
    description: 'Sets line spacing: Ctrl+1 (single), Ctrl+2 (double), Ctrl+5 (1.5 lines).'
  },
  {
    id: 'wd-11',
    appId: 'ms-word',
    category: 'Document Navigation & Tools',
    categoryAr: 'أدوات المستند والتنقل',
    keys: 'Ctrl + Enter',
    action: 'Insert page break',
    actionAr: 'إدراج فاصل صفحات فوري',
    description: 'Forces document flow onto a new page immediately.'
  },
  {
    id: 'wd-12',
    appId: 'ms-word',
    category: 'Document Navigation & Tools',
    categoryAr: 'أدوات المستند والتنقل',
    keys: 'Ctrl + F',
    action: 'Open Navigation / Find pane',
    actionAr: 'فتح لوحة البحث والتنقل',
    description: 'Opens the search sidebar to find words, headings, or pages.'
  },
  {
    id: 'wd-13',
    appId: 'ms-word',
    category: 'Document Navigation & Tools',
    categoryAr: 'أدوات المستند والتنقل',
    keys: 'Ctrl + H',
    action: 'Find and Replace dialog',
    actionAr: 'نافذة البحث والاستبدال',
    description: 'Opens the Find and Replace dialog for batch word replacement.'
  },
  {
    id: 'wd-14',
    appId: 'ms-word',
    category: 'Document Navigation & Tools',
    categoryAr: 'أدوات المستند والتنقل',
    keys: 'F7',
    action: 'Check spelling and grammar',
    actionAr: 'التدقيق الإملائي والنحوي',
    description: 'Launches the Editor / Spelling & Grammar checker pane.'
  },

  // ===================== GOOGLE CHROME =====================
  {
    id: 'cr-1',
    appId: 'google-chrome',
    category: 'Tabs & Windows',
    categoryAr: 'الألسنة والنوافذ',
    keys: 'Ctrl + T',
    action: 'Open new tab',
    actionAr: 'فتح لسان جديد',
    description: 'Opens a new blank tab and places cursor in the omnibox address bar.'
  },
  {
    id: 'cr-2',
    appId: 'google-chrome',
    category: 'Tabs & Windows',
    categoryAr: 'الألسنة والنوافذ',
    keys: 'Ctrl + W',
    action: 'Close current tab',
    actionAr: 'إغلاق اللسان الحالي',
    description: 'Closes the actively focused tab.'
  },
  {
    id: 'cr-3',
    appId: 'google-chrome',
    category: 'Tabs & Windows',
    categoryAr: 'الألسنة والنوافذ',
    keys: 'Ctrl + Shift + T',
    action: 'Reopen last closed tab',
    actionAr: 'إعادة فتح آخر لسان مغلق',
    description: 'Restores the most recently closed tab or window in reverse order.'
  },
  {
    id: 'cr-4',
    appId: 'google-chrome',
    category: 'Tabs & Windows',
    categoryAr: 'الألسنة والنوافذ',
    keys: 'Ctrl + Tab / Ctrl + Shift + Tab',
    action: 'Cycle next / previous tab',
    actionAr: 'التنقل بين الألسنة للأمام / للخلف',
    description: 'Switches to the next or previous open browser tab.'
  },
  {
    id: 'cr-5',
    appId: 'google-chrome',
    category: 'Tabs & Windows',
    categoryAr: 'الألسنة والنوافذ',
    keys: 'Ctrl + 1 to 8 / Ctrl + 9',
    action: 'Jump to specific tab / last tab',
    actionAr: 'القفز إلى لسان محدد / اللسان الأخير',
    description: 'Pressing Ctrl + 1 jumps to the first tab; Ctrl + 9 jumps to the rightmost tab.'
  },
  {
    id: 'cr-6',
    appId: 'google-chrome',
    category: 'Tabs & Windows',
    categoryAr: 'الألسنة والنوافذ',
    keys: 'Ctrl + Shift + N',
    action: 'Open Incognito window',
    actionAr: 'فتح نافذة تصفح خفي جديدة',
    description: 'Opens a new private Incognito browsing session.'
  },
  {
    id: 'cr-7',
    appId: 'google-chrome',
    category: 'Navigation & Features',
    categoryAr: 'التصفح والمميزات',
    keys: 'Ctrl + L / Alt + D',
    action: 'Focus address bar (Omnibox)',
    actionAr: 'التركيز على شريط العناوين والبحث',
    description: 'Highlights the entire URL bar text ready for a new URL or search query.'
  },
  {
    id: 'cr-8',
    appId: 'google-chrome',
    category: 'Navigation & Features',
    categoryAr: 'التصفح والمميزات',
    keys: 'Ctrl + D',
    action: 'Bookmark current page',
    actionAr: 'حفظ الصفحة في المفضلة (إشارة مرجعية)',
    description: 'Saves the current webpage to bookmarks folder.'
  },
  {
    id: 'cr-9',
    appId: 'google-chrome',
    category: 'Navigation & Features',
    categoryAr: 'التصفح والمميزات',
    keys: 'Ctrl + Shift + B',
    action: 'Show / hide Bookmarks bar',
    actionAr: 'إظهار أو إخفاء شريط الإشارات المرجعية',
    description: 'Toggles the visible bookmarks bar below the address bar.'
  },
  {
    id: 'cr-10',
    appId: 'google-chrome',
    category: 'Navigation & Features',
    categoryAr: 'التصفح والمميزات',
    keys: 'Ctrl + H',
    action: 'Open History page',
    actionAr: 'فتح سجل التصفح (History)',
    description: 'Opens Chrome browsing history in a new tab.'
  },
  {
    id: 'cr-11',
    appId: 'google-chrome',
    category: 'Navigation & Features',
    categoryAr: 'التصفح والمميزات',
    keys: 'Ctrl + J',
    action: 'Open Downloads page',
    actionAr: 'فتح صفحة التنزيلات',
    description: 'Opens the download manager tab.'
  },
  {
    id: 'cr-12',
    appId: 'google-chrome',
    category: 'Navigation & Features',
    categoryAr: 'التصفح والمميزات',
    keys: 'Ctrl + Shift + Delete',
    action: 'Open Clear Browsing Data dialog',
    actionAr: 'فتح نافذة مسح بيانات التصفح والكوكيز',
    description: 'Directly opens the dialog to clear cache, cookies, and history.'
  },
  {
    id: 'cr-13',
    appId: 'google-chrome',
    category: 'Developer Tools',
    categoryAr: 'أدوات المطورين',
    keys: 'F12 / Ctrl + Shift + I',
    action: 'Open Developer Tools',
    actionAr: 'فتح أدوات المطورين (DevTools)',
    description: 'Opens Chrome DevTools console, elements inspector, network, etc.'
  },
  {
    id: 'cr-14',
    appId: 'google-chrome',
    category: 'Developer Tools',
    categoryAr: 'أدوات المطورين',
    keys: 'Ctrl + Shift + C',
    action: 'Inspect element directly',
    actionAr: 'فحص العنصر مباشرة في الصفحة',
    description: 'Toggles element inspection mode to click and inspect DOM elements.'
  },

  // ===================== VISUAL STUDIO CODE =====================
  {
    id: 'vs-1',
    appId: 'vs-code',
    category: 'Command Palette & General',
    categoryAr: 'لوحة الأوامر والإعدادات',
    keys: 'Ctrl + Shift + P / F1',
    action: 'Open Command Palette',
    actionAr: 'فتح لوحة الأوامر (Command Palette)',
    description: 'Opens the quick command menu to run any VS Code command or extension.'
  },
  {
    id: 'vs-2',
    appId: 'vs-code',
    category: 'Command Palette & General',
    categoryAr: 'لوحة الأوامر والإعدادات',
    keys: 'Ctrl + P',
    action: 'Quick Open file',
    actionAr: 'فتح سريع للملفات بالاسم',
    description: 'Instantly search and open any project file by typing its name.'
  },
  {
    id: 'vs-3',
    appId: 'vs-code',
    category: 'Command Palette & General',
    categoryAr: 'لوحة الأوامر والإعدادات',
    keys: 'Ctrl + B',
    action: 'Toggle Primary Sidebar',
    actionAr: 'إظهار / إخفاء الشريط الجانبي الأساسي',
    description: 'Hides or shows the file explorer sidebar to maximize editor space.'
  },
  {
    id: 'vs-4',
    appId: 'vs-code',
    category: 'Command Palette & General',
    categoryAr: 'لوحة الأوامر والإعدادات',
    keys: 'Ctrl + ` (Backquote)',
    action: 'Toggle integrated terminal',
    actionAr: 'إظهار / إخفاء الطرفية المدمجة (Terminal)',
    description: 'Opens or minimizes the bottom terminal panel.'
  },
  {
    id: 'vs-5',
    appId: 'vs-code',
    category: 'Editing & Multi-cursor',
    categoryAr: 'التحرير والمؤشرات المتعددة',
    keys: 'Alt + Up / Down',
    action: 'Move line up / down',
    actionAr: 'تحريك السطر لأعلى أو لأسفل',
    description: 'Transposes the current line or selection up or down.'
  },
  {
    id: 'vs-6',
    appId: 'vs-code',
    category: 'Editing & Multi-cursor',
    categoryAr: 'التحرير والمؤشرات المتعددة',
    keys: 'Shift + Alt + Up / Down',
    action: 'Duplicate line up / down',
    actionAr: 'تكرار السطر لأعلى أو لأسفل',
    description: 'Copies current line and inserts it immediately above or below.'
  },
  {
    id: 'vs-7',
    appId: 'vs-code',
    category: 'Editing & Multi-cursor',
    categoryAr: 'التحرير والمؤشرات المتعددة',
    keys: 'Ctrl + D',
    action: 'Add selection to next match',
    actionAr: 'تحديد الكلمة المطابقة التالية بمؤشر إضافي',
    description: 'Selects the next occurrence of current word with an active multi-cursor.'
  },
  {
    id: 'vs-8',
    appId: 'vs-code',
    category: 'Editing & Multi-cursor',
    categoryAr: 'التحرير والمؤشرات المتعددة',
    keys: 'Ctrl + /',
    action: 'Toggle line comment',
    actionAr: 'تعليق / إلغاء تعليق السطر البرمجي',
    description: 'Comments or uncomments the current line or selection in the current syntax.'
  },
  {
    id: 'vs-9',
    appId: 'vs-code',
    category: 'Editing & Multi-cursor',
    categoryAr: 'التحرير والمؤشرات المتعددة',
    keys: 'Shift + Alt + F',
    action: 'Format Document',
    actionAr: 'تنسيق كامل كود المستند (Prettier/Default)',
    description: 'Beautifies and formats code according to active formatter settings.'
  },
  {
    id: 'vs-10',
    appId: 'vs-code',
    category: 'Code Navigation',
    categoryAr: 'التنقل البرمجي',
    keys: 'F12',
    action: 'Go to Definition',
    actionAr: 'الذهاب إلى تعريف الدالة أو المتغير',
    description: 'Jumps directly to the declaration/definition of the hovered symbol.'
  },
  {
    id: 'vs-11',
    appId: 'vs-code',
    category: 'Code Navigation',
    categoryAr: 'التنقل البرمجي',
    keys: 'Alt + F12',
    action: 'Peek Definition',
    actionAr: 'نظرة خاطفة على التعريف بدون مغادرة الملف',
    description: 'Opens an inline popup window showing the definition.'
  },
  {
    id: 'vs-12',
    appId: 'vs-code',
    category: 'Code Navigation',
    categoryAr: 'التنقل البرمجي',
    keys: 'F2',
    action: 'Rename Symbol',
    actionAr: 'إعادة تسمية الرمز عبر كامل المشروع',
    description: 'Safely refactors and renames the variable/function everywhere.'
  },

  // ===================== WINDOWS TERMINAL =====================
  {
    id: 'wt-1',
    appId: 'windows-terminal',
    category: 'Tabs & Panes',
    categoryAr: 'الألسنة والتقسيم',
    keys: 'Ctrl + Shift + T',
    action: 'Open new tab',
    actionAr: 'فتح لسان جديد بالملف الافتراضي',
    description: 'Opens a new tab running the default profile shell.'
  },
  {
    id: 'wt-2',
    appId: 'windows-terminal',
    category: 'Tabs & Panes',
    categoryAr: 'الألسنة والتقسيم',
    keys: 'Ctrl + Shift + W',
    action: 'Close active pane or tab',
    actionAr: 'إغلاق اللسان أو اللوحة الحالية',
    description: 'Closes the current pane or entire tab.'
  },
  {
    id: 'wt-3',
    appId: 'windows-terminal',
    category: 'Tabs & Panes',
    categoryAr: 'الألسنة والتقسيم',
    keys: 'Alt + Shift + D',
    action: 'Duplicate pane (auto split)',
    actionAr: 'تقسيم الشاشة تلقائياً للطرفية',
    description: 'Splits the active pane in half running the same profile.'
  },
  {
    id: 'wt-4',
    appId: 'windows-terminal',
    category: 'Tabs & Panes',
    categoryAr: 'الألسنة والتقسيم',
    keys: 'Alt + Shift + - (Minus)',
    action: 'Split pane horizontally',
    actionAr: 'تقسيم الشاشة أفقياً',
    description: 'Splits pane horizontally into top and bottom halves.'
  },
  {
    id: 'wt-5',
    appId: 'windows-terminal',
    category: 'Tabs & Panes',
    categoryAr: 'الألسنة والتقسيم',
    keys: 'Alt + Shift + + (Plus)',
    action: 'Split pane vertically',
    actionAr: 'تقسيم الشاشة رأسياً',
    description: 'Splits pane vertically into left and right halves.'
  },
  {
    id: 'wt-6',
    appId: 'windows-terminal',
    category: 'Tabs & Panes',
    categoryAr: 'الألسنة والتقسيم',
    keys: 'Alt + Arrow Keys',
    action: 'Move focus between split panes',
    actionAr: 'التنقل بين الشاشات المقسمة بالأسهم',
    description: 'Changes active keyboard focus to adjacent split pane.'
  },
  {
    id: 'wt-7',
    appId: 'windows-terminal',
    category: 'Terminal Controls',
    categoryAr: 'أدوات التحكم والبحث',
    keys: 'Ctrl + Shift + F',
    action: 'Find in terminal buffer',
    actionAr: 'البحث في مخرجات الطرفية',
    description: 'Opens terminal search box to search output history.'
  },
  {
    id: 'wt-8',
    appId: 'windows-terminal',
    category: 'Terminal Controls',
    categoryAr: 'أدوات التحكم والبحث',
    keys: 'Ctrl + Shift + C / Ctrl + C',
    action: 'Copy selected text or break process',
    actionAr: 'نسخ النص المحدد أو إيقاف الأمر',
    description: 'Copies selection if text highlighted, or sends SIGINT interrupt if none.'
  },
  {
    id: 'wt-9',
    appId: 'windows-terminal',
    category: 'Terminal Controls',
    categoryAr: 'أدوات التحكم والبحث',
    keys: 'Ctrl + Shift + V / Ctrl + V',
    action: 'Paste from clipboard',
    actionAr: 'لصق من الحافظة',
    description: 'Pastes clipboard content directly into the terminal command line.'
  },
  {
    id: 'wt-10',
    appId: 'windows-terminal',
    category: 'Terminal Controls',
    categoryAr: 'أدوات التحكم والبحث',
    keys: 'Ctrl + + / Ctrl + -',
    action: 'Zoom font size in / out',
    actionAr: 'تكبير أو تصغير حجم خط الطرفية',
    description: 'Adjusts console text size dynamically.'
  }
];

if (typeof window !== 'undefined') {
  window.DEFAULT_APPS = DEFAULT_APPS;
  window.DEFAULT_SHORTCUTS = DEFAULT_SHORTCUTS;
}

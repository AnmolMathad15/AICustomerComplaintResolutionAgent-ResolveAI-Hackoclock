export type LanguageCode = "en" | "hi" | "kn" | "ta" | "te" | "es" | "fr";

export interface LanguageMeta {
  code: LanguageCode;
  label: string;
  short: string;
  flag: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", short: "HI", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ", short: "KN", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ்", short: "TA", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", short: "TE", flag: "🇮🇳" },
  { code: "es", label: "Español", short: "ES", flag: "🇪🇸" },
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
];

export type TranslationKey =
  | "sidebar.operations"
  | "sidebar.dashboard"
  | "sidebar.chat"
  | "sidebar.analyze"
  | "sidebar.complaints"
  | "sidebar.customers"
  | "sidebar.settings"
  | "header.notifications"
  | "header.role"
  | "dashboard.title"
  | "dashboard.subtitle"
  | "dashboard.totalComplaints"
  | "dashboard.aiResolved"
  | "dashboard.escalated"
  | "dashboard.avgConfidence"
  | "dashboard.activeVolume"
  | "dashboard.resolutionRate"
  | "dashboard.requiresHuman"
  | "dashboard.acrossModels"
  | "dashboard.sentimentTrend"
  | "dashboard.complaintsByCategory"
  | "dashboard.activityFeed"
  | "dashboard.noActivity"
  | "chat.title"
  | "chat.subtitle"
  | "chat.placeholder"
  | "chat.placeholderNoCustomer"
  | "chat.analyzing"
  | "chat.selectCustomer"
  | "chat.aiAssistantTitle"
  | "chat.aiAssistantHint"
  | "chat.copyResolution"
  | "chat.copied"
  | "complaints.title"
  | "complaints.subtitle"
  | "complaints.search"
  | "complaints.filterAll"
  | "complaints.filterAiResolved"
  | "complaints.filterEscalated"
  | "complaints.filterPending"
  | "complaints.export"
  | "complaints.empty"
  | "complaints.aiConfidence"
  | "complaints.status"
  | "complaints.sentimentSuffix"
  | "customers.title"
  | "customers.subtitle"
  | "customers.search"
  | "customers.viewProfile"
  | "customers.openTickets"
  | "customers.totalTickets"
  | "customers.joined"
  | "badges.high"
  | "badges.medium"
  | "badges.low"
  | "badges.resolved"
  | "badges.escalated"
  | "badges.pending"
  | "splash.tagline"
  | "splash.enter"
  | "common.loading"
  | "common.error"
  | "common.retry";

type Dict = Record<TranslationKey, string>;

const en: Dict = {
  "sidebar.operations": "Operations",
  "sidebar.dashboard": "Dashboard",
  "sidebar.chat": "Chat AI",
  "sidebar.analyze": "Analyze AI",
  "sidebar.complaints": "Complaints",
  "sidebar.customers": "Customers",
  "sidebar.settings": "Settings",
  "header.notifications": "Notifications",
  "header.role": "Support Lead",
  "dashboard.title": "Command Center",
  "dashboard.subtitle": "Real-time overview of complaint resolution operations.",
  "dashboard.totalComplaints": "Total Complaints Today",
  "dashboard.aiResolved": "AI Resolved",
  "dashboard.escalated": "Escalated",
  "dashboard.avgConfidence": "Avg AI Confidence",
  "dashboard.activeVolume": "Active volume",
  "dashboard.resolutionRate": "resolution rate",
  "dashboard.requiresHuman": "Requires human agent",
  "dashboard.acrossModels": "Across all models",
  "dashboard.sentimentTrend": "Sentiment Trend",
  "dashboard.complaintsByCategory": "Complaints by Category",
  "dashboard.activityFeed": "Activity Feed",
  "dashboard.noActivity": "No recent activity yet.",
  "chat.title": "Chat AI",
  "chat.subtitle": "Submit complaints conversationally and get real-time AI analysis.",
  "chat.placeholder": "Describe the customer's complaint... (Enter to send, Shift+Enter for newline)",
  "chat.placeholderNoCustomer": "Select a customer first...",
  "chat.analyzing": "Analyzing complaint...",
  "chat.selectCustomer": "Select a customer to begin...",
  "chat.aiAssistantTitle": "AI Complaint Assistant",
  "chat.aiAssistantHint": "Select a customer above and type a complaint to get instant AI analysis, resolution, and escalation assessment.",
  "chat.copyResolution": "Copy resolution",
  "chat.copied": "Copied!",
  "complaints.title": "Complaint Log",
  "complaints.subtitle": "Review AI analyses and escalation statuses.",
  "complaints.search": "Search by customer, ticket, or type...",
  "complaints.filterAll": "All",
  "complaints.filterAiResolved": "AI Resolved",
  "complaints.filterEscalated": "Escalated",
  "complaints.filterPending": "Pending",
  "complaints.export": "Export CSV",
  "complaints.empty": "No complaints found matching your search.",
  "complaints.aiConfidence": "AI Confidence:",
  "complaints.status": "Status",
  "complaints.sentimentSuffix": "Sentiment",
  "customers.title": "Customers",
  "customers.subtitle": "Browse customers and view their complaint history.",
  "customers.search": "Search customers...",
  "customers.viewProfile": "View profile",
  "customers.openTickets": "Open tickets",
  "customers.totalTickets": "Total tickets",
  "customers.joined": "Joined",
  "badges.high": "HIGH",
  "badges.medium": "MEDIUM",
  "badges.low": "LOW",
  "badges.resolved": "AI Resolved",
  "badges.escalated": "Escalated",
  "badges.pending": "Needs Escalation",
  "splash.tagline": "Where AI Meets Real Customer Care",
  "splash.enter": "Enter Dashboard",
  "common.loading": "Loading...",
  "common.error": "Something went wrong",
  "common.retry": "Retry",
};

// Helper: build translation dictionary by overriding English defaults.
const T = (overrides: Partial<Dict>): Dict => ({ ...en, ...overrides });

const hi: Dict = T({
  "sidebar.operations": "संचालन",
  "sidebar.dashboard": "डैशबोर्ड",
  "sidebar.chat": "एआई चैट",
  "sidebar.analyze": "एआई विश्लेषण",
  "sidebar.complaints": "शिकायतें",
  "sidebar.customers": "ग्राहक",
  "sidebar.settings": "सेटिंग्स",
  "header.notifications": "सूचनाएं",
  "header.role": "सहायता प्रमुख",
  "dashboard.title": "कमांड सेंटर",
  "dashboard.subtitle": "शिकायत समाधान संचालन का रीयल-टाइम अवलोकन।",
  "dashboard.totalComplaints": "आज की कुल शिकायतें",
  "dashboard.aiResolved": "एआई द्वारा हल",
  "dashboard.escalated": "एस्केलेट किया गया",
  "dashboard.avgConfidence": "औसत एआई आत्मविश्वास",
  "dashboard.activeVolume": "सक्रिय मात्रा",
  "dashboard.resolutionRate": "समाधान दर",
  "dashboard.requiresHuman": "मानव एजेंट आवश्यक",
  "dashboard.acrossModels": "सभी मॉडलों में",
  "dashboard.sentimentTrend": "भावना रुझान",
  "dashboard.complaintsByCategory": "श्रेणी अनुसार शिकायतें",
  "dashboard.activityFeed": "गतिविधि फ़ीड",
  "chat.title": "एआई चैट",
  "chat.subtitle": "बातचीत में शिकायतें भेजें और तुरंत एआई विश्लेषण पाएं।",
  "chat.selectCustomer": "शुरू करने के लिए ग्राहक चुनें...",
  "splash.tagline": "जहाँ एआई असली ग्राहक सेवा से मिलता है",
  "splash.enter": "डैशबोर्ड में प्रवेश करें",
  "complaints.title": "शिकायत लॉग",
  "customers.title": "ग्राहक",
});

const kn: Dict = T({
  "sidebar.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  "sidebar.chat": "ಎಐ ಚಾಟ್",
  "sidebar.analyze": "ಎಐ ವಿಶ್ಲೇಷಣೆ",
  "sidebar.complaints": "ದೂರುಗಳು",
  "sidebar.customers": "ಗ್ರಾಹಕರು",
  "sidebar.settings": "ಸೆಟ್ಟಿಂಗ್ಸ್",
  "dashboard.title": "ಕಮಾಂಡ್ ಸೆಂಟರ್",
  "dashboard.subtitle": "ದೂರು ಪರಿಹಾರ ಕಾರ್ಯಾಚರಣೆಯ ರಿಯಲ್-ಟೈಮ್ ಅವಲೋಕನ.",
  "splash.tagline": "ಎಐ ನಿಜವಾದ ಗ್ರಾಹಕ ಸೇವೆಯನ್ನು ಭೇಟಿಯಾಗುವಲ್ಲಿ",
  "splash.enter": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಿ",
});

const ta: Dict = T({
  "sidebar.dashboard": "டாஷ்போர்டு",
  "sidebar.chat": "AI அரட்டை",
  "sidebar.analyze": "AI பகுப்பாய்வு",
  "sidebar.complaints": "புகார்கள்",
  "sidebar.customers": "வாடிக்கையாளர்கள்",
  "sidebar.settings": "அமைப்புகள்",
  "dashboard.title": "கட்டளை மையம்",
  "dashboard.subtitle": "புகார் தீர்வு செயல்பாடுகளின் நேரடி கண்ணோட்டம்.",
  "splash.tagline": "AI உண்மையான வாடிக்கையாளர் சேவையை சந்திக்கும் இடம்",
  "splash.enter": "டாஷ்போர்டில் நுழைக",
});

const te: Dict = T({
  "sidebar.dashboard": "డాష్‌బోర్డ్",
  "sidebar.chat": "AI చాట్",
  "sidebar.analyze": "AI విశ్లేషణ",
  "sidebar.complaints": "ఫిర్యాదులు",
  "sidebar.customers": "కస్టమర్లు",
  "sidebar.settings": "సెట్టింగ్‌లు",
  "dashboard.title": "కమాండ్ సెంటర్",
  "dashboard.subtitle": "ఫిర్యాదు పరిష్కార కార్యకలాపాల రియల్-టైమ్ స్థూలదృష్టి.",
  "splash.tagline": "AI నిజమైన కస్టమర్ కేర్‌ని కలుసుకునే చోటు",
  "splash.enter": "డాష్‌బోర్డ్‌లోకి ప్రవేశించండి",
});

const es: Dict = T({
  "sidebar.operations": "Operaciones",
  "sidebar.dashboard": "Panel",
  "sidebar.chat": "Chat IA",
  "sidebar.analyze": "Analizar IA",
  "sidebar.complaints": "Quejas",
  "sidebar.customers": "Clientes",
  "sidebar.settings": "Ajustes",
  "header.notifications": "Notificaciones",
  "header.role": "Líder de Soporte",
  "dashboard.title": "Centro de Mando",
  "dashboard.subtitle": "Visión en tiempo real de las operaciones de resolución de quejas.",
  "dashboard.totalComplaints": "Quejas totales hoy",
  "dashboard.aiResolved": "Resueltas por IA",
  "dashboard.escalated": "Escaladas",
  "dashboard.avgConfidence": "Confianza media IA",
  "dashboard.activeVolume": "Volumen activo",
  "dashboard.resolutionRate": "tasa de resolución",
  "dashboard.requiresHuman": "Requiere agente humano",
  "dashboard.acrossModels": "En todos los modelos",
  "dashboard.sentimentTrend": "Tendencia de sentimiento",
  "dashboard.complaintsByCategory": "Quejas por categoría",
  "dashboard.activityFeed": "Actividad reciente",
  "dashboard.noActivity": "Aún no hay actividad reciente.",
  "chat.title": "Chat IA",
  "chat.subtitle": "Envía quejas conversacionalmente y obtén análisis IA en tiempo real.",
  "chat.placeholder": "Describe la queja del cliente... (Enter para enviar, Shift+Enter nueva línea)",
  "chat.placeholderNoCustomer": "Selecciona un cliente primero...",
  "chat.analyzing": "Analizando queja...",
  "chat.selectCustomer": "Selecciona un cliente para empezar...",
  "chat.aiAssistantTitle": "Asistente IA de Quejas",
  "chat.aiAssistantHint": "Selecciona un cliente arriba y escribe una queja para obtener análisis IA al instante.",
  "chat.copyResolution": "Copiar resolución",
  "chat.copied": "¡Copiado!",
  "complaints.title": "Registro de Quejas",
  "complaints.subtitle": "Revisa los análisis IA y estados de escalamiento.",
  "complaints.search": "Buscar por cliente, ticket o tipo...",
  "complaints.filterAll": "Todas",
  "complaints.filterAiResolved": "Resueltas IA",
  "complaints.filterEscalated": "Escaladas",
  "complaints.filterPending": "Pendientes",
  "complaints.export": "Exportar CSV",
  "complaints.empty": "No se encontraron quejas.",
  "complaints.aiConfidence": "Confianza IA:",
  "complaints.status": "Estado",
  "complaints.sentimentSuffix": "Sentimiento",
  "customers.title": "Clientes",
  "customers.subtitle": "Explora clientes y revisa su historial de quejas.",
  "customers.search": "Buscar clientes...",
  "customers.viewProfile": "Ver perfil",
  "customers.openTickets": "Tickets abiertos",
  "customers.totalTickets": "Tickets totales",
  "customers.joined": "Se unió",
  "badges.resolved": "Resuelto IA",
  "badges.escalated": "Escalado",
  "badges.pending": "Necesita escalar",
  "splash.tagline": "Donde la IA se encuentra con el cuidado real del cliente",
  "splash.enter": "Entrar al panel",
});

const fr: Dict = T({
  "sidebar.operations": "Opérations",
  "sidebar.dashboard": "Tableau de bord",
  "sidebar.chat": "Chat IA",
  "sidebar.analyze": "Analyse IA",
  "sidebar.complaints": "Plaintes",
  "sidebar.customers": "Clients",
  "sidebar.settings": "Paramètres",
  "header.notifications": "Notifications",
  "header.role": "Responsable Support",
  "dashboard.title": "Centre de Commande",
  "dashboard.subtitle": "Vue en temps réel des opérations de résolution des plaintes.",
  "dashboard.totalComplaints": "Plaintes du jour",
  "dashboard.aiResolved": "Résolues par IA",
  "dashboard.escalated": "Escaladées",
  "dashboard.avgConfidence": "Confiance moyenne IA",
  "dashboard.activeVolume": "Volume actif",
  "dashboard.resolutionRate": "taux de résolution",
  "dashboard.requiresHuman": "Agent humain requis",
  "dashboard.acrossModels": "Tous modèles confondus",
  "dashboard.sentimentTrend": "Tendance du sentiment",
  "dashboard.complaintsByCategory": "Plaintes par catégorie",
  "dashboard.activityFeed": "Flux d'activité",
  "dashboard.noActivity": "Aucune activité récente.",
  "chat.title": "Chat IA",
  "chat.subtitle": "Soumettez des plaintes en conversation et obtenez une analyse IA instantanée.",
  "chat.placeholder": "Décrivez la plainte du client... (Entrée pour envoyer, Shift+Entrée nouvelle ligne)",
  "chat.placeholderNoCustomer": "Sélectionnez d'abord un client...",
  "chat.analyzing": "Analyse de la plainte...",
  "chat.selectCustomer": "Sélectionnez un client pour commencer...",
  "chat.aiAssistantTitle": "Assistant IA des Plaintes",
  "chat.aiAssistantHint": "Sélectionnez un client puis tapez une plainte pour obtenir une analyse instantanée.",
  "chat.copyResolution": "Copier la résolution",
  "chat.copied": "Copié !",
  "complaints.title": "Journal des plaintes",
  "complaints.subtitle": "Examinez les analyses IA et statuts d'escalade.",
  "complaints.search": "Rechercher par client, ticket ou type...",
  "complaints.filterAll": "Toutes",
  "complaints.filterAiResolved": "Résolues IA",
  "complaints.filterEscalated": "Escaladées",
  "complaints.filterPending": "En attente",
  "complaints.export": "Exporter CSV",
  "complaints.empty": "Aucune plainte trouvée.",
  "complaints.aiConfidence": "Confiance IA :",
  "complaints.status": "Statut",
  "complaints.sentimentSuffix": "Sentiment",
  "customers.title": "Clients",
  "customers.subtitle": "Parcourez les clients et leur historique de plaintes.",
  "customers.search": "Rechercher des clients...",
  "customers.viewProfile": "Voir le profil",
  "customers.openTickets": "Tickets ouverts",
  "customers.totalTickets": "Tickets totaux",
  "customers.joined": "Inscrit",
  "badges.resolved": "Résolu IA",
  "badges.escalated": "Escaladé",
  "badges.pending": "À escalader",
  "splash.tagline": "Où l'IA rencontre un vrai service client",
  "splash.enter": "Entrer dans le tableau",
});

export const TRANSLATIONS: Record<LanguageCode, Dict> = {
  en, hi, kn, ta, te, es, fr,
};

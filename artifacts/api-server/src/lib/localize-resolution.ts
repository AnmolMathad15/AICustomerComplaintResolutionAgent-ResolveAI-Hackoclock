/**
 * Server-side resolution localization.
 *
 * Mirrors artifacts/resolveai/src/lib/localize-resolution.ts so that resolution
 * text is stored already-translated when a `language` is provided to /analyze.
 */

export type LanguageCode = "en" | "hi" | "kn" | "ta" | "te" | "es" | "fr";

type PhraseMap = Record<string, string>;

const HI: PhraseMap = {
  "Hi ": "नमस्ते ",
  "Hello ": "नमस्ते ",
  "Dear ": "प्रिय ",
  "complaint": "शिकायत",
  "request": "अनुरोध",
  "refund": "रिफंड",
  "Refund": "रिफंड",
  "delivery": "डिलीवरी",
  "Delivery": "डिलीवरी",
  "billing": "बिलिंग",
  "payment": "भुगतान",
  "issue": "समस्या",
  "Issue": "समस्या",
  "We apologize for the inconvenience": "असुविधा के लिए हमें खेद है",
  "We sincerely apologize": "हम तहे दिल से माफी मांगते हैं",
  "Your case has been escalated": "आपका मामला आगे भेज दिया गया है",
  "has been escalated": "आगे भेज दिया गया है",
  "to a senior agent": "वरिष्ठ एजेंट को",
  "We will get back to you within": "हम आपसे संपर्क करेंगे",
  "hours": "घंटों में",
  "Premium customer": "प्रीमियम ग्राहक",
  "Thank you for your patience": "आपके धैर्य के लिए धन्यवाद",
  "Thank you": "धन्यवाद",
  "within 24 hours": "24 घंटों में",
  "within 48 hours": "48 घंटों में",
  "within 3-5 business days": "3-5 कार्य दिवसों में",
  "Our team will": "हमारी टीम",
  "contact you": "आपसे संपर्क करेगी",
  "As a valued Premium member, you will receive priority handling.":
    "एक मूल्यवान प्रीमियम सदस्य के रूप में, आपको प्राथमिकता मिलेगी।",
  "Thank you for reaching out. Our team has reviewed your concern and will contact you within 24 hours with a personalized resolution.":
    "संपर्क करने के लिए धन्यवाद। हमारी टीम ने आपकी चिंता की समीक्षा की है और 24 घंटों के भीतर आपसे संपर्क करेगी।",
};

const KN: PhraseMap = {
  "Hi ": "ನಮಸ್ಕಾರ ",
  "Hello ": "ನಮಸ್ಕಾರ ",
  "Dear ": "ಪ್ರಿಯ ",
  "complaint": "ದೂರು",
  "request": "ವಿನಂತಿ",
  "refund": "ಮರುಪಾವತಿ",
  "Refund": "ಮರುಪಾವತಿ",
  "delivery": "ಡೆಲಿವರಿ",
  "Delivery": "ಡೆಲಿವರಿ",
  "billing": "ಬಿಲ್ಲಿಂಗ್",
  "payment": "ಪಾವತಿ",
  "issue": "ಸಮಸ್ಯೆ",
  "Issue": "ಸಮಸ್ಯೆ",
  "We apologize for the inconvenience": "ಅನಾನುಕೂಲತೆಗಾಗಿ ಕ್ಷಮಿಸಿ",
  "We sincerely apologize": "ನಾವು ಪ್ರಾಮಾಣಿಕವಾಗಿ ಕ್ಷಮೆ ಕೇಳುತ್ತೇವೆ",
  "Your case has been escalated": "ನಿಮ್ಮ ಪ್ರಕರಣ ಮೇಲ್ಮಟ್ಟಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ",
  "has been escalated": "ಮೇಲ್ಮಟ್ಟಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ",
  "to a senior agent": "ಹಿರಿಯ ಏಜೆಂಟ್‌ಗೆ",
  "We will get back to you within": "ನಾವು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ",
  "hours": "ಗಂಟೆಗಳಲ್ಲಿ",
  "Premium customer": "ಪ್ರೀಮಿಯಂ ಗ್ರಾಹಕ",
  "Thank you for your patience": "ನಿಮ್ಮ ತಾಳ್ಮೆಗೆ ಧನ್ಯವಾದಗಳು",
  "Thank you": "ಧನ್ಯವಾದಗಳು",
  "within 24 hours": "24 ಗಂಟೆಗಳಲ್ಲಿ",
  "within 48 hours": "48 ಗಂಟೆಗಳಲ್ಲಿ",
  "within 3-5 business days": "3-5 ಕೆಲಸದ ದಿನಗಳಲ್ಲಿ",
  "Our team will": "ನಮ್ಮ ತಂಡ",
  "contact you": "ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ",
  "As a valued Premium member, you will receive priority handling.":
    "ಮೌಲ್ಯಯುತ ಪ್ರೀಮಿಯಂ ಸದಸ್ಯರಾಗಿ, ನಿಮಗೆ ಆದ್ಯತೆಯ ನಿರ್ವಹಣೆ ಲಭಿಸುತ್ತದೆ.",
  "Thank you for reaching out. Our team has reviewed your concern and will contact you within 24 hours with a personalized resolution.":
    "ಸಂಪರ್ಕಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ನಮ್ಮ ತಂಡ ನಿಮ್ಮ ಕಾಳಜಿಯನ್ನು ಪರಿಶೀಲಿಸಿದೆ ಮತ್ತು 24 ಗಂಟೆಗಳಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
};

const TA: PhraseMap = {
  "Hi ": "வணக்கம் ",
  "Hello ": "வணக்கம் ",
  "Dear ": "அன்பான ",
  "complaint": "புகார்",
  "request": "கோரிக்கை",
  "refund": "பணத்திரும்பம்",
  "Refund": "பணத்திரும்பம்",
  "delivery": "டெலிவரி",
  "Delivery": "டெலிவரி",
  "billing": "பில்லிங்",
  "payment": "கட்டணம்",
  "issue": "சிக்கல்",
  "Issue": "சிக்கல்",
  "We apologize for the inconvenience": "ஏற்பட்ட சிரமத்திற்கு வருந்துகிறோம்",
  "We sincerely apologize": "உண்மையாகவே வருந்துகிறோம்",
  "Your case has been escalated": "உங்கள் வழக்கு மேல்நிலைக்கு அனுப்பப்பட்டது",
  "has been escalated": "மேல்நிலைக்கு அனுப்பப்பட்டது",
  "to a senior agent": "மூத்த முகவருக்கு",
  "We will get back to you within": "நாங்கள் உங்களை தொடர்புகொள்வோம்",
  "hours": "மணி நேரத்தில்",
  "Premium customer": "பிரீமியம் வாடிக்கையாளர்",
  "Thank you for your patience": "உங்கள் பொறுமைக்கு நன்றி",
  "Thank you": "நன்றி",
  "within 24 hours": "24 மணி நேரத்தில்",
  "within 48 hours": "48 மணி நேரத்தில்",
  "within 3-5 business days": "3-5 வேலை நாட்களுக்குள்",
  "Our team will": "எங்கள் குழு",
  "contact you": "உங்களைத் தொடர்புகொள்ளும்",
  "As a valued Premium member, you will receive priority handling.":
    "மதிப்புமிக்க பிரீமியம் உறுப்பினராக, உங்களுக்கு முன்னுரிமை கையாளுதல் கிடைக்கும்.",
  "Thank you for reaching out. Our team has reviewed your concern and will contact you within 24 hours with a personalized resolution.":
    "தொடர்புகொண்டதற்கு நன்றி. எங்கள் குழு உங்கள் கவலையை மதிப்பாய்வு செய்துள்ளது மற்றும் 24 மணி நேரத்தில் உங்களைத் தொடர்புகொள்ளும்.",
};

const TE: PhraseMap = {
  "Hi ": "నమస్తే ",
  "Hello ": "నమస్తే ",
  "Dear ": "ప్రియమైన ",
  "complaint": "ఫిర్యాదు",
  "request": "అభ్యర్థన",
  "refund": "వాపసు",
  "Refund": "వాపసు",
  "delivery": "డెలివరీ",
  "Delivery": "డెలివరీ",
  "billing": "బిల్లింగ్",
  "payment": "చెల్లింపు",
  "issue": "సమస్య",
  "Issue": "సమస్య",
  "We apologize for the inconvenience": "అసౌకర్యానికి క్షమించండి",
  "We sincerely apologize": "మనస్ఫూర్తిగా క్షమాపణలు",
  "Your case has been escalated": "మీ సమస్య పైస్థాయికి పంపబడింది",
  "has been escalated": "పైస్థాయికి పంపబడింది",
  "to a senior agent": "సీనియర్ ఏజెంట్‌కి",
  "We will get back to you within": "మేము మీకు తిరిగి సంప్రదిస్తాము",
  "hours": "గంటల్లో",
  "Premium customer": "ప్రీమియం కస్టమర్",
  "Thank you for your patience": "మీ ఓర్పుకు ధన్యవాదాలు",
  "Thank you": "ధన్యవాదాలు",
  "within 24 hours": "24 గంటల్లో",
  "within 48 hours": "48 గంటల్లో",
  "within 3-5 business days": "3-5 పని దినాల్లో",
  "Our team will": "మా బృందం",
  "contact you": "మిమ్మల్ని సంప్రదిస్తుంది",
  "As a valued Premium member, you will receive priority handling.":
    "విలువైన ప్రీమియం సభ్యునిగా, మీకు ప్రాధాన్యత హ్యాండ్లింగ్ లభిస్తుంది.",
  "Thank you for reaching out. Our team has reviewed your concern and will contact you within 24 hours with a personalized resolution.":
    "సంప్రదించినందుకు ధన్యవాదాలు. మా బృందం మీ ఆందోళనను సమీక్షించింది మరియు 24 గంటల్లో మిమ్మల్ని సంప్రదిస్తుంది.",
};

const ES: PhraseMap = {
  "Hi ": "Hola ",
  "Hello ": "Hola ",
  "Dear ": "Estimado/a ",
  "complaint": "queja",
  "request": "solicitud",
  "refund": "reembolso",
  "Refund": "Reembolso",
  "delivery": "entrega",
  "Delivery": "Entrega",
  "billing": "facturación",
  "payment": "pago",
  "issue": "problema",
  "Issue": "Problema",
  "We apologize for the inconvenience": "Lamentamos las molestias",
  "We sincerely apologize": "Pedimos sinceras disculpas",
  "Your case has been escalated": "Su caso ha sido escalado",
  "has been escalated": "ha sido escalado",
  "to a senior agent": "a un agente senior",
  "We will get back to you within": "Le contactaremos en",
  "hours": "horas",
  "Premium customer": "cliente Premium",
  "Thank you for your patience": "Gracias por su paciencia",
  "Thank you": "Gracias",
  "within 24 hours": "dentro de 24 horas",
  "within 48 hours": "dentro de 48 horas",
  "within 3-5 business days": "en 3-5 días hábiles",
  "Our team will": "Nuestro equipo",
  "contact you": "le contactará",
  "As a valued Premium member, you will receive priority handling.":
    "Como miembro Premium valioso, recibirá atención prioritaria.",
  "Thank you for reaching out. Our team has reviewed your concern and will contact you within 24 hours with a personalized resolution.":
    "Gracias por contactarnos. Nuestro equipo ha revisado su preocupación y le contactará en un plazo de 24 horas con una solución personalizada.",
};

const FR: PhraseMap = {
  "Hi ": "Bonjour ",
  "Hello ": "Bonjour ",
  "Dear ": "Cher/Chère ",
  "complaint": "plainte",
  "request": "demande",
  "refund": "remboursement",
  "Refund": "Remboursement",
  "delivery": "livraison",
  "Delivery": "Livraison",
  "billing": "facturation",
  "payment": "paiement",
  "issue": "problème",
  "Issue": "Problème",
  "We apologize for the inconvenience": "Nous sommes désolés pour la gêne occasionnée",
  "We sincerely apologize": "Nous nous excusons sincèrement",
  "Your case has been escalated": "Votre dossier a été transmis",
  "has been escalated": "a été transmis",
  "to a senior agent": "à un agent senior",
  "We will get back to you within": "Nous vous recontacterons sous",
  "hours": "heures",
  "Premium customer": "client Premium",
  "Thank you for your patience": "Merci pour votre patience",
  "Thank you": "Merci",
  "within 24 hours": "sous 24 heures",
  "within 48 hours": "sous 48 heures",
  "within 3-5 business days": "sous 3-5 jours ouvrés",
  "Our team will": "Notre équipe",
  "contact you": "vous contactera",
  "As a valued Premium member, you will receive priority handling.":
    "En tant que membre Premium estimé, vous bénéficierez d'un traitement prioritaire.",
  "Thank you for reaching out. Our team has reviewed your concern and will contact you within 24 hours with a personalized resolution.":
    "Merci de nous avoir contactés. Notre équipe a examiné votre préoccupation et vous contactera sous 24 heures avec une solution personnalisée.",
};

const MAPS: Partial<Record<LanguageCode, PhraseMap>> = {
  hi: HI,
  kn: KN,
  ta: TA,
  te: TE,
  es: ES,
  fr: FR,
};

const SUPPORTED: LanguageCode[] = ["en", "hi", "kn", "ta", "te", "es", "fr"];

export function isSupportedLanguage(value: unknown): value is LanguageCode {
  return typeof value === "string" && (SUPPORTED as string[]).includes(value);
}

export function localizeResolution(text: string, language?: string): string {
  if (!text || !language || language === "en") return text;
  if (!isSupportedLanguage(language)) return text;
  const map = MAPS[language];
  if (!map) return text;

  let out = text;
  const entries = Object.entries(map).sort(
    ([a], [b]) => b.length - a.length
  );
  for (const [src, dst] of entries) {
    if (out.includes(src)) {
      out = out.split(src).join(dst);
    }
  }
  return out;
}

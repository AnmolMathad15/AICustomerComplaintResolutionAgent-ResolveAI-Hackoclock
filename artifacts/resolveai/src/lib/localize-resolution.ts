/**
 * Lightweight client-side localization for AI-generated resolution text.
 *
 * The backend AI engine produces English templates. To respect "AI response
 * language must match UI language" without rewriting the engine, we apply a
 * phrase-substitution pass on the client. Untranslated phrases fall through
 * unchanged — preserves backward compatibility.
 */
import type { LanguageCode } from "./i18n";

type PhraseMap = Record<string, string>;

const HI: PhraseMap = {
  "Hi ": "नमस्ते ",
  "Hello ": "नमस्ते ",
  "Dear ": "प्रिय ",
  ", we have processed your": ", हमने आपकी",
  "We have processed your": "हमने आपकी",
  "request": "अनुरोध",
  "complaint": "शिकायत",
  "refund": "वापसी",
  "Refund": "वापसी",
  "delivery": "डिलीवरी",
  "Delivery": "डिलीवरी",
  "billing": "बिलिंग",
  "payment": "भुगतान",
  "issue": "समस्या",
  "Issue": "समस्या",
  "We apologize for the inconvenience": "हुई असुविधा के लिए हमें खेद है",
  "We sincerely apologize": "हमें ईमानदारी से खेद है",
  "Your case has been escalated": "आपका मामला उच्च स्तर पर भेज दिया गया है",
  "has been escalated": "उच्च स्तर पर भेज दिया गया है",
  "to a senior agent": "एक वरिष्ठ एजेंट को",
  "We will get back to you within": "हम आपसे संपर्क करेंगे",
  "hours": "घंटों के भीतर",
  "Premium customer": "प्रीमियम ग्राहक",
  "as a valued": "मूल्यवान",
  "Thank you for your patience": "आपके धैर्य के लिए धन्यवाद",
  "Thank you": "धन्यवाद",
  "processed": "संसाधित किया",
  "approved": "स्वीकृत किया",
  "credited": "जमा किया",
  "within 24 hours": "24 घंटों के भीतर",
  "within 48 hours": "48 घंटों के भीतर",
  "within 3-5 business days": "3-5 कार्य दिवसों के भीतर",
  "Our team will": "हमारी टीम",
  "contact you": "आपसे संपर्क करेगी",
};

const KN: PhraseMap = {
  "Hi ": "ನಮಸ್ಕಾರ ",
  "Hello ": "ನಮಸ್ಕಾರ ",
  "Dear ": "ಆತ್ಮೀಯ ",
  ", we have processed your": ", ನಾವು ನಿಮ್ಮ",
  "We have processed your": "ನಾವು ನಿಮ್ಮ",
  "request": "ವಿನಂತಿ",
  "complaint": "ದೂರು",
  "refund": "ಮರುಪಾವತಿ",
  "Refund": "ಮರುಪಾವತಿ",
  "delivery": "ವಿತರಣೆ",
  "Delivery": "ವಿತರಣೆ",
  "billing": "ಬಿಲ್ಲಿಂಗ್",
  "payment": "ಪಾವತಿ",
  "issue": "ಸಮಸ್ಯೆ",
  "Issue": "ಸಮಸ್ಯೆ",
  "We apologize for the inconvenience": "ಅನಾನುಕೂಲಕ್ಕಾಗಿ ನಾವು ಕ್ಷಮೆಯಾಚಿಸುತ್ತೇವೆ",
  "We sincerely apologize": "ನಾವು ಪ್ರಾಮಾಣಿಕವಾಗಿ ಕ್ಷಮೆಯಾಚಿಸುತ್ತೇವೆ",
  "Your case has been escalated": "ನಿಮ್ಮ ಪ್ರಕರಣವನ್ನು ಉನ್ನತ ಮಟ್ಟಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ",
  "has been escalated": "ಉನ್ನತ ಮಟ್ಟಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ",
  "to a senior agent": "ಹಿರಿಯ ಪ್ರತಿನಿಧಿಗೆ",
  "We will get back to you within": "ನಾವು ನಿಮಗೆ ಮರಳಿ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ",
  "hours": "ಗಂಟೆಗಳೊಳಗೆ",
  "Premium customer": "ಪ್ರೀಮಿಯಂ ಗ್ರಾಹಕ",
  "as a valued": "ಬೆಲೆಯುಳ್ಳ",
  "Thank you for your patience": "ನಿಮ್ಮ ಸಹನಶೀಲತೆಗೆ ಧನ್ಯವಾದ",
  "Thank you": "ಧನ್ಯವಾದ",
  "processed": "ಸಂಸ್ಕರಿಸಲಾಗಿದೆ",
  "approved": "ಅನುಮೋದಿಸಲಾಗಿದೆ",
  "credited": "ಜಮಾ ಮಾಡಲಾಗಿದೆ",
  "within 24 hours": "24 ಗಂಟೆಗಳೊಳಗೆ",
  "within 48 hours": "48 ಗಂಟೆಗಳೊಳಗೆ",
  "within 3-5 business days": "3-5 ವ್ಯಾಪಾರ ದಿನಗಳೊಳಗೆ",
  "Our team will": "ನಮ್ಮ ತಂಡ",
  "contact you": "ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ",
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
  "We have processed your": "Hemos procesado su",
  "as a valued": "como valioso",
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
  "We have processed your": "Nous avons traité votre",
  "as a valued": "en tant que",
};

const MAPS: Partial<Record<LanguageCode, PhraseMap>> = {
  hi: HI,
  kn: KN,
  ta: TA,
  te: TE,
  es: ES,
  fr: FR,
};

/**
 * Translate AI resolution text into the selected UI language.
 * For unsupported languages or unmapped phrases, returns input unchanged.
 */
export function localizeResolution(text: string, lang: LanguageCode): string {
  if (!text) return text;
  const map = MAPS[lang];
  if (!map) return text;
  let out = text;
  // Apply longest-key first for greedy matching.
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (out.includes(k)) {
      out = out.split(k).join(map[k]);
    }
  }
  return out;
}

/** Map UI language code → BCP-47 voice recognition locale. */
export function voiceLocaleFor(lang: LanguageCode): string {
  switch (lang) {
    case "hi":
      return "hi-IN";
    case "kn":
      return "kn-IN";
    case "ta":
      return "ta-IN";
    case "te":
      return "te-IN";
    case "es":
      return "es-ES";
    case "fr":
      return "fr-FR";
    case "en":
    default:
      return "en-IN";
  }
}

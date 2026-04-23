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

const MAPS: Partial<Record<LanguageCode, PhraseMap>> = { hi: HI, kn: KN };

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

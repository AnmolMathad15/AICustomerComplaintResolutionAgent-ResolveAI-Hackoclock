import type { LanguageCode } from "./i18n";

type Bundle = {
  listening: string;
  noSpeech: string;
  network: string;
  notAllowed: string;
  unsupported: string;
  tooltip: string;
};

const BUNDLES: Record<LanguageCode, Bundle> = {
  en: {
    listening: "Listening… speak your complaint",
    noSpeech: "No speech detected. Please try again.",
    network: "Network error. Check your connection.",
    notAllowed: "Microphone access denied.",
    unsupported: "Voice input requires Chrome.",
    tooltip: "Voice input (Chrome recommended)",
  },
  hi: {
    listening: "सुन रहे हैं… अपनी शिकायत बोलें",
    noSpeech: "आवाज़ नहीं सुनाई दी। कृपया पुनः प्रयास करें।",
    network: "नेटवर्क त्रुटि। कनेक्शन जांचें।",
    notAllowed: "माइक्रोफ़ोन एक्सेस अस्वीकृत।",
    unsupported: "वॉइस इनपुट के लिए Chrome आवश्यक है।",
    tooltip: "वॉइस इनपुट (Chrome अनुशंसित)",
  },
  kn: {
    listening: "ಆಲಿಸುತ್ತಿದ್ದೇವೆ… ನಿಮ್ಮ ದೂರನ್ನು ಹೇಳಿ",
    noSpeech: "ಮಾತು ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    network: "ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ.",
    notAllowed: "ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ.",
    unsupported: "ಧ್ವನಿ ಇನ್‌ಪುಟ್‌ಗೆ Chrome ಅಗತ್ಯ.",
    tooltip: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ (Chrome ಶಿಫಾರಸು)",
  },
  ta: {
    listening: "கேட்கிறோம்… உங்கள் புகாரைச் சொல்லுங்கள்",
    noSpeech: "பேச்சு கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்.",
    network: "நெட்வொர்க் பிழை. இணைப்பை சரிபார்க்கவும்.",
    notAllowed: "மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது.",
    unsupported: "குரல் உள்ளீட்டுக்கு Chrome தேவை.",
    tooltip: "குரல் உள்ளீடு (Chrome பரிந்துரை)",
  },
  te: {
    listening: "వింటున్నాం… మీ ఫిర్యాదు చెప్పండి",
    noSpeech: "మాట వినిపించలేదు. మళ్ళీ ప్రయత్నించండి.",
    network: "నెట్‌వర్క్ లోపం. కనెక్షన్ తనిఖీ చేయండి.",
    notAllowed: "మైక్రోఫోన్ యాక్సెస్ తిరస్కరించబడింది.",
    unsupported: "వాయిస్ ఇన్‌పుట్‌కు Chrome అవసరం.",
    tooltip: "వాయిస్ ఇన్‌పుట్ (Chrome సిఫారసు)",
  },
  es: {
    listening: "Escuchando… diga su queja",
    noSpeech: "No se detectó voz. Por favor intente de nuevo.",
    network: "Error de red. Verifique su conexión.",
    notAllowed: "Acceso al micrófono denegado.",
    unsupported: "La entrada de voz requiere Chrome.",
    tooltip: "Entrada de voz (Chrome recomendado)",
  },
  fr: {
    listening: "Écoute en cours… énoncez votre réclamation",
    noSpeech: "Aucune voix détectée. Veuillez réessayer.",
    network: "Erreur réseau. Vérifiez votre connexion.",
    notAllowed: "Accès au microphone refusé.",
    unsupported: "L'entrée vocale nécessite Chrome.",
    tooltip: "Entrée vocale (Chrome recommandé)",
  },
};

export function voiceMessages(lang: LanguageCode): Bundle {
  return BUNDLES[lang] ?? BUNDLES.en;
}

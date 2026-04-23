/**
 * Native per-language resolution + escalation templates.
 *
 * The phrase-substitution layer in `localize-resolution.ts` is a safety net
 * for arbitrary AI-generated text. For the 6 known complaint types, we have
 * hand-written native-language templates here so the customer-facing copy is
 * fully fluent (not stitched-together word swaps).
 *
 * Returns `null` when the (type, language) combo is not covered, in which
 * case the caller should fall back to phrase substitution.
 */

type LangCode = "en" | "hi" | "kn" | "ta" | "te" | "es" | "fr";

const RESOLUTION_TEMPLATES: Record<string, Partial<Record<LangCode, string>>> = {
  billing: {
    hi: "हमने आपकी बिलिंग समस्या की जांच कर ली है। अतिरिक्त चार्ज की गई राशि 3-5 कार्य दिवसों में आपके मूल भुगतान माध्यम पर वापस कर दी जाएगी।",
    kn: "ನಿಮ್ಮ ಬಿಲ್ಲಿಂಗ್ ಸಮಸ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಹೆಚ್ಚುವರಿ ಶುಲ್ಕವನ್ನು 3-5 ಕಾರ್ಯ ದಿನಗಳಲ್ಲಿ ನಿಮ್ಮ ಮೂಲ ಪಾವತಿ ವಿಧಾನಕ್ಕೆ ಮರಳಿಸಲಾಗುವುದು.",
    ta: "உங்கள் பில்லிங் சிக்கலை சரிபார்த்தோம். அதிகமாக வசூலிக்கப்பட்ட தொகை 3-5 வேலை நாட்களில் உங்கள் அசல் கட்டண முறைக்கு திருப்பி அனுப்பப்படும்.",
    te: "మీ బిల్లింగ్ సమస్యను ధృవీకరించాం. అదనంగా వసూలు చేసిన మొత్తాన్ని 3-5 వ్యాపార రోజులలో మీ అసలు చెల్లింపు పద్ధతికి తిరిగి చెల్లిస్తాం.",
    es: "Hemos verificado su problema de facturación. El monto cobrado de más será reembolsado en 3-5 días hábiles a su método de pago original.",
    fr: "Nous avons vérifié votre problème de facturation. Le montant trop perçu sera remboursé sous 3 à 5 jours ouvrables sur votre moyen de paiement initial.",
  },
  refund: {
    hi: "आपका रिफंड अनुरोध स्वीकार कर लिया गया है और 5-7 कार्य दिवसों के भीतर क्रेडिट कर दिया जाएगा। आपको शीघ्र ही एक पुष्टिकरण ईमेल प्राप्त होगा।",
    kn: "ನಿಮ್ಮ ಮರುಪಾವತಿ ವಿನಂತಿಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ ಮತ್ತು 5-7 ಕಾರ್ಯ ದಿನಗಳಲ್ಲಿ ಜಮಾ ಮಾಡಲಾಗುವುದು. ಶೀಘ್ರವೇ ದೃಢೀಕರಣ ಇಮೇಲ್ ಬರಲಿದೆ.",
    ta: "உங்கள் பணத்திரும்ப கோரிக்கை ஏற்றுக்கொள்ளப்பட்டது, 5-7 வேலை நாட்களில் வரவு வைக்கப்படும். உறுதிப்படுத்தல் மின்னஞ்சல் விரைவில் கிடைக்கும்.",
    te: "మీ రీఫండ్ అభ్యర్థన ఆమోదించబడింది మరియు 5-7 వ్యాపార రోజులలో క్రెడిట్ చేయబడుతుంది. త్వరలో నిర్ధారణ ఇమెయిల్ అందుతుంది.",
    es: "Su solicitud de reembolso ha sido aceptada y se acreditará en un plazo de 5-7 días hábiles. Recibirá un correo de confirmación en breve.",
    fr: "Votre demande de remboursement a été acceptée et sera créditée sous 5 à 7 jours ouvrables. Vous recevrez un e-mail de confirmation sous peu.",
  },
  technical: {
    hi: "हमने आपकी समस्या के लिए एक उच्च-प्राथमिकता तकनीकी टिकट दर्ज कर दिया है। हमारी इंजीनियरिंग टीम 24 घंटों के भीतर इसे हल करेगी और आपको ईमेल द्वारा सूचित करेगी।",
    kn: "ನಿಮ್ಮ ಸಮಸ್ಯೆಗೆ ಹೆಚ್ಚಿನ ಆದ್ಯತೆಯ ತಾಂತ್ರಿಕ ಟಿಕೆಟ್ ದಾಖಲಿಸಲಾಗಿದೆ. ನಮ್ಮ ಎಂಜಿನಿಯರಿಂಗ್ ತಂಡ 24 ಗಂಟೆಗಳಲ್ಲಿ ಇದನ್ನು ಪರಿಹರಿಸುತ್ತದೆ ಮತ್ತು ಇಮೇಲ್ ಮೂಲಕ ತಿಳಿಸುತ್ತದೆ.",
    ta: "உங்கள் சிக்கலுக்கு உயர்-முன்னுரிமை தொழில்நுட்ப டிக்கெட் பதிவு செய்யப்பட்டுள்ளது. எங்கள் பொறியியல் குழு 24 மணி நேரத்தில் இதைத் தீர்த்து மின்னஞ்சல் வழியாக தெரிவிக்கும்.",
    te: "మీ సమస్యకు అధిక ప్రాధాన్యత గల సాంకేతిక టికెట్ నమోదు చేయబడింది. మా ఇంజినీరింగ్ టీమ్ 24 గంటలలో దీన్ని పరిష్కరించి ఇమెయిల్ ద్వారా తెలియజేస్తుంది.",
    es: "Hemos registrado un ticket técnico de alta prioridad para su problema. Nuestro equipo de ingeniería lo resolverá en 24 horas y le notificará por correo.",
    fr: "Nous avons enregistré un ticket technique haute priorité pour votre problème. Notre équipe d'ingénierie le résoudra sous 24 heures et vous notifiera par e-mail.",
  },
  delivery: {
    hi: "हमने आपकी डिलीवरी समस्या को अपने लॉजिस्टिक्स पार्टनर के साथ चिह्नित कर दिया है। संशोधित डिलीवरी समयरेखा के साथ आपको 24 घंटों के भीतर अपडेट प्राप्त होगा।",
    kn: "ನಿಮ್ಮ ವಿತರಣಾ ಸಮಸ್ಯೆಯನ್ನು ನಮ್ಮ ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಪಾಲುದಾರರಿಗೆ ಗುರುತಿಸಲಾಗಿದೆ. ಪರಿಷ್ಕೃತ ವಿತರಣಾ ಸಮಯದೊಂದಿಗೆ 24 ಗಂಟೆಗಳಲ್ಲಿ ಅಪ್‌ಡೇಟ್ ಬರುತ್ತದೆ.",
    ta: "உங்கள் டெலிவரி சிக்கலை எங்கள் தளவாட பங்காளருக்கு கொடியிட்டுள்ளோம். திருத்தப்பட்ட டெலிவரி நேரத்துடன் 24 மணி நேரத்தில் புதுப்பிப்பு கிடைக்கும்.",
    te: "మీ డెలివరీ సమస్యను మా లాజిస్టిక్స్ భాగస్వామికి ఫ్లాగ్ చేశాం. సవరించిన డెలివరీ టైమ్‌లైన్‌తో 24 గంటలలో అప్‌డేట్ అందుతుంది.",
    es: "Hemos notificado a nuestro socio logístico sobre su problema de entrega. Recibirá una actualización en 24 horas con el plazo de entrega revisado.",
    fr: "Nous avons signalé votre problème de livraison à notre partenaire logistique. Vous recevrez une mise à jour sous 24 heures avec le nouveau délai de livraison.",
  },
  account: {
    hi: "हमने एक सुरक्षित खाता पुनर्प्राप्ति प्रक्रिया शुरू कर दी है। आपके पंजीकृत ईमेल पर एक सत्यापन लिंक भेजा गया है। कृपया अपना इनबॉक्स देखें।",
    kn: "ಸುರಕ್ಷಿತ ಖಾತೆ ಮರುಪಡೆಯುವ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಆರಂಭಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್‌ಗೆ ಪರಿಶೀಲನಾ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಇನ್ಬಾಕ್ಸ್ ಪರಿಶೀಲಿಸಿ.",
    ta: "பாதுகாப்பான கணக்கு மீட்பு செயல்முறையை தொடங்கியுள்ளோம். உங்கள் பதிவு செய்த மின்னஞ்சலுக்கு சரிபார்ப்பு இணைப்பு அனுப்பப்பட்டுள்ளது. தயவுசெய்து இன்பாக்ஸை சரிபார்க்கவும்.",
    te: "సురక్షితమైన ఖాతా రికవరీ ప్రక్రియను ప్రారంభించాం. మీ నమోదిత ఇమెయిల్‌కు వెరిఫికేషన్ లింక్ పంపబడింది. దయచేసి ఇన్‌బాక్స్ తనిఖీ చేయండి.",
    es: "Hemos iniciado un proceso seguro de recuperación de cuenta. Se ha enviado un enlace de verificación a su correo registrado. Por favor revise su bandeja de entrada.",
    fr: "Nous avons lancé un processus sécurisé de récupération de compte. Un lien de vérification a été envoyé à votre e-mail enregistré. Veuillez vérifier votre boîte de réception.",
  },
  product_quality: {
    hi: "गुणवत्ता समस्या के लिए हम ईमानदारी से क्षमा चाहते हैं। 1-2 कार्य दिवसों में एक प्रतिस्थापन भेजा जाएगा। एक प्रीपेड रिटर्न लेबल आपको ईमेल किया गया है।",
    kn: "ಗುಣಮಟ್ಟದ ಸಮಸ್ಯೆಗೆ ನಾವು ಪ್ರಾಮಾಣಿಕವಾಗಿ ಕ್ಷಮೆಯಾಚಿಸುತ್ತೇವೆ. 1-2 ಕಾರ್ಯ ದಿನಗಳಲ್ಲಿ ಬದಲಿ ಕಳುಹಿಸಲಾಗುವುದು. ಪ್ರಿಪೇಯ್ಡ್ ರಿಟರ್ನ್ ಲೇಬಲ್ ಇಮೇಲ್ ಮಾಡಲಾಗಿದೆ.",
    ta: "தரச் சிக்கலுக்கு உண்மையாகவே வருந்துகிறோம். 1-2 வேலை நாட்களில் மாற்றுப் பொருள் அனுப்பப்படும். முன்பணம் செலுத்திய திரும்ப அனுப்பும் லேபிள் மின்னஞ்சல் அனுப்பப்பட்டுள்ளது.",
    te: "నాణ్యతా సమస్యకు మనస్ఫూర్తిగా క్షమాపణలు. 1-2 వ్యాపార రోజులలో రీప్లేస్‌మెంట్ పంపబడుతుంది. ప్రీపెయిడ్ రిటర్న్ లేబుల్ ఇమెయిల్ చేయబడింది.",
    es: "Pedimos sinceras disculpas por el problema de calidad. Se enviará un reemplazo en 1-2 días hábiles. Se le ha enviado por correo una etiqueta de devolución prepagada.",
    fr: "Nous nous excusons sincèrement pour le problème de qualité. Un remplacement sera expédié sous 1 à 2 jours ouvrables. Une étiquette de retour prépayée vous a été envoyée par e-mail.",
  },
};

const PREMIUM_SUFFIX: Partial<Record<LangCode, string>> = {
  hi: " एक मूल्यवान प्रीमियम सदस्य के रूप में, आपको प्राथमिकता हैंडलिंग प्राप्त होगी।",
  kn: " ಬೆಲೆಯುಳ್ಳ ಪ್ರೀಮಿಯಂ ಸದಸ್ಯರಾಗಿ ನಿಮಗೆ ಆದ್ಯತಾ ನಿರ್ವಹಣೆ ಸಿಗುತ್ತದೆ.",
  ta: " மதிப்புமிக்க பிரீமியம் உறுப்பினராக, உங்களுக்கு முன்னுரிமை கையாளுதல் கிடைக்கும்.",
  te: " విలువైన ప్రీమియం సభ్యునిగా మీకు ప్రాధాన్యత హ్యాండ్లింగ్ లభిస్తుంది.",
  es: " Como valioso miembro Premium, recibirá atención prioritaria.",
  fr: " En tant que précieux membre Premium, vous bénéficierez d'un traitement prioritaire.",
};

const ESCALATION_MESSAGES: Partial<Record<LangCode, string>> = {
  hi: "आपकी शिकायत एक वरिष्ठ सहायता एजेंट को भेज दी गई है जो 15-30 मिनट में आपसे संपर्क करेगा।",
  kn: "ನಿಮ್ಮ ದೂರನ್ನು ಹಿರಿಯ ಸಹಾಯ ಪ್ರತಿನಿಧಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ, ಅವರು 15-30 ನಿಮಿಷಗಳಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.",
  ta: "உங்கள் புகார் மூத்த ஆதரவு முகவருக்கு அனுப்பப்பட்டது. அவர்கள் 15-30 நிமிடங்களில் உங்களைத் தொடர்பு கொள்வார்கள்.",
  te: "మీ ఫిర్యాదు సీనియర్ సపోర్ట్ ఏజెంట్‌కు పంపబడింది. వారు 15-30 నిమిషాలలో సంప్రదిస్తారు.",
  es: "Su queja ha sido escalada a un agente senior que se pondrá en contacto con usted en 15-30 minutos.",
  fr: "Votre réclamation a été transmise à un agent senior qui vous contactera dans 15 à 30 minutes.",
};

const HIGH_FRUSTRATION_MESSAGES: Partial<Record<LangCode, string>> = {
  hi: "हुई परेशानी के लिए हम ईमानदारी से क्षमा चाहते हैं। आपके मामले को प्राथमिकता दी गई है और एक वरिष्ठ एजेंट जल्द ही आपसे संपर्क करेगा।",
  kn: "ಉಂಟಾದ ಅಸಮಾಧಾನಕ್ಕೆ ನಾವು ಪ್ರಾಮಾಣಿಕವಾಗಿ ಕ್ಷಮೆಯಾಚಿಸುತ್ತೇವೆ. ನಿಮ್ಮ ಪ್ರಕರಣಕ್ಕೆ ಆದ್ಯತೆ ನೀಡಲಾಗಿದೆ ಮತ್ತು ಹಿರಿಯ ಪ್ರತಿನಿಧಿ ಶೀಘ್ರವೇ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.",
  ta: "ஏற்பட்ட அதிருப்திக்கு உண்மையாகவே வருந்துகிறோம். உங்கள் வழக்கு முன்னுரிமை அளிக்கப்பட்டது, மூத்த முகவர் விரைவில் உங்களைத் தொடர்பு கொள்வார்.",
  te: "కలిగిన అసంతృప్తికి మనస్ఫూర్తిగా క్షమాపణలు. మీ కేసుకు ప్రాధాన్యత ఇవ్వబడింది, సీనియర్ ఏజెంట్ త్వరలో సంప్రదిస్తారు.",
  es: "Nos disculpamos sinceramente por la frustración causada. Su caso ha sido priorizado y un agente senior se pondrá en contacto con usted en breve.",
  fr: "Nous nous excusons sincèrement pour la frustration causée. Votre dossier a été priorisé et un agent senior vous contactera sous peu.",
};

function isSupported(lang: string | undefined): lang is LangCode {
  return (
    lang === "hi" ||
    lang === "kn" ||
    lang === "ta" ||
    lang === "te" ||
    lang === "es" ||
    lang === "fr"
  );
}

/**
 * Returns a fully native resolution string for the given complaint type and
 * language. Appends a Premium-tier suffix when applicable. Returns `null` if
 * (type, language) is not covered — caller should fall back to the existing
 * phrase-substitution layer.
 */
export function nativeResolutionTemplate(
  complaintType: string | undefined,
  language: string | undefined,
  isPremium: boolean
): string | null {
  if (!complaintType || !isSupported(language)) return null;
  const langMap = RESOLUTION_TEMPLATES[complaintType];
  if (!langMap) return null;
  const base = langMap[language];
  if (!base) return null;
  if (isPremium && PREMIUM_SUFFIX[language]) {
    return base + PREMIUM_SUFFIX[language];
  }
  return base;
}

/** Native escalation summary, or null if unsupported. */
export function nativeEscalationMessage(
  language: string | undefined,
  highFrustration: boolean
): string | null {
  if (!isSupported(language)) return null;
  const map = highFrustration ? HIGH_FRUSTRATION_MESSAGES : ESCALATION_MESSAGES;
  return map[language] ?? null;
}

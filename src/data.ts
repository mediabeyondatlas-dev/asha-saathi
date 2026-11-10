// ---------------------------------------------------------------------------
// ASHA Saathi — knowledge base
// Triage checklists follow WHO IMNCI danger signs and the standard ASHA
// training curriculum. This is decision SUPPORT for a trained frontline
// worker, not a diagnosis and not a medical device.
// Vaccine schedule follows India's Universal Immunisation Programme (UIP).
// ---------------------------------------------------------------------------

export type Lang = 'en' | 'hi'

export interface TriageQuestion {
  id: string
  en: string
  hi: string
  /** A "yes" to this question is a red flag -> refer immediately. */
  redFlag: boolean
}

export interface TriageModule {
  id: string
  en: string
  hi: string
  introEn: string
  introHi: string
  questions: TriageQuestion[]
  referFacilityEn: string
  referFacilityHi: string
  routineAdviceEn: string
  routineAdviceHi: string
}

export const TRIAGE_MODULES: TriageModule[] = [
  {
    id: 'pregnancy',
    en: 'Pregnancy danger signs',
    hi: 'गर्भावस्था के खतरे के लक्षण',
    introEn: 'Ask the mother these questions at every antenatal visit. Any YES means refer today — do not wait for the next visit.',
    introHi: 'हर प्रसवपूर्व मुलाकात में माँ से ये सवाल पूछें। कोई भी हाँ का मतलब है आज ही रेफर करें।',
    referFacilityEn: 'Refer today to the nearest PHC / CHC. If bleeding or convulsions, go straight to the district hospital and call 108.',
    referFacilityHi: 'आज ही नज़दीकी PHC / CHC रेफर करें। खून बहने या दौरे पर सीधे जिला अस्पताल जाएँ और 108 पर कॉल करें।',
    routineAdviceEn: 'No danger sign found. Continue routine antenatal care: 4 check-ups, IFA tablets daily, TT immunisation, and a birth plan at the PHC.',
    routineAdviceHi: 'कोई खतरे का लक्षण नहीं मिला। नियमित प्रसवपूर्व देखभाल जारी रखें: 4 जाँचें, रोज़ IFA गोलियाँ, TT टीकाकरण और PHC में प्रसव योजना।',
    questions: [
      { id: 'p1', en: 'Any vaginal bleeding?', hi: 'क्या योनि से खून बह रहा है?', redFlag: true },
      { id: 'p2', en: 'Severe headache, or blurred vision?', hi: 'तेज़ सिरदर्द या धुंधला दिखना?', redFlag: true },
      { id: 'p3', en: 'Fits / convulsions?', hi: 'दौरे / ऐंठन?', redFlag: true },
      { id: 'p4', en: 'Fever, or foul-smelling discharge?', hi: 'बुखार या बदबूदार स्राव?', redFlag: true },
      { id: 'p5', en: 'Severe abdominal pain?', hi: 'पेट में तेज़ दर्द?', redFlag: true },
      { id: 'p6', en: 'Baby moving less than usual?', hi: 'बच्चे की हलचल पहले से कम?', redFlag: true },
      { id: 'p7', en: 'Swelling of face or hands, or breathlessness?', hi: 'चेहरे या हाथों में सूजन, या साँस फूलना?', redFlag: true },
      { id: 'p8', en: 'Water leaking (membranes ruptured) before labour?', hi: 'प्रसव से पहले पानी निकलना?', redFlag: true },
    ],
  },
  {
    id: 'newborn',
    en: 'Newborn danger signs (0–28 days)',
    hi: 'नवजात के खतरे के लक्षण (0–28 दिन)',
    introEn: 'Check every newborn in the first month. Any YES is an emergency — the baby must reach a facility today.',
    introHi: 'पहले महीने में हर नवजात की जाँच करें। कोई भी हाँ आपातकाल है — बच्चे को आज ही अस्पताल पहुँचाएँ।',
    referFacilityEn: 'Refer immediately to the nearest facility with newborn care (CHC / district hospital SNCU). Keep the baby warm and do not delay.',
    referFacilityHi: 'तुरंत नवजात देखभाल वाली सुविधा (CHC / जिला अस्पताल SNCU) रेफर करें। बच्चे को गर्म रखें, देर न करें।',
    routineAdviceEn: 'No danger sign found. Support exclusive breastfeeding, keep the cord clean and dry, keep the baby warm, and visit again in 3 days.',
    routineAdviceHi: 'कोई खतरे का लक्षण नहीं मिला। सिर्फ़ स्तनपान कराएँ, नाल साफ़-सूखी रखें, बच्चे को गर्म रखें और 3 दिन में फिर मिलें।',
    questions: [
      { id: 'n1', en: 'Not feeding, or feeding poorly?', hi: 'दूध नहीं पी रहा / कम पी रहा?', redFlag: true },
      { id: 'n2', en: 'Fits / convulsions?', hi: 'दौरे / ऐंठन?', redFlag: true },
      { id: 'n3', en: 'Fast breathing, or chest sinking in when breathing?', hi: 'तेज़ साँस या साँस लेते समय छाती अंदर धँसना?', redFlag: true },
      { id: 'n4', en: 'Fever (hot body) or body unusually cold?', hi: 'बुखार (शरीर गरम) या शरीर असामान्य रूप से ठंडा?', redFlag: true },
      { id: 'n5', en: 'Very sleepy, floppy, or not responding?', hi: 'बहुत सुस्त, ढीला या प्रतिक्रिया नहीं?', redFlag: true },
      { id: 'n6', en: 'Umbilicus red, swollen, or with pus / bad smell?', hi: 'नाभि लाल, सूजी हुई, मवाद या बदबू?', redFlag: true },
      { id: 'n7', en: 'Yellow skin or eyes (jaundice) spreading to palms/soles?', hi: 'पीली त्वचा या आँखें, हथेली/तलवों तक फैली?', redFlag: true },
    ],
  },
  {
    id: 'fever',
    en: 'Child with fever',
    hi: 'बुखार वाला बच्चा',
    introEn: 'For a child under 5 with fever. Any YES means the child needs a facility today, not home treatment alone.',
    introHi: '5 साल से कम के बुखार वाले बच्चे के लिए। कोई भी हाँ का मतलब है बच्चे को आज ही अस्पताल ले जाएँ।',
    referFacilityEn: 'Refer today to the PHC. If the child has convulsions or is unconscious, go to the district hospital and call 108.',
    referFacilityHi: 'आज ही PHC रेफर करें। दौरे या बेहोशी पर जिला अस्पताल जाएँ और 108 पर कॉल करें।',
    routineAdviceEn: 'No danger sign found. Give paracetamol as per weight, plenty of fluids, tepid sponging, and re-check in 2 days — sooner if fever rises or new symptoms appear.',
    routineAdviceHi: 'कोई खतरे का लक्षण नहीं मिला। वज़न के अनुसार पैरासिटामोल, खूब तरल पदार्थ, गीले कपड़े से पोंछें, 2 दिन में फिर जाँचें — बुखार बढ़े तो पहले आएँ।',
    questions: [
      { id: 'f1', en: 'Fever for more than 3 days?', hi: '3 दिन से ज़्यादा बुखार?', redFlag: true },
      { id: 'f2', en: 'Fits / convulsions with the fever?', hi: 'बुखार के साथ दौरे?', redFlag: true },
      { id: 'f3', en: 'Difficulty breathing, or fast breathing?', hi: 'साँस लेने में तकलीफ़ या तेज़ साँस?', redFlag: true },
      { id: 'f4', en: 'Vomiting everything, cannot drink?', hi: 'सब उल्टी कर देता है, पी नहीं पाता?', redFlag: true },
      { id: 'f5', en: 'Unusually sleepy, or not responding normally?', hi: 'असामान्य रूप से सुस्त या प्रतिक्रिया नहीं?', redFlag: true },
      { id: 'f6', en: 'Rash with fever, or bleeding spots?', hi: 'बुखार के साथ चकत्ते या खून के धब्बे?', redFlag: true },
    ],
  },
  {
    id: 'diarrhoea',
    en: 'Child with diarrhoea',
    hi: 'दस्त वाला बच्चा',
    introEn: 'For a child with loose stools. Any YES means severe dehydration risk — refer today and start ORS on the way.',
    introHi: 'पतले दस्त वाले बच्चे के लिए। कोई भी हाँ का मतलब है गंभीर निर्जलीकरण का ख़तरा — आज ही रेफर करें और रास्ते में ORS दें।',
    referFacilityEn: 'Refer today to the PHC. Start ORS and zinc as per protocol. If the child is lethargic or not drinking, go to the district hospital.',
    referFacilityHi: 'आज ही PHC रेफर करें। प्रोटोकॉल के अनुसार ORS और ज़िंक दें। बच्चा सुस्त हो या पी न पाए तो जिला अस्पताल जाएँ।',
    routineAdviceEn: 'No danger sign found. Give ORS after every stool, zinc for 14 days, continue breastfeeding and normal food, and re-check in 2 days.',
    routineAdviceHi: 'कोई खतरे का लक्षण नहीं मिला। हर दस्त के बाद ORS, 14 दिन ज़िंक, स्तनपान और सामान्य खाना जारी रखें, 2 दिन में फिर जाँचें।',
    questions: [
      { id: 'd1', en: 'Blood in the stool?', hi: 'मल में खून?', redFlag: true },
      { id: 'd2', en: 'Sunken eyes, or very dry mouth / no tears?', hi: 'धँसी आँखें, बहुत सूखा मुँह / आँसू नहीं?', redFlag: true },
      { id: 'd3', en: 'Not passing urine, or very little urine?', hi: 'पेशाब नहीं या बहुत कम?', redFlag: true },
      { id: 'd4', en: 'Vomiting everything, cannot keep ORS down?', hi: 'सब उल्टी, ORS भी नहीं रुकता?', redFlag: true },
      { id: 'd5', en: 'Very sleepy, floppy, or unconscious?', hi: 'बहुत सुस्त, ढीला या बेहोश?', redFlag: true },
      { id: 'd6', en: 'Diarrhoea for more than 14 days?', hi: '14 दिन से ज़्यादा दस्त?', redFlag: true },
    ],
  },
]

// --- Universal Immunisation Programme (India), simplified schedule --------
// days = age in days when the dose is due. "window" = days of grace before
// it counts as overdue in the due-list.

export interface Vaccine {
  id: string
  days: number
  ageLabelEn: string
  ageLabelHi: string
  nameEn: string
  nameHi: string
  windowDays: number
}

export const VACCINES: Vaccine[] = [
  { id: 'bcg', days: 0, ageLabelEn: 'Birth', ageLabelHi: 'जन्म', nameEn: 'BCG', nameHi: 'बीसीजी', windowDays: 30 },
  { id: 'opv0', days: 0, ageLabelEn: 'Birth', ageLabelHi: 'जन्म', nameEn: 'OPV-0', nameHi: 'ओपीवी-0', windowDays: 14 },
  { id: 'hepb0', days: 0, ageLabelEn: 'Birth', ageLabelHi: 'जन्म', nameEn: 'Hepatitis B (birth dose)', nameHi: 'हेपेटाइटिस बी (जन्म खुराक)', windowDays: 1 },
  { id: 'penta1', days: 42, ageLabelEn: '6 weeks', ageLabelHi: '6 हफ़्ते', nameEn: 'Pentavalent-1 (DPT+HepB+Hib)', nameHi: 'पेंटावैलेंट-1', windowDays: 28 },
  { id: 'opv1', days: 42, ageLabelEn: '6 weeks', ageLabelHi: '6 हफ़्ते', nameEn: 'OPV-1', nameHi: 'ओपीवी-1', windowDays: 28 },
  { id: 'rota1', days: 42, ageLabelEn: '6 weeks', ageLabelHi: '6 हफ़्ते', nameEn: 'Rotavirus-1', nameHi: 'रोटावायरस-1', windowDays: 28 },
  { id: 'pcv1', days: 42, ageLabelEn: '6 weeks', ageLabelHi: '6 हफ़्ते', nameEn: 'PCV-1 (Pneumococcal)', nameHi: 'पीसीवी-1', windowDays: 28 },
  { id: 'penta2', days: 70, ageLabelEn: '10 weeks', ageLabelHi: '10 हफ़्ते', nameEn: 'Pentavalent-2', nameHi: 'पेंटावैलेंट-2', windowDays: 28 },
  { id: 'opv2', days: 70, ageLabelEn: '10 weeks', ageLabelHi: '10 हफ़्ते', nameEn: 'OPV-2', nameHi: 'ओपीवी-2', windowDays: 28 },
  { id: 'rota2', days: 70, ageLabelEn: '10 weeks', ageLabelHi: '10 हफ़्ते', nameEn: 'Rotavirus-2', nameHi: 'रोटावायरस-2', windowDays: 28 },
  { id: 'penta3', days: 98, ageLabelEn: '14 weeks', ageLabelHi: '14 हफ़्ते', nameEn: 'Pentavalent-3', nameHi: 'पेंटावैलेंट-3', windowDays: 28 },
  { id: 'opv3', days: 98, ageLabelEn: '14 weeks', ageLabelHi: '14 हफ़्ते', nameEn: 'OPV-3', nameHi: 'ओपीवी-3', windowDays: 28 },
  { id: 'rota3', days: 98, ageLabelEn: '14 weeks', ageLabelHi: '14 हफ़्ते', nameEn: 'Rotavirus-3', nameHi: 'रोटावायरस-3', windowDays: 28 },
  { id: 'pcv2', days: 98, ageLabelEn: '14 weeks', ageLabelHi: '14 हफ़्ते', nameEn: 'PCV-2', nameHi: 'पीसीवी-2', windowDays: 28 },
  { id: 'ipv1', days: 98, ageLabelEn: '14 weeks', ageLabelHi: '14 हफ़्ते', nameEn: 'IPV-1 (Injectable Polio)', nameHi: 'आईपीवी-1', windowDays: 28 },
  { id: 'mr1', days: 270, ageLabelEn: '9 months', ageLabelHi: '9 महीने', nameEn: 'MR-1 (Measles-Rubella)', nameHi: 'एमआर-1 (खसरा-रूबेला)', windowDays: 60 },
  { id: 'je1', days: 270, ageLabelEn: '9 months', ageLabelHi: '9 महीने', nameEn: 'JE-1 (Japanese Encephalitis)*', nameHi: 'जेई-1*', windowDays: 60 },
  { id: 'pcvb', days: 270, ageLabelEn: '9 months', ageLabelHi: '9 महीने', nameEn: 'PCV booster', nameHi: 'पीसीवी बूस्टर', windowDays: 60 },
  { id: 'je2', days: 365, ageLabelEn: '12 months', ageLabelHi: '12 महीने', nameEn: 'JE-2*', nameHi: 'जेई-2*', windowDays: 60 },
  { id: 'dptb1', days: 480, ageLabelEn: '16–24 months', ageLabelHi: '16–24 महीने', nameEn: 'DPT booster-1', nameHi: 'डीपीटी बूस्टर-1', windowDays: 180 },
  { id: 'mr2', days: 480, ageLabelEn: '16–24 months', ageLabelHi: '16–24 महीने', nameEn: 'MR-2', nameHi: 'एमआर-2', windowDays: 180 },
  { id: 'opvb', days: 480, ageLabelEn: '16–24 months', ageLabelHi: '16–24 महीने', nameEn: 'OPV booster', nameHi: 'ओपीवी बूस्टर', windowDays: 180 },
  { id: 'dptb2', days: 1825, ageLabelEn: '5–6 years', ageLabelHi: '5–6 साल', nameEn: 'DPT booster-2', nameHi: 'डीपीटी बूस्टर-2', windowDays: 365 },
  { id: 'tt10', days: 3650, ageLabelEn: '10 years', ageLabelHi: '10 साल', nameEn: 'TT (Tetanus)', nameHi: 'टीटी', windowDays: 365 },
  { id: 'tt16', days: 5840, ageLabelEn: '16 years', ageLabelHi: '16 साल', nameEn: 'TT (Tetanus)', nameHi: 'टीटी', windowDays: 365 },
]

// --- UI strings ------------------------------------------------------------

export type I18nKey =
  | 'tagline' | 'dashboard' | 'households' | 'visits' | 'triage' | 'vaccines' | 'referrals'
  | 'todayPlan' | 'addHousehold' | 'addVisit' | 'logVisit' | 'startTriage' | 'referNow'
  | 'noDanger' | 'demoData' | 'clearDemo' | 'exportStats' | 'language'
  | 'household' | 'village' | 'headOfFamily' | 'members' | 'name' | 'dob' | 'pregnant'
  | 'save' | 'cancel' | 'notes' | 'date' | 'outcome' | 'routine' | 'followUp'
  | 'dueNow' | 'overdue' | 'given' | 'markGiven' | 'child' | 'age'
  | 'referralSlip' | 'reason' | 'facility' | 'copySlip' | 'copied'
  | 'offlineNote' | 'disclaimer' | 'visitsLogged' | 'redFlags' | 'referralsMade' | 'vaccinesDue'

export const STRINGS: Record<I18nKey, { en: string; hi: string }> = {
  tagline: { en: 'Field agent for frontline health workers', hi: 'फ्रंटलाइन स्वास्थ्य कार्यकर्ताओं के लिए फील्ड एजेंट' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  households: { en: 'Households', hi: 'परिवार' },
  visits: { en: 'Visits', hi: 'मुलाकातें' },
  triage: { en: 'Triage', hi: 'जाँच' },
  vaccines: { en: 'Vaccines', hi: 'टीके' },
  referrals: { en: 'Referrals', hi: 'रेफरल' },
  todayPlan: { en: "Today's plan", hi: 'आज की योजना' },
  addHousehold: { en: 'Add household', hi: 'परिवार जोड़ें' },
  addVisit: { en: 'Add visit', hi: 'मुलाकात जोड़ें' },
  logVisit: { en: 'Log visit', hi: 'मुलाकात दर्ज करें' },
  startTriage: { en: 'Start triage', hi: 'जाँच शुरू करें' },
  referNow: { en: 'REFER NOW — go to a facility today', hi: 'अभी रेफर करें — आज ही अस्पताल जाएँ' },
  noDanger: { en: 'No danger sign found — routine care', hi: 'कोई खतरे का लक्षण नहीं — नियमित देखभाल' },
  demoData: { en: 'Demo data — sample village to try the app. Clear it to start fresh.', hi: 'डेमो डेटा — ऐप आज़माने के लिए नमूना गाँव। नए सिरे से शुरू करने के लिए हटाएँ।' },
  clearDemo: { en: 'Clear demo data', hi: 'डेमो डेटा हटाएँ' },
  exportStats: { en: 'Export impact stats (JSON)', hi: 'प्रभाव आँकड़े निर्यात करें (JSON)' },
  language: { en: 'Language', hi: 'भाषा' },
  household: { en: 'Household', hi: 'परिवार' },
  village: { en: 'Village', hi: 'गाँव' },
  headOfFamily: { en: 'Head of family', hi: 'परिवार प्रमुख' },
  members: { en: 'Members', hi: 'सदस्य' },
  name: { en: 'Name', hi: 'नाम' },
  dob: { en: 'Date of birth', hi: 'जन्म तिथि' },
  pregnant: { en: 'Pregnant', hi: 'गर्भवती' },
  save: { en: 'Save', hi: 'सहेजें' },
  cancel: { en: 'Cancel', hi: 'रद्द करें' },
  notes: { en: 'Notes', hi: 'टिप्पणी' },
  date: { en: 'Date', hi: 'तारीख' },
  outcome: { en: 'Outcome', hi: 'परिणाम' },
  routine: { en: 'Routine', hi: 'नियमित' },
  followUp: { en: 'Follow-up needed', hi: 'फॉलो-अप चाहिए' },
  dueNow: { en: 'Due now', hi: 'अभी देय' },
  overdue: { en: 'Overdue', hi: 'देर हो गई' },
  given: { en: 'Given', hi: 'दिया गया' },
  markGiven: { en: 'Mark given', hi: 'दिया गया चिह्नित करें' },
  child: { en: 'Child', hi: 'बच्चा' },
  age: { en: 'Age', hi: 'उम्र' },
  referralSlip: { en: 'Referral slip', hi: 'रेफरल पर्ची' },
  reason: { en: 'Reason', hi: 'कारण' },
  facility: { en: 'Facility', hi: 'सुविधा' },
  copySlip: { en: 'Copy slip text', hi: 'पर्ची कॉपी करें' },
  copied: { en: 'Copied!', hi: 'कॉपी हो गया!' },
  offlineNote: { en: 'Works fully offline — no internet, no account, no data leaves this phone.', hi: 'पूरी तरह ऑफ़लाइन चलता है — इंटरनेट नहीं, खाता नहीं, डेटा फ़ोन से बाहर नहीं जाता।' },
  disclaimer: { en: 'Decision support for trained ASHA workers, based on WHO IMNCI danger signs. Not a diagnosis, not a medical device. When in doubt, refer.', hi: 'प्रशिक्षित आशा कार्यकर्ताओं के लिए निर्णय सहायता, WHO IMNCI खतरे के लक्षणों पर आधारित। निदान नहीं, चिकित्सा उपकरण नहीं। संदेह हो तो रेफर करें।' },
  visitsLogged: { en: 'Visits logged', hi: 'मुलाकातें दर्ज' },
  redFlags: { en: 'Red flags found', hi: 'खतरे के लक्षण' },
  referralsMade: { en: 'Referrals made', hi: 'रेफरल किए' },
  vaccinesDue: { en: 'Vaccines due', hi: 'टीके देय' },
}

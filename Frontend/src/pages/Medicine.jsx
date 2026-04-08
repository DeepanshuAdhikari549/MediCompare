import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, AlertTriangle, Info, ChevronDown, ChevronUp, Pill } from 'lucide-react';

// ─── MEDICINE DATABASE ──────────────────────────────────────────
const MEDICINES = [
  {
    name: 'Paracetamol',
    aliases: ['acetaminophen', 'crocin', 'calpol', 'dolo', 'tylenol'],
    category: 'Analgesic / Antipyretic',
    uses: 'Reduces fever and relieves mild to moderate pain such as headache, toothache, backache, and muscle aches.',
    diseases: ['Fever', 'Headache', 'Toothache', 'Body ache', 'Common cold', 'Flu'],
    advantages: [
      'Safe for children and elderly when used correctly',
      'Widely available over-the-counter',
      'Does not cause stomach irritation like NSAIDs',
      'Effective for fever and mild-to-moderate pain',
      'Can be taken during pregnancy under doctor supervision',
    ],
    disadvantages: [
      'Overdose can cause severe liver damage — do NOT exceed 4g/day for adults',
      'Less effective for inflammation compared to ibuprofen',
      'Alcohol consumption increases liver risk significantly',
      'Not suitable for patients with liver disease',
    ],
    sideEffects: ['Nausea (rare)', 'Skin rash or allergic reaction (rare)', 'Liver damage on overdose'],
    dosage: 'Adults: 500mg–1g every 4–6 hrs. Max 4g/day. Children: weight-based (15 mg/kg per dose).',
    warning: 'Do NOT combine with alcohol. Check all other medications for hidden paracetamol content.',
  },
  {
    name: 'Ibuprofen',
    aliases: ['advil', 'brufen', 'nurofen', 'combiflam'],
    category: 'NSAID (Anti-inflammatory)',
    uses: 'Treats pain, inflammation, and fever. Commonly used for arthritis, menstrual cramps, headaches, dental pain.',
    diseases: ['Fever', 'Arthritis', 'Menstrual pain', 'Headache', 'Dental pain', 'Muscle pain', 'Back pain'],
    advantages: [
      'Reduces both pain AND inflammation (unlike paracetamol)',
      'Effective for period cramps and arthritis',
      'Works faster than paracetamol for inflammation',
      'Available OTC in low doses',
    ],
    disadvantages: [
      'Can irritate the stomach lining — take with food',
      'Not safe in last trimester of pregnancy',
      'May raise blood pressure with long-term use',
      'Avoid in kidney disease patients',
      'Increases risk of GI bleeding with prolonged use',
    ],
    sideEffects: ['Stomach upset', 'Nausea', 'Heartburn', 'Dizziness', 'Fluid retention', 'Increased BP'],
    dosage: 'Adults: 200–400mg every 4–6 hours. Max 1200mg/day OTC or 3200mg/day under prescription.',
    warning: 'Always take with food or milk. Avoid if you have a peptic ulcer or kidney issues.',
  },
  {
    name: 'Amoxicillin',
    aliases: ['augmentin', 'mox', 'trimox'],
    category: 'Antibiotic (Penicillin group)',
    uses: 'Treats bacterial infections of the ear, nose, throat, lungs, urinary tract, and skin.',
    diseases: ['Ear infection', 'Throat infection', 'Tonsillitis', 'Pneumonia', 'UTI', 'Dental abscess', 'Sinusitis'],
    advantages: [
      'Broad-spectrum antibiotic effective against many bacteria',
      'Generally well-tolerated',
      'Available in multiple forms (tablet, capsule, syrup)',
      'Low cost and widely available',
    ],
    disadvantages: [
      'Ineffective against viral infections (cold, flu)',
      'Can cause antibiotic resistance if overused',
      'Risk of allergic reaction (especially if penicillin-allergic)',
      'May cause diarrhea and gut flora disruption',
    ],
    sideEffects: ['Diarrhea', 'Nausea', 'Skin rash', 'Allergic reaction (hives, anaphylaxis in rare cases)'],
    dosage: 'Adults: 250–500mg 3 times daily for 5–10 days. Dose varies by infection severity.',
    warning: 'Must complete full course even if you feel better. Inform doctor of any penicillin allergy.',
  },
  {
    name: 'Cetirizine',
    aliases: ['zyrtec', 'cetzine', 'okacet', 'alerid'],
    category: 'Antihistamine',
    uses: 'Relieves allergy symptoms — runny nose, sneezing, itching, watery eyes, and hives.',
    diseases: ['Allergic rhinitis', 'Hay fever', 'Hives (urticaria)', 'Skin allergy', 'Dust allergy', 'Pet allergy'],
    advantages: [
      'Fast-acting allergy relief',
      'Non-drowsy at normal doses (compared to older antihistamines)',
      'Once-daily dosing',
      'Safe for long-term use under supervision',
    ],
    disadvantages: [
      'Can still cause drowsiness in some people',
      'Not recommended for children under 2',
      'Avoid operating heavy machinery if drowsy',
      'Avoid alcohol while taking',
    ],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Headache', 'Fatigue', 'Stomach pain (rare)'],
    dosage: 'Adults & children >6yrs: 10mg once daily. Under 6: consult doctor.',
    warning: 'Avoid alcohol. Do not drive if drowsy. Consult doctor if pregnant.',
  },
  {
    name: 'Metformin',
    aliases: ['glucophage', 'glycomet', 'formin'],
    category: 'Antidiabetic (Biguanide)',
    uses: 'First-line treatment for type 2 diabetes. Lowers blood sugar by reducing liver glucose production.',
    diseases: ['Type 2 Diabetes', 'Pre-diabetes', 'PCOS'],
    advantages: [
      'Does not cause hypoglycemia on its own',
      'May help with weight management',
      'Reduces cardiovascular risk in diabetics',
      'Inexpensive and well-studied',
      'Also used in PCOS management',
    ],
    disadvantages: [
      'Common GI side effects especially at start',
      'Must be stopped before certain imaging procedures (contrast dye)',
      'Not for severe kidney/liver disease',
      'Rarely causes lactic acidosis (serious but very rare)',
      'Requires regular kidney function monitoring',
    ],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Loss of appetite', 'Metallic taste (rare)'],
    dosage: 'Start 500mg twice daily with meals. Titrate up to 2000–2500mg/day as needed.',
    warning: 'Take with food. Regular blood sugar and kidney tests needed. Report unusual fatigue or muscle pain.',
  },
  {
    name: 'Omeprazole',
    aliases: ['prilosec', 'omez', 'ocid', 'losec'],
    category: 'Proton Pump Inhibitor (PPI)',
    uses: 'Reduces stomach acid. Used for acidity, acid reflux (GERD), peptic ulcers, and heartburn.',
    diseases: ['Acidity', 'GERD', 'Acid reflux', 'Peptic ulcer', 'Heartburn', 'Stomach ulcer', 'H. pylori infection'],
    advantages: [
      'Highly effective acid suppression',
      'Heals esophageal damage from acid reflux',
      'Protects stomach lining with NSAID use',
      'Taken once daily before meals',
    ],
    disadvantages: [
      'Not meant for long-term use without monitoring',
      'Can reduce calcium/magnesium absorption over time',
      'May mask symptoms of stomach cancer',
      'Increased risk of C. difficile infection',
      'Dependency can develop with prolonged use',
    ],
    sideEffects: ['Headache', 'Nausea', 'Diarrhea', 'Constipation', 'Bone density loss (long-term)'],
    dosage: 'Adults: 20–40mg once daily before meals for 4–8 weeks. Long-term only under doctor supervision.',
    warning: 'Take 30 min before food. Do not crush delayed-release capsules. Avoid without indication.',
  },
  {
    name: 'Azithromycin',
    aliases: ['zithromax', 'azee', 'azithral', 'z-pack'],
    category: 'Antibiotic (Macrolide)',
    uses: 'Treats respiratory infections, skin infections, STIs, and ear infections caused by bacteria.',
    diseases: ['Pneumonia', 'Bronchitis', 'Sinusitis', 'Ear infection', 'Strep throat', 'Typhoid', 'Chlamydia'],
    advantages: [
      'Short 3–5 day course for most infections',
      'Once-daily dosing is convenient',
      'Good alternative for penicillin-allergic patients',
      'Works against atypical bacteria (Mycoplasma, Chlamydia)',
    ],
    disadvantages: [
      'Risk of cardiac arrhythmia (QT prolongation)',
      'Not for patients with heart rhythm problems',
      'Growing antibiotic resistance',
      'Should not be overused',
    ],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach pain', 'Headache', 'Heart palpitations (rare)'],
    dosage: 'Adults: 500mg on Day 1, then 250mg Days 2–5. Some infections need different regimens.',
    warning: 'Inform doctor of any heart conditions. Do not take antacids within 2 hrs of azithromycin.',
  },
  {
    name: 'Loperamide',
    aliases: ['imodium', 'eldoper', 'lopemide'],
    category: 'Antidiarrheal',
    uses: 'Controls and relieves acute diarrhea and traveler\'s diarrhea.',
    diseases: ['Diarrhea', 'Traveler\'s diarrhea', 'Irritable bowel syndrome (mild)'],
    advantages: [
      'Fast relief from diarrhea',
      'Available OTC',
      'Reduces frequency of bowel movements quickly',
    ],
    disadvantages: [
      'Not for use in bloody diarrhea or high fever',
      'Can worsen bacterial diarrhea if used improperly',
      'Avoid in children under 2 without medical advice',
      'Drug abuse potential at very high doses',
    ],
    sideEffects: ['Constipation', 'Stomach cramping', 'Nausea', 'Dizziness'],
    dosage: 'Adults: 4mg initially, then 2mg after each loose stool. Max 16mg/day.',
    warning: 'Drink fluids to avoid dehydration. Seek doctor if diarrhea lasts >2 days or blood is present.',
  },
  {
    name: 'Amlodipine',
    aliases: ['norvasc', 'amlong', 'stamlo', 'amlip'],
    category: 'Calcium Channel Blocker (Antihypertensive)',
    uses: 'Treats high blood pressure (hypertension) and chest pain (angina).',
    diseases: ['Hypertension', 'High blood pressure', 'Angina', 'Coronary artery disease'],
    advantages: [
      'Once-daily dosing',
      'Long-acting, consistent blood pressure control',
      'Well-tolerated in most patients',
      'Can be used even in kidney disease',
    ],
    disadvantages: [
      'May cause ankle swelling (edema)',
      'Grapefruit juice can increase drug levels — avoid',
      'Dizziness on standing (first few doses)',
      'Not for acute angina attacks',
    ],
    sideEffects: ['Ankle swelling', 'Flushing', 'Dizziness', 'Headache', 'Palpitations'],
    dosage: 'Adults: 5–10mg once daily. Start at 2.5mg in elderly or liver disease patients.',
    warning: 'Do not stop suddenly. Avoid grapefruit. Rise slowly from sitting/lying to prevent dizziness.',
  },
  {
    name: 'Pantoprazole',
    aliases: ['pantop', 'pan-d', 'protonix', 'pantocid'],
    category: 'Proton Pump Inhibitor (PPI)',
    uses: 'Reduces stomach acid, treats GERD, erosive esophagitis, and stomach/duodenal ulcers.',
    diseases: ['Acidity', 'GERD', 'Peptic ulcer', 'Heartburn', 'Acid reflux', 'Barrett\'s esophagus'],
    advantages: [
      'More acid-stable than omeprazole in some patients',
      'Fewer drug interactions than other PPIs',
      'Effective for both short and long-term use',
      'Available in IV form for hospital use',
    ],
    disadvantages: [
      'Same long-term risks as all PPIs (bone density, nutrition)',
      'Not for immediate heartburn relief (needs days to work)',
      'Overuse is very common and problematic',
    ],
    sideEffects: ['Headache', 'Diarrhea', 'Nausea', 'Flatulence', 'Abdominal pain'],
    dosage: 'Adults: 40mg once daily before breakfast. Duration as per condition (4–8 weeks).',
    warning: 'Take 30–60 min before food. Do not use for >8 weeks without medical review.',
  },
];

// ─── DISEASE GUIDE ──────────────────────────────────────────────
const DISEASE_GUIDE = [
  {
    disease: 'Fever',
    emoji: '🌡️',
    description: 'Body temperature above 38°C (100.4°F). Usually a response to infection.',
    firstLine: ['Paracetamol', 'Ibuprofen'],
    tips: 'Stay hydrated. Rest. Use cool compresses. See a doctor if fever is above 39.5°C or lasts >3 days.',
    avoidSelfMedicating: 'Antibiotics — fever is usually viral; antibiotics are not needed unless prescribed.',
  },
  {
    disease: 'Common Cold',
    emoji: '🤧',
    description: 'Viral infection causing runny nose, sore throat, sneezing, and mild fever.',
    firstLine: ['Paracetamol', 'Cetirizine'],
    tips: 'Rest, drink warm fluids, steam inhalation helps. Most colds resolve in 7–10 days.',
    avoidSelfMedicating: 'Antibiotics — colds are caused by viruses, not bacteria. Antibiotics will NOT help.',
  },
  {
    disease: 'Headache',
    emoji: '🤕',
    description: 'Pain in the head or neck region. Can be tension-type, migraine, or secondary to another cause.',
    firstLine: ['Paracetamol', 'Ibuprofen'],
    tips: 'Rest in a quiet dark room, stay hydrated. Identify and avoid triggers (stress, screen time, lack of sleep).',
    avoidSelfMedicating: 'Heavy painkillers like opioids without prescription.',
  },
  {
    disease: 'Acidity / Heartburn',
    emoji: '🔥',
    description: 'Burning sensation in the chest or throat caused by stomach acid reflux.',
    firstLine: ['Omeprazole', 'Pantoprazole'],
    tips: 'Eat small meals. Avoid spicy/oily food, coffee, alcohol. Don\'t lie down right after eating.',
    avoidSelfMedicating: 'Frequent antacids without addressing the root cause.',
  },
  {
    disease: 'Diarrhea',
    emoji: '💧',
    description: 'Frequent loose or watery stools, often caused by infection, food, or stress.',
    firstLine: ['Loperamide'],
    tips: 'Most important: drink ORS (oral rehydration salts) to replace fluids and electrolytes. Eat light foods (bananas, rice, toast).',
    avoidSelfMedicating: 'Antibiotics unless specifically prescribed — most diarrhea is viral or self-limiting.',
  },
  {
    disease: 'Allergic Rhinitis / Hay Fever',
    emoji: '🌸',
    description: 'Sneezing, runny/itchy nose, watery eyes caused by allergens (dust, pollen, pet dander).',
    firstLine: ['Cetirizine'],
    tips: 'Identify and avoid your triggers. Use air purifiers and keep windows closed during high pollen days.',
    avoidSelfMedicating: 'Decongestant nasal sprays used >3 days (can cause rebound congestion).',
  },
  {
    disease: 'Type 2 Diabetes',
    emoji: '🩸',
    description: 'High blood sugar due to insulin resistance or insufficient insulin production.',
    firstLine: ['Metformin'],
    tips: 'Lifestyle changes (diet + exercise) are equally important. Monitor blood glucose regularly.',
    avoidSelfMedicating: 'Never adjust diabetes medication dose without your doctor\'s guidance.',
  },
  {
    disease: 'High Blood Pressure',
    emoji: '❤️',
    description: 'Blood pressure consistently ≥130/80 mmHg. A silent but serious condition.',
    firstLine: ['Amlodipine'],
    tips: 'Reduce salt, exercise regularly, avoid smoking and alcohol, manage stress. Monitor BP at home.',
    avoidSelfMedicating: 'Do NOT skip doses. Stopping suddenly can be dangerous.',
  },
  {
    disease: 'Bacterial Throat Infection',
    emoji: '🦠',
    description: 'Sore throat with red tonsils, white patches, pain on swallowing. Often caused by Streptococcus.',
    firstLine: ['Amoxicillin', 'Azithromycin'],
    tips: 'Warm salt-water gargles help soothe symptoms. Take the full antibiotic course even if feeling better.',
    avoidSelfMedicating: 'Always confirm bacterial infection with a doctor before taking antibiotics.',
  },
];

// ─── SEARCH LOGIC ───────────────────────────────────────────────
function searchMedicines(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  return MEDICINES.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.aliases.some(a => a.includes(q)) ||
    m.category.toLowerCase().includes(q) ||
    m.diseases.some(d => d.toLowerCase().includes(q)) ||
    m.uses.toLowerCase().includes(q)
  );
}

function searchDiseases(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  return DISEASE_GUIDE.filter(d =>
    d.disease.toLowerCase().includes(q) ||
    d.description.toLowerCase().includes(q) ||
    d.firstLine.some(m => m.toLowerCase().includes(q))
  );
}

// ─── COMPONENTS ─────────────────────────────────────────────────
function MedicineCard({ med }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        className="w-full text-left p-5 flex items-start gap-4"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-800">
          <Pill className="w-5 h-5 text-sky-600 dark:text-sky-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{med.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-medium">{med.category}</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{med.uses}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {med.diseases.slice(0, 4).map(d => (
              <span key={d} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">{d}</span>
            ))}
            {med.diseases.length > 4 && <span className="text-xs text-slate-400">+{med.diseases.length - 4} more</span>}
          </div>
        </div>
        <div className="shrink-0 text-slate-400">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
          >
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Advantages */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400 text-sm uppercase tracking-wide">
                  <CheckCircle className="w-4 h-4" /> Advantages
                </h4>
                <ul className="space-y-1.5">
                  {med.advantages.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-500 mt-0.5 shrink-0">✓</span> {a}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disadvantages */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400 text-sm uppercase tracking-wide">
                  <XCircle className="w-4 h-4" /> Disadvantages
                </h4>
                <ul className="space-y-1.5">
                  {med.disadvantages.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-red-500 mt-0.5 shrink-0">✗</span> {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Side Effects */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400 text-sm uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4" /> Side Effects
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {med.sideEffects.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800">{s}</span>
                  ))}
                </div>
              </div>

              {/* Dosage */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 text-sm uppercase tracking-wide">
                  <Info className="w-4 h-4" /> Dosage
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">{med.dosage}</p>
              </div>

              {/* Warning */}
              <div className="md:col-span-2 flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/15 border border-red-100 dark:border-red-900/40">
                <span className="text-xl shrink-0">⚠️</span>
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{med.warning}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DiseaseCard({ d }) {
  return (
    <motion.div
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl shrink-0">{d.emoji}</span>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{d.disease}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{d.description}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Recommended:</span>
          {d.firstLine.map(m => (
            <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-700/40">💊 {m}</span>
          ))}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium text-sky-600 dark:text-sky-400">Tip: </span>{d.tips}
        </p>
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900/30">
          <span className="text-amber-500 shrink-0">⚠️</span>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            <strong>Avoid self-medicating with:</strong> {d.avoidSelfMedicating}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────
export default function Medicine() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [tab, setTab] = useState('medicine'); // 'medicine' | 'disease'
  const inputRef = useRef(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const medicineResults = searchMedicines(query);
  const diseaseResults = searchDiseases(query);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query.trim() });
    else setSearchParams({});
  };

  const handleQueryTag = (q) => {
    setQuery(q);
    setSearchParams({ q });
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const QUICK_TAGS = ['Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Fever', 'Cold', 'Acidity', 'Allergy', 'Diabetes'];

  return (
    <div className="min-h-[80vh] bg-slate-50 dark:bg-[#0B1120]">
      {/* HERO */}
      <div className="bg-gradient-to-b from-emerald-50 to-slate-50 dark:from-emerald-950/30 dark:to-[#0B1120] border-b border-slate-200 dark:border-slate-800 pb-8 pt-10">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-800/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-4">
            💊 Medicine Search
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            Search Any Medicine
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
            Find uses, side effects, advantages, disadvantages & dosage. Or search by disease for medicine recommendations.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className="flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/40 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by medicine name, disease, symptom..."
              className="flex-1 px-4 py-4 bg-transparent text-slate-900 dark:text-white text-base focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="m-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
            >
              Search
            </button>
          </form>

          {/* QUICK TAGS */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {QUICK_TAGS.map(t => (
              <button
                key={t}
                onClick={() => handleQueryTag(t)}
                className="text-sm px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 transition-all"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="container mx-auto px-4 max-w-4xl py-8">
        {/* TABS */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit mb-8">
          <button
            onClick={() => setTab('medicine')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'medicine' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            💊 Medicine Info
          </button>
          <button
            onClick={() => setTab('disease')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'disease' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            🏥 Disease Guide
          </button>
        </div>

        {/* MEDICINE TAB */}
        {tab === 'medicine' && (
          <div>
            {query.trim() ? (
              medicineResults.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {medicineResults.length} result{medicineResults.length !== 1 ? 's' : ''} for <strong>"{query}"</strong> — click a result to expand details
                  </p>
                  {medicineResults.map(med => <MedicineCard key={med.name} med={med} />)}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                  <div className="text-5xl mb-4">💊</div>
                  <p className="text-lg font-medium mb-2">No medicine found for "{query}"</p>
                  <p className="text-sm">Try a generic name, disease name, or common brand name</p>
                </div>
              )
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">All Medicines in Database</p>
                {MEDICINES.map(med => <MedicineCard key={med.name} med={med} />)}
              </div>
            )}
          </div>
        )}

        {/* DISEASE TAB */}
        {tab === 'disease' && (
          <div>
            {query.trim() ? (
              diseaseResults.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {diseaseResults.length} result{diseaseResults.length !== 1 ? 's' : ''} for <strong>"{query}"</strong>
                  </p>
                  {diseaseResults.map(d => <DiseaseCard key={d.disease} d={d} />)}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                  <div className="text-5xl mb-4">🏥</div>
                  <p className="text-lg font-medium mb-2">No disease found for "{query}"</p>
                  <p className="text-sm">Try searching: fever, cold, headache, diabetes, allergy, acidity</p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DISEASE_GUIDE.map(d => <DiseaseCard key={d.disease} d={d} />)}
              </div>
            )}
          </div>
        )}

        {/* DISCLAIMER */}
        <div className="mt-12 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-900/40 text-sm text-amber-800 dark:text-amber-300">
          <strong>⚠️ Medical Disclaimer:</strong> This information is for general awareness only and does not replace professional medical advice. Always consult a licensed doctor or pharmacist before starting, stopping, or changing any medication.
        </div>
      </div>
    </div>
  );
}

export interface ScienceTerm {
  en: string;
  am: string;
  category: "Mechanics" | "Electricity & Magnetism" | "Thermodynamics" | "Waves & Optics" | "General Science";
}

export const SCIENCE_GLOSSARY: ScienceTerm[] = [
  { en: "Force", am: "ኃይል (Hayl)", category: "Mechanics" },
  { en: "Mass", am: "መጠነ-ቁስ (Metene-Qus)", category: "Mechanics" },
  { en: "Velocity", am: "ፍጥነት (Fiti-net)", category: "Mechanics" },
  { en: "Acceleration", am: "ሽምጥጥ / አክስለሬሽን (Shimtit)", category: "Mechanics" },
  { en: "Gravity", am: "ስበት (Siblet / Sibet)", category: "Mechanics" },
  { en: "Friction", am: "ሰበቃ (Sebeqa)", category: "Mechanics" },
  { en: "Energy", am: "ጉልበት / ኢነርጂ (Gulbet)", category: "Mechanics" },
  { en: "Work", am: "ሥራ (Sira)", category: "Mechanics" },
  { en: "Power", am: "አቅም (Aqim)", category: "Mechanics" },
  { en: "Momentum", am: "እንቅስቃሴያዊ ጉልበት (Momentum)", category: "Mechanics" },
  { en: "Electric Current", am: "የኤሌክትሪክ ፍሰት (Ye-Electric Fiset)", category: "Electricity & Magnetism" },
  { en: "Voltage", am: "ቮልቴጅ / የቮልቴጅ ልዩነት (Voltage)", category: "Electricity & Magnetism" },
  { en: "Resistance", am: "ተቃውሞ (Teqawmo)", category: "Electricity & Magnetism" },
  { en: "Magnetic Field", am: "መግነጢሳዊ መስክ (Megnetisawi Mesk)", category: "Electricity & Magnetism" },
  { en: "Temperature", am: "የሙቀት መጠን (Yemuqet Meten)", category: "Thermodynamics" },
  { en: "Heat", am: "ሙቀት (Muqet)", category: "Thermodynamics" },
  { en: "Pressure", am: "ግፊት (Gifit)", category: "Thermodynamics" },
  { en: "Frequency", am: "ድግግሞሽ (Digigmosh)", category: "Waves & Optics" },
  { en: "Wavelength", am: "የሞገድ ርዝመት (Yemoged Rizmet)", category: "Waves & Optics" },
  { en: "Light Reflection", am: "የብርሃን ነጸብራቅ (Ye-Birhan Netsebraq)", category: "Waves & Optics" },
  { en: "Density", am: "ጥግግት (Tigigit)", category: "General Science" },
  { en: "Volume", am: "ይዘት (Yizet)", category: "General Science" },
  { en: "Experiment", am: "ሙከራ (Mukera)", category: "General Science" },
  { en: "Hypothesis", am: "ግምተ-ሐሳብ (Gimte-Hasab)", category: "General Science" },
];

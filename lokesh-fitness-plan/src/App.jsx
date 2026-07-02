import { useState, useEffect } from "react";
import "./index.css";

const accent = "var(--accent)";
const green = "var(--green)";
const red = "var(--red)";
const blue = "var(--blue)";
const yellow = "var(--yellow)";
const purple = "var(--purple)";

const Section = ({ title, icon, color = accent, children, id, delay = "" }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={`card fade-in-up ${delay}`} id={id} style={{ marginBottom: 32 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          background: `linear-gradient(90deg, var(--bg-surface), #141414)`,
          border: "none", padding: "20px 24px", cursor: "pointer",
          borderLeft: `4px solid ${color}`, textAlign: "left",
          transition: "background 0.3s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = `linear-gradient(90deg, #1f1f1f, #141414)`}
        onMouseLeave={(e) => e.currentTarget.style.background = `linear-gradient(90deg, var(--bg-surface), #141414)`}
      >
        <span style={{ fontSize: 24 }}>{icon}</span>
        <span className="bebas" style={{ color: "#fff", fontSize: 22, flex: 1 }}>{title}</span>
        <span style={{ color: color, fontSize: 16, fontWeight: 700, transition: 'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      <div className={`accordion-content ${open ? 'open' : ''}`}>
        <div className="accordion-inner">
          <div style={{ padding: "24px", color: "var(--text-muted)", fontSize: "15px" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const Macro = ({ label, value, unit, color, pct }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    setTimeout(() => setWidth(pct), 300);
  }, [pct]);

  return (
    <div className="interactive-card" style={{ flex: 1, minWidth: 140, padding: "20px", textAlign: "center" }}>
      <div className="bebas" style={{ color, fontSize: 32 }}>{value}<span style={{fontSize: 20}}>{unit}</span></div>
      <div style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ marginTop: 12, background: "rgba(255,255,255,0.05)", borderRadius: 99, height: 6, overflow: "hidden" }}>
        <div style={{ width: `${width}%`, background: color, height: "100%", borderRadius: 99, transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </div>
      <div style={{ color: "var(--text-dim)", fontSize: 11, marginTop: 6, fontWeight: 600 }}>{pct}% OF CALORIES</div>
    </div>
  );
};

const MealCard = ({ time, name, icon, foods, calories, protein, note, color = accent }) => (
  <div className="interactive-card" style={{ padding: "20px", marginBottom: 16, borderLeft: `3px solid ${color}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ color: "var(--text-dim)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>{time}</div>
        <div className="bebas" style={{ color: "#fff", fontSize: 22, marginTop: 4 }}>{icon} {name}</div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <span style={{ background: "rgba(249, 115, 22, 0.1)", color: accent, borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 700, border: `1px solid rgba(249, 115, 22, 0.2)` }}>~{calories} kcal</span>
        <span style={{ background: "rgba(34, 197, 94, 0.1)", color: green, borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 700, border: `1px solid rgba(34, 197, 94, 0.2)` }}>~{protein}g pro</span>
      </div>
    </div>
    <ul style={{ margin: "16px 0 0 0", paddingLeft: 20 }}>
      {foods.map((f, i) => <li key={i} style={{ color: "#d1d5db", fontSize: 14.5, marginBottom: 8 }}>{f}</li>)}
    </ul>
    {note && (
      <div style={{ marginTop: 16, background: "rgba(234, 179, 8, 0.05)", borderRadius: 8, padding: "12px 16px", color: "#bbb", fontSize: 13.5, borderLeft: `2px solid ${yellow}` }}>
        <span style={{marginRight: 6}}>💡</span>{note}
      </div>
    )}
  </div>
);

const Chip = ({ text, color }) => (
  <span style={{ display: "inline-block", background: `color-mix(in srgb, ${color} 15%, transparent)`, color, borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 600, margin: "4px 6px 4px 0", border: `1px solid color-mix(in srgb, ${color} 30%, transparent)` }}>{text}</span>
);

const WorkoutDay = ({ day, type, exercises, color }) => (
  <div className="interactive-card" style={{ padding: "20px", marginBottom: 16, borderTop: `3px solid ${color}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
      <span className="bebas" style={{ color: "#fff", fontSize: 22 }}>{day}</span>
      <Chip text={type} color={color} />
    </div>
    <ul style={{ margin: 0, paddingLeft: 20 }}>
      {exercises.map((e, i) => <li key={i} style={{ color: "#d1d5db", fontSize: 14.5, marginBottom: 8 }}>{e}</li>)}
    </ul>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState("diet");
  const tabs = [
    { id: "diet", label: "🥗 Diet Plan" },
    { id: "workout", label: "💪 Workout" },
    { id: "lifestyle", label: "🌙 Lifestyle" },
    { id: "mindset", label: "🧠 Mindset" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, #0a0a0a 0%, #170a00 50%, #0a0a0a 100%)`,
        borderBottom: `1px solid var(--border-color)`, padding: "64px 24px 48px", textAlign: "center",
        position: "relative", overflow: "hidden"
      }}>
        <div className="hero-glow" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="fade-in-up" style={{ display: "inline-block", background: "rgba(249, 115, 22, 0.1)", color: accent, borderRadius: 99, padding: "8px 20px", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20, border: `1px solid rgba(249, 115, 22, 0.3)` }}>
            🔬 Science-Based Personalized Plan
          </div>
          <h1 className="bebas fade-in-up delay-1" style={{ fontSize: "clamp(48px, 10vw, 80px)", color: "#fff", margin: "0 0 12px", lineHeight: 1 }}>
            LOKESH'S <span className="glow-text" style={{ color: accent }}>FAT LOSS</span> PLAN
          </h1>
          <p className="fade-in-up delay-2" style={{ color: "var(--text-muted)", fontSize: 16, margin: "0 0 32px", fontWeight: 500 }}>
            21 yrs • 82kg • 5'8" • Gym Beginner-Intermediate • South Indian Diet
          </p>

          {/* Stats Row */}
          <div className="fade-in-up delay-3" style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", maxWidth: 800, margin: "0 auto" }}>
            {[
              { label: "Maintenance", val: "2,650 kcal", color: blue },
              { label: "Fat Loss Target", val: "2,150 kcal", color: accent },
              { label: "Deficit", val: "~500 kcal/day", color: green },
              { label: "Weekly Loss Goal", val: "0.5–0.75 kg", color: purple },
            ].map((s, i) => (
              <div key={i} className="interactive-card" style={{ padding: "16px 24px", textAlign: "center", flex: "1 1 160px" }}>
                <div className="bebas" style={{ color: s.color, fontSize: 26 }}>{s.val}</div>
                <div style={{ color: "var(--text-dim)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-nav">
        <div style={{ display: "flex", maxWidth: 900, margin: "0 auto", overflowX: "auto", padding: "0 16px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`tab-button ${activeTab === t.id ? 'active' : ''}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>

        {/* ===== DIET TAB ===== */}
        {activeTab === "diet" && <div className="fade-in-up">

          <Section title="CALORIE & MACRO SCIENCE" icon="🔬" color={blue}>
            <p style={{ marginTop: 0, fontSize: 15.5 }}>
              Using the <strong style={{ color: "#fff" }}>Mifflin-St Jeor equation</strong> for your stats:<br /><br />
              BMR = (10 × 82) + (6.25 × 172.7) − (5 × 21) + 5 = <strong style={{ color: blue }}>~1,887 kcal</strong><br />
              With moderate gym activity (1.4 TDEE multiplier): Maintenance = <strong style={{ color: blue }}>~2,650 kcal</strong><br />
              Fat loss target (500 kcal deficit) = <strong style={{ color: accent }}>2,150 kcal/day</strong>
            </p>
            <div style={{ background: "rgba(234, 179, 8, 0.05)", borderRadius: 12, padding: "16px 20px", margin: "24px 0", borderLeft: `3px solid ${yellow}`, color: "#d1d5db" }}>
              ⚠️ Never go below 1,800 kcal as a beginner — muscle loss risk skyrockets. The goal is fat loss, not starvation.
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Macro label="Protein (High - Muscle Preservation)" value="160" unit="g" color={green} pct={30} />
              <Macro label="Carbs (Energy + Performance)" value="215" unit="g" color={blue} pct={40} />
              <Macro label="Fats (Hormones + Satiety)" value="55" unit="g" color={yellow} pct={23} />
            </div>
            <p style={{ marginBottom: 0, marginTop: 24, color: "var(--text-muted)", fontSize: 14 }}>
              📌 At 21, testosterone is high — this is your <strong style={{ color: "#fff" }}>golden window</strong> for body recomposition. You CAN lose fat and build muscle simultaneously as a beginner if you eat right and train hard.
            </p>
          </Section>

          <Section title="FULL DAILY MEAL PLAN" icon="🍽️" color={accent} delay="delay-1">
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "14px 20px", marginBottom: 24, fontSize: 14, color: "var(--text-muted)", textAlign: "center", fontWeight: 500 }}>
              Total Target: ~2,150 kcal | ~160g protein | ~215g carbs | ~55g fat
            </div>

            <MealCard
              time="7:00 – 7:30 AM"
              name="Breakfast"
              icon="🌅"
              calories={450}
              protein={35}
              foods={[
                "4 whole eggs scrambled / omelette cooked in ½ tsp ghee with onion, tomato, green chili",
                "2 medium-sized idlis OR 1 medium chapati (multigrain preferred)",
                "1 cup low-fat curd (200g)",
                "1 small banana OR 5 soaked almonds + 2 walnuts",
              ]}
              note="Eggs are your best friend — cheap, complete protein (6g each), and filling. The yolk has Vitamin D and healthy fats that support testosterone."
            />

            <MealCard
              time="10:30 AM"
              name="Mid-Morning Snack"
              icon="🥤"
              calories={200}
              protein={20}
              color={blue}
              foods={[
                "1 scoop whey protein in water (skip if not using supplements) OR",
                "Option B: 1 cup boiled chana (chickpeas) with lemon + salt (25g carbs, 10g protein)",
                "1 seasonal fruit — guava, papaya, orange, or apple",
              ]}
              note="This prevents muscle breakdown between breakfast and lunch. Don't skip — hunger between meals leads to overeating at lunch."
            />

            <MealCard
              time="1:00 – 1:30 PM"
              name="Lunch"
              icon="🍛"
              calories={600}
              protein={45}
              color={green}
              foods={[
                "150g cooked chicken (grilled/curry — no creamy gravies) OR 200g paneer (for veg days)",
                "1.5 cups cooked rice (prefer boiled rice cooled for 30 min — this increases resistant starch, lowering glycemic impact)",
                "2 cups mixed sabzi (palak, methi, cauliflower, beans — any) with minimal oil",
                "1 bowl sambar (lentil-based — dal is high in protein + fiber)",
                "Salad: cucumber, tomato, onion with lemon — unlimited",
              ]}
              note="South Indian rice + sambar combo is actually very balanced. The dal gives protein, rice gives energy. The issue is portion size — stick to 1.5 cups cooked rice maximum."
            />

            <MealCard
              time="4:00 PM (45–60 min pre-workout)"
              name="Pre-Workout Meal"
              icon="⚡"
              calories={300}
              protein={20}
              color={yellow}
              foods={[
                "1 cup oats cooked with water + 1 tsp honey + 1 banana sliced in",
                "OR 2 chapatis + 1 cup curd",
                "1 black coffee (NO sugar) — natural fat-burning + performance enhancer",
              ]}
              note="This is your fuel tank. Carbs here power your workout. Don't train fasted as a beginner — you'll underperform and burn muscle."
            />

            <MealCard
              time="6:30–7:00 PM (within 45 min post-workout)"
              name="Post-Workout Meal"
              icon="💪"
              calories={380}
              protein={40}
              color={purple}
              foods={[
                "Whey protein shake (30g) in 250ml skim milk OR",
                "Option B (no whey): 4 egg whites + 1 whole egg scrambled + 1 chapati",
                "Option C: 200g low-fat paneer with 1 small bowl rice",
                "½ banana or 1 small fruit for glycogen replenishment",
              ]}
              note="The post-workout window is real — muscle protein synthesis peaks here. High protein, moderate carbs, minimal fat to speed digestion."
            />

            <MealCard
              time="9:00 – 9:30 PM"
              name="Dinner"
              icon="🌙"
              calories={420}
              protein={35}
              color={blue}
              foods={[
                "100–120g grilled/baked chicken OR 150g fish (rohu, tilapia — cheap in India) OR 3 eggs",
                "2 chapatis (multigrain/wheat) OR 1 cup cooked rice (reduce rice at dinner)",
                "Large bowl cooked vegetables — palak dal, rasam, mixed sabzi",
                "1 cup curd (probiotic — improves gut health + sleep quality)",
              ]}
              note="Keep dinner lighter on carbs. The body is less insulin sensitive at night. More protein, more vegetables, fewer carbs = better fat burning while you sleep."
            />

            <div className="interactive-card" style={{ padding: "20px", marginTop: 16, borderLeft: `3px solid ${purple}` }}>
              <div style={{ color: "#fff", fontWeight: 700, marginBottom: 8, fontSize: 16 }}>🌙 Before Bed (optional but recommended)</div>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>1 cup warm low-fat milk + a pinch of turmeric. Milk contains casein protein — slow-digesting, it feeds your muscles through the night. This is why your grandma recommended haldi doodh and she was scientifically right.</p>
            </div>
          </Section>

          <Section title="FOODS TO AVOID" icon="🚫" color={red} delay="delay-2">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {[
                "Maida (white flour)", "Samosas / Kachori", "Sugary chai (3x/day)", "Cold drinks / Coke / Pepsi",
                "Fried snacks", "Biscuits / Parle-G", "Maggi / Instant noodles", "Butter naan", "Sweets / Mithai",
                "Chips / Namkeen", "Juice packets", "White bread", "Alcohol", "Excessive ghee"
              ].map((f, i) => <Chip key={i} text={`✗ ${f}`} color={red} />)}
            </div>
            <div style={{ background: "rgba(239, 68, 68, 0.05)", borderRadius: 12, padding: "16px 20px", fontSize: 14, color: "#d1d5db", borderLeft: `2px solid ${red}` }}>
              <strong style={{ color: "#fff" }}>Why these specifically?</strong> These foods are calorie-dense with almost zero protein or fiber — they spike insulin hard, promote fat storage in the belly area specifically, and leave you hungry again in 1 hour. One samosa = 250+ calories and zero satiety. One 200g Maggi = 350 empty calories.
            </div>
          </Section>

          <Section title="HEALTHY ALTERNATIVES" icon="🔄" color={green} delay="delay-3">
            {[
              { craving: "Chips craving", fix: "Roasted makhana (foxnuts) with chaat masala — 100 cal, 4g protein, crunchy satisfaction" },
              { craving: "Sweet craving (sugar rush)", fix: "1 banana + 5 peanuts OR dark chocolate (70%+, 1–2 squares)" },
              { craving: "Cold drink urge", fix: "Nimbu pani (no sugar, black salt) OR buttermilk (chaas) — cooling, zero calorie" },
              { craving: "Biscuits / snacking", fix: "Boiled eggs (2) or boiled chana — kills hunger for 3 hours" },
              { craving: "Biryani craving", fix: "Chicken + rice meal from plan above — same satisfaction, 3x the protein" },
              { craving: "Ice cream urge", fix: "Frozen banana blended = 'nice cream' or Greek curd with honey" },
              { craving: "Late night hunger", fix: "Warm milk OR cucumber salad with chaat masala — fills you, zero impact" },
            ].map((item, i) => (
              <div key={i} className="interactive-card" style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-start", padding: "16px" }}>
                <span style={{ color: red, fontWeight: 700, fontSize: 18, background: "rgba(239,68,68,0.1)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>✗</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--text-dim)", fontSize: 13, textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>{item.craving}</div>
                  <div style={{ color: "#fff", fontSize: 15 }}><span style={{ color: green, marginRight: 6 }}>✓</span> {item.fix}</div>
                </div>
              </div>
            ))}
          </Section>

          <Section title="WEEKLY CHEAT MEAL STRATEGY" icon="🍕" color={yellow}>
            <p style={{ marginTop: 0, fontSize: 15.5 }}>
              <strong style={{ color: "#fff" }}>The science of planned refeeds:</strong> After 5–6 days of caloric deficit, leptin (your metabolism-regulating hormone) drops — causing slower fat burning and increased cravings. A strategic refeed resets leptin, boosts metabolism, and maintains adherence.
            </p>
            <div className="interactive-card" style={{ padding: "24px", margin: "24px 0" }}>
              <div style={{ color: yellow, fontWeight: 700, marginBottom: 12, fontSize: 16 }}>📋 Cheat Meal Rules for Lokesh:</div>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#d1d5db" }}>
                <li style={{ marginBottom: 10 }}>Schedule: <strong style={{ color: "#fff" }}>Sunday lunch only</strong> (not a cheat day — ONE meal)</li>
                <li style={{ marginBottom: 10 }}>Calorie cap: Keep it under <strong style={{ color: "#fff" }}>800–900 kcal</strong> for the cheat meal</li>
                <li style={{ marginBottom: 10 }}>Prefer <strong style={{ color: "#fff" }}>high-carb</strong> cheat meals (biryani, dosa, pizza) over high-fat (fried items)</li>
                <li style={{ marginBottom: 10 }}>Don't guilt-trip: One cheat meal doesn't break progress. Missing gym 3 days does.</li>
                <li style={{ marginBottom: 10 }}>Train on cheat day: Go to gym before or same day — the extra carbs fuel an amazing workout</li>
                <li>No cheat meal in first 3 weeks — build the habit first</li>
              </ul>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "16px 20px", fontSize: 14, color: "var(--text-muted)", border: "1px solid var(--border-color)" }}>
              💡 Think of it this way: 6 days at 500 kcal deficit = 3,000 kcal weekly deficit. One cheat meal at 400 extra kcal = still 2,600 kcal weekly deficit. Progress continues.
            </div>
          </Section>

          <Section title="SUPPLEMENTS (ONLY WHAT YOU NEED)" icon="💊" color={purple}>
            <p style={{ marginTop: 0, color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>Supplements are a small %, not magic. 90% is diet + training. But these specific ones have strong evidence:</p>
            {[
              { name: "Whey Protein", priority: "RECOMMENDED", color: green, why: "If you can't hit 160g protein from food alone. MuscleBlaze Biozyme or AS-IT-IS whey are affordable Indian brands. ~₹1,500–1,800/kg.", dose: "1 scoop post-workout" },
              { name: "Creatine Monohydrate", priority: "HIGHLY RECOMMENDED", color: accent, why: "Most studied supplement in sports science. Increases strength, lean muscle gain, and recovery. No fat gain — purely intramuscular. AS-IT-IS brand ₹500–700.", dose: "5g daily (any time, with water)" },
              { name: "Vitamin D3 + K2", priority: "IMPORTANT FOR INDIANS", color: yellow, why: "70% of Indians are deficient despite sun exposure. Deficiency kills testosterone and energy levels. ₹200–400/month.", dose: "60,000 IU once weekly OR 2,000 IU daily" },
              { name: "Omega-3 (Fish Oil)", priority: "OPTIONAL", color: blue, why: "Reduces inflammation, improves fat oxidation, supports heart health. Eat fatty fish 2x/week as alternative.", dose: "1–2g EPA+DHA daily" },
            ].map((s, i) => (
              <div key={i} className="interactive-card" style={{ padding: "20px", marginBottom: 16, borderLeft: `3px solid ${s.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{s.name}</span>
                  <Chip text={s.priority} color={s.color} />
                </div>
                <p style={{ margin: "0 0 12px", color: "#d1d5db", fontSize: 14.5 }}>{s.why}</p>
                <div style={{ color: "var(--text-dim)", fontSize: 13, fontWeight: 600 }}>Dose: <span style={{color: "#fff"}}>{s.dose}</span></div>
              </div>
            ))}
            <div style={{ background: "rgba(239, 68, 68, 0.05)", borderRadius: 12, padding: "16px 20px", fontSize: 14, color: "#d1d5db", marginTop: 24, borderLeft: `2px solid ${red}` }}>
              ⚠️ Avoid fat burners, pre-workouts with stimulants, and testosterone boosters at 21. Your natural T is at lifetime peak — don't mess with hormonal systems.
            </div>
          </Section>

        </div>}

        {/* ===== WORKOUT TAB ===== */}
        {activeTab === "workout" && <div className="fade-in-up">
          <Section title="TRAINING PHILOSOPHY" icon="🏋️" color={accent}>
            <p style={{ marginTop: 0, fontSize: 15.5 }}>
              The most effective approach for beginners doing body recomposition is <strong style={{ color: "#fff" }}>resistance training 4–5x/week + strategic cardio</strong>. Cardio alone burns muscle along with fat. Weights preserve muscle while burning fat.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
              <div className="interactive-card" style={{ flex: 1, minWidth: 250, padding: "20px" }}>
                <div style={{ color: accent, fontWeight: 700, marginBottom: 12, fontSize: 16 }}>Why Weights Beat Cardio</div>
                <ul style={{ margin: 0, paddingLeft: 20, color: "#d1d5db", fontSize: 14.5 }}>
                  <li style={{marginBottom: 6}}>Builds muscle = higher resting metabolism</li>
                  <li style={{marginBottom: 6}}>EPOC effect burns calories 24–48h post workout</li>
                  <li style={{marginBottom: 6}}>Shapes the physique (cardio just makes you smaller)</li>
                  <li>Improves insulin sensitivity → less belly fat</li>
                </ul>
              </div>
              <div className="interactive-card" style={{ flex: 1, minWidth: 250, padding: "20px" }}>
                <div style={{ color: blue, fontWeight: 700, marginBottom: 12, fontSize: 16 }}>Progressive Overload Rule</div>
                <ul style={{ margin: 0, paddingLeft: 20, color: "#d1d5db", fontSize: 14.5 }}>
                  <li style={{marginBottom: 6}}>Add 2.5kg to lifts every week or two</li>
                  <li style={{marginBottom: 6}}>Or add 1 rep per set before increasing weight</li>
                  <li style={{marginBottom: 6}}>Track your lifts in a notebook</li>
                  <li>Without progressive overload, zero muscle growth</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="6-DAY WEEKLY WORKOUT SPLIT" icon="📅" color={green} delay="delay-1">
            <WorkoutDay
              day="Monday — Push (Chest + Shoulders + Triceps)"
              type="Weights"
              color={accent}
              exercises={[
                "Barbell Bench Press — 4 sets × 8–10 reps",
                "Incline Dumbbell Press — 3 sets × 10–12 reps",
                "Overhead Press (DB or BB) — 4 sets × 8–10 reps",
                "Lateral Raises — 3 sets × 12–15 reps",
                "Cable Flyes / Pec Deck — 3 sets × 12 reps",
                "Tricep Pushdown (Rope) — 3 sets × 12 reps",
                "Overhead Tricep Extension — 2 sets × 12 reps",
              ]}
            />
            <WorkoutDay
              day="Tuesday — Pull (Back + Biceps)"
              type="Weights"
              color={blue}
              exercises={[
                "Deadlifts — 4 sets × 5–6 reps (king of all exercises)",
                "Bent-Over Barbell Row — 4 sets × 8–10 reps",
                "Lat Pulldown — 4 sets × 10–12 reps",
                "Seated Cable Row — 3 sets × 12 reps",
                "Face Pulls (rear delts) — 3 sets × 15 reps",
                "Barbell or Dumbbell Curl — 3 sets × 12 reps",
                "Hammer Curls — 2 sets × 12 reps",
              ]}
            />
            <WorkoutDay
              day="Wednesday — Legs (Quads + Hams + Glutes + Calves)"
              type="Weights"
              color={green}
              exercises={[
                "Barbell Squat — 4 sets × 6–8 reps (largest muscle group — burns most fat)",
                "Romanian Deadlift — 3 sets × 10 reps",
                "Leg Press — 3 sets × 12 reps",
                "Walking Lunges — 3 sets × 12 reps each leg",
                "Leg Curl Machine — 3 sets × 12 reps",
                "Calf Raises (standing) — 4 sets × 20 reps",
                "15 min incline treadmill walk (post-leg — maximizes fat burn)",
              ]}
            />
            <WorkoutDay
              day="Thursday — Active Recovery + Core"
              type="Cardio + Core"
              color={yellow}
              exercises={[
                "20–25 min brisk walk or light cycling (Zone 2 cardio)",
                "Plank — 3 × 45–60 seconds",
                "Hanging Leg Raises — 3 × 12 reps",
                "Cable Crunches — 3 × 15 reps",
                "Russian Twists — 3 × 20 reps",
                "Dead Bug — 3 × 10 reps",
                "Note: Abs are built in gym, REVEALED in the kitchen. Core training is important but diet is what shows them.",
              ]}
            />
            <WorkoutDay
              day="Friday — Push 2 (Variation)"
              type="Weights"
              color={purple}
              exercises={[
                "Dumbbell Bench Press — 4 sets × 10 reps",
                "Cable Chest Flyes — 3 sets × 12 reps",
                "Seated DB Shoulder Press — 4 sets × 10 reps",
                "Front Raises — 2 sets × 12 reps",
                "Tricep Dips (weighted if possible) — 3 sets × 10–12 reps",
                "Skull Crushers — 3 sets × 10 reps",
              ]}
            />
            <WorkoutDay
              day="Saturday — Pull 2 + Cardio Finisher"
              type="Weights + Cardio"
              color={blue}
              exercises={[
                "Pull-Ups (assisted if needed) — 4 sets × max reps",
                "Single Arm DB Row — 3 sets × 12 reps each",
                "T-Bar Row — 3 sets × 10 reps",
                "Incline DB Curl — 3 sets × 10 reps",
                "Reverse Curls — 2 sets × 12 reps",
                "HIIT Finisher: 10 rounds — 30 sec sprint / 30 sec rest on treadmill",
              ]}
            />
            <WorkoutDay
              day="Sunday — Complete Rest or Light Activity"
              type="Rest"
              color={"#6b7280"}
              exercises={[
                "No gym — muscles grow during REST, not during workout",
                "Light 20 min walk optional",
                "Stretching / yoga for 15 min (improves recovery)",
                "Focus on sleep, meal prep for the week",
                "Cheat meal day (from Week 4 onward)",
              ]}
            />

            <div className="interactive-card" style={{ padding: "20px", marginTop: 24, borderLeft: `3px solid ${yellow}` }}>
              <div style={{ color: yellow, fontWeight: 700, marginBottom: 8, fontSize: 16 }}>⏱️ Workout Format</div>
              <p style={{ margin: 0, color: "#d1d5db", fontSize: 14.5 }}>
                Duration: 60–75 minutes max. Rest between sets: 60–90 sec for hypertrophy, 2–3 min for strength sets. Rep range: 8–12 for muscle building, 4–6 for strength. RPE target: 7–8 out of 10 (challenging but not failing every set).
              </p>
            </div>
          </Section>

          <Section title="CARDIO STRATEGY" icon="🏃" color={blue} delay="delay-2">
            <p style={{ marginTop: 0, fontSize: 15.5 }}>For fat loss, <strong style={{ color: "#fff" }}>cardio is a tool, not a solution</strong>. Here's what works:</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
              {[
                { type: "LISS (Low Intensity)", example: "Incline treadmill walk, cycling", dose: "3–4x/week, 25–35 min", when: "Post-weight session or morning", color: green },
                { type: "HIIT (High Intensity)", example: "Sprint intervals, jump rope", dose: "1–2x/week, 15–20 min", when: "Separate from weights or post-legs", color: red },
              ].map((c, i) => (
                <div key={i} className="interactive-card" style={{ flex: 1, minWidth: 240, padding: "20px", borderTop: `3px solid ${c.color}` }}>
                  <div style={{ color: "#fff", fontWeight: 700, marginBottom: 8, fontSize: 16 }}>{c.type}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 14.5, marginBottom: 8 }}>{c.example}</div>
                  <div style={{ color: c.color, fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>{c.dose}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: 13, fontWeight: 500 }}>Best: {c.when}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "20px", fontSize: 14.5, color: "#d1d5db", border: "1px solid var(--border-color)" }}>
              🚶 <strong style={{ color: "#fff" }}>10,000 steps/day</strong> is your hidden fat burner. Use step counter on your phone. Walk to the gym, take stairs, walk after dinner. This alone adds 300–500 kcal daily expenditure without touching a weight.
            </div>
          </Section>
        </div>}

        {/* ===== LIFESTYLE TAB ===== */}
        {activeTab === "lifestyle" && <div className="fade-in-up">
          <Section title="WATER INTAKE PROTOCOL" icon="💧" color={blue}>
            <div className="interactive-card" style={{ padding: "32px 20px", marginBottom: 24, textAlign: "center" }}>
              <div className="bebas" style={{ color: blue, fontSize: 64, letterSpacing: 2, lineHeight: 1, marginBottom: 8 }}>3.5–4L</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>Daily water intake target</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {[
                { time: "Wake up (7 AM)", amount: "500ml (2 glasses)", note: "Kickstarts metabolism, flushes toxins. Add lemon for vitamin C." },
                { time: "Pre-workout", amount: "300–400ml", note: "Prevents early fatigue and dehydration mid-session." },
                { time: "During workout", amount: "500ml", note: "Sip every 15 min. Performance drops 10% with 2% dehydration." },
                { time: "Post-workout", amount: "500ml", note: "Recovery and muscle repair needs water." },
                { time: "Throughout day", amount: "Remaining 1.5–2L", note: "Keep a 1L bottle visible — you drink what you see." },
              ].map((w, i) => (
                <div key={i} className="interactive-card" style={{ padding: "16px", borderLeft: `3px solid ${blue}` }}>
                  <div style={{ color: "var(--text-dim)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>{w.time}</div>
                  <div style={{ color: blue, fontWeight: 700, fontSize: 18, margin: "6px 0" }}>{w.amount}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{w.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, background: "rgba(59, 130, 246, 0.05)", borderRadius: 12, padding: "16px 20px", fontSize: 14, color: "#d1d5db", borderLeft: `2px solid ${blue}` }}>
              📌 Fat loss is literally a chemical process that requires water. Dehydration mimics hunger — many "cravings" are just thirst. Drink a glass of water before any snack and wait 10 minutes.
            </div>
          </Section>

          <Section title="SLEEP OPTIMIZATION" icon="🌙" color={purple} delay="delay-1">
            <div className="interactive-card" style={{ padding: "32px 20px", marginBottom: 24, textAlign: "center" }}>
              <div className="bebas" style={{ color: purple, fontSize: 64, letterSpacing: 2, lineHeight: 1, marginBottom: 8 }}>7–9 HRS</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>Minimum sleep for hormonal optimization</div>
            </div>
            <p style={{ fontSize: 15.5, marginBottom: 24 }}>Sleep is where 60–70% of muscle building happens. Growth hormone (GH) is released primarily in deep sleep. Cutting sleep cuts muscle gains and increases fat storage — even with perfect diet.</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
              {[
                { label: "Sleep by", val: "10:30–11 PM", color: purple },
                { label: "Wake up by", val: "6:30–7 AM", color: green },
                { label: "Deep sleep target", val: "1.5–2 HRS", color: blue },
              ].map((s, i) => (
                <div key={i} className="interactive-card" style={{ flex: 1, minWidth: 150, padding: "20px", textAlign: "center" }}>
                  <div className="bebas" style={{ color: s.color, fontSize: 28, marginBottom: 4 }}>{s.val}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="interactive-card" style={{ padding: "24px" }}>
              <strong style={{ color: "#fff", fontSize: 16 }}>Sleep hygiene for Lokesh:</strong>
              <ul style={{ paddingLeft: 20, marginBottom: 0, marginTop: 12, color: "#d1d5db", fontSize: 14.5 }}>
                <li style={{marginBottom: 8}}>No phone/screen 45 min before bed (blue light delays melatonin by 90 min)</li>
                <li style={{marginBottom: 8}}>Keep room dark and slightly cool (18–22°C) — optimal for deep sleep</li>
                <li style={{marginBottom: 8}}>No food within 2 hours of sleep</li>
                <li style={{marginBottom: 8}}>Consistent wake time even on weekends — fixes circadian rhythm</li>
                <li>Poor sleep = high cortisol = belly fat storage. Non-negotiable.</li>
              </ul>
            </div>
          </Section>

          <Section title="REALISTIC TRANSFORMATION TIMELINE" icon="📈" color={green} delay="delay-2">
            {[
              { phase: "Weeks 1–4", title: "Foundation Phase", color: blue, outcomes: ["Body adjusting to new diet and training stimulus", "Lose 1.5–3 kg (mostly water weight + some fat)", "Energy levels increase, sleep improves", "No visible changes in mirror yet — trust the process"] },
              { phase: "Weeks 5–12", title: "Visible Fat Loss Phase", color: green, outcomes: ["Lose 4–6 kg of actual body fat", "Visible reduction in belly and face", "Clothes start fitting differently", "Jawline begins to emerge as face fat drops", "Strength increases significantly in all lifts"] },
              { phase: "Months 4–6", title: "Body Recomposition Phase", color: accent, outcomes: ["Noticeable muscle definition — arms, chest, shoulders", "Belly significantly reduced", "Others start noticing the change", "10–14 kg total transformation possible", "Face and jawline visibly sharper"] },
              { phase: "6–12 Months", title: "Elite Physique Phase", color: purple, outcomes: ["Full body recomposition achieved", "Visible abs (if body fat drops to 12–15%)", "Confident, aesthetic physique", "You become the 'transformation inspiration' in your friend group"] },
            ].map((p, i) => (
              <div key={i} className="interactive-card" style={{ padding: "20px", marginBottom: 16, borderLeft: `4px solid ${p.color}` }}>
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                  <Chip text={p.phase} color={p.color} />
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{p.title}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {p.outcomes.map((o, j) => <li key={j} style={{ color: "#d1d5db", fontSize: 14.5, marginBottom: 8 }}>{o}</li>)}
                </ul>
              </div>
            ))}
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "20px", fontSize: 14.5, color: "#d1d5db", marginTop: 24, border: "1px solid var(--border-color)" }}>
              ⚡ <strong style={{ color: yellow }}>Reality check:</strong> Sustainable fat loss = 0.5–1 kg/week. Anyone promising 10 kg in 30 days is selling you muscle loss and metabolic damage. At 82 kg with your stats, reaching 70–72 kg lean is a realistic 6-month goal.
            </div>
          </Section>

          <Section title="COMMON BEGINNER MISTAKES" icon="⚠️" color={red} delay="delay-3">
            {[
              { mistake: "Eating too little (< 1,600 kcal)", fix: "Slows metabolism, eats muscle. Stay at 2,150 kcal — the deficit is enough." },
              { mistake: "Skipping protein to 'eat less'", fix: "Without protein, you lose muscle not fat. Always hit 160g protein." },
              { mistake: "Doing only cardio, avoiding weights", fix: "Cardio burns fat AND muscle. Weights selectively preserve muscle while burning fat." },
              { mistake: "Weighing daily and panicking", fix: "Weight fluctuates 1–2 kg daily from water. Weigh weekly, same time, after toilet." },
              { mistake: "Going all-in then quitting after 2 weeks", fix: "Consistency beats perfection. 80% adherence for 6 months beats 100% for 2 weeks." },
              { mistake: "Avoiding carbs completely", fix: "Carbs fuel workouts. Zero carb = terrible gym performance = less fat burned." },
              { mistake: "Not sleeping enough (< 6 hrs)", fix: "You can't out-train sleep deprivation. Sleep is when you actually build the muscle." },
              { mistake: "Starting too many supplements", fix: "Food first, always. Supplements are 5% of results at best." },
              { mistake: "Comparing to Instagram transformations", fix: "Most are steroids, lighting, angles, or 3-year journeys shown as 3-month ones." },
            ].map((item, i) => (
              <div key={i} className="interactive-card" style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-start", padding: "16px 20px" }}>
                <span style={{ color: red, fontSize: 20, flexShrink: 0, fontWeight: 700 }}>✗</span>
                <div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{item.mistake}</div>
                  <div style={{ color: "#a1a1aa", fontSize: 14 }}><span style={{ color: green, fontWeight: 600 }}>Fix: </span>{item.fix}</div>
                </div>
              </div>
            ))}
          </Section>
        </div>}

        {/* ===== MINDSET TAB ===== */}
        {activeTab === "mindset" && <div className="fade-in-up">
          <Section title="THE PSYCHOLOGY OF FAT LOSS" icon="🧠" color={purple}>
            <p style={{ marginTop: 0, fontSize: 15.5 }}>
              At 21, your biggest challenge isn't biology — it's psychology. Your body is <em>designed</em> to lose fat and build muscle with the right inputs. The enemy is <strong style={{ color: "#fff" }}>dopamine hijacking</strong> from junk food, social media, and inconsistency.
            </p>
            <div className="interactive-card" style={{ padding: "20px", marginTop: 24, borderLeft: `3px solid ${purple}` }}>
              <div style={{ color: purple, fontWeight: 700, marginBottom: 12, fontSize: 16 }}>The Craving Science</div>
              <p style={{ margin: 0, color: "#d1d5db", fontSize: 14.5 }}>
                Junk food triggers dopamine like a drug — same neural pathways. The first 3 weeks of clean eating are the hardest because your brain is literally going through withdrawal from sugar and processed food dopamine spikes. After 21–30 days, the cravings reduce by 60–70% on their own. This is neuroscience, not willpower mythology.
              </p>
            </div>
          </Section>

          <Section title="DISCIPLINE & ANTI-CRAVING SYSTEM" icon="⚡" color={accent} delay="delay-1">
            {[
              { title: "The 10-Minute Rule", desc: "When a craving hits, set a 10-minute timer. Do something else. 90% of cravings disappear by themselves — they're boredom or habit, not real hunger." },
              { title: "Identity Shift", desc: "Don't say 'I can't eat junk'. Say 'I'm someone who eats clean — it's who I am now.' Identity-based habits are 3x more sustainable than willpower-based ones." },
              { title: "Environment Design", desc: "Remove junk from your room/house. You can't eat what isn't there. Stock your fridge with boiled eggs, curd, and fruits. Make the healthy choice the easy choice." },
              { title: "Meal Prep Sunday", desc: "Cook 1 kg chicken, boil 10 eggs, prepare dal and sabzi for 2–3 days every Sunday. When hunger hits, food is ready — no decisions, no willpower needed." },
              { title: "Progress Tracking Dopamine", desc: "Take weekly photos (same light, same pose). The visual change after 4–6 weeks is the most powerful motivation you can have. Better than any gym quote." },
              { title: "Accountability", desc: "Tell one friend or family member your goal. Better — find a gym buddy. Social accountability doubles adherence rates in research studies." },
              { title: "The 'One Bad Day' Protocol", desc: "If you eat junk one day, the next meal is clean. Not the next day — the next MEAL. Spiral thinking ('I already ruined it') is how 90% of diets fail." },
            ].map((tip, i) => (
              <div key={i} className="interactive-card" style={{ padding: "20px", marginBottom: 16, borderLeft: `3px solid ${accent}` }}>
                <div style={{ color: "#fff", fontWeight: 700, marginBottom: 8, fontSize: 16 }}>0{i + 1}. {tip.title}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 14.5 }}>{tip.desc}</div>
              </div>
            ))}
          </Section>

          <Section title="LOKESH'S DAILY SUCCESS CHECKLIST" icon="✅" color={green} delay="delay-2">
            <p style={{ marginTop: 0, color: "var(--text-muted)", fontSize: 14.5, marginBottom: 20 }}>Print this or save it. Check off daily. The streak is more motivating than any supplement.</p>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { item: "Hit 2,150 kcal target (±100 kcal)", color: green },
                { item: "Hit 160g protein", color: green },
                { item: "Drink 3.5L water", color: blue },
                { item: "Complete planned workout or active recovery", color: accent },
                { item: "Sleep 7+ hours", color: purple },
                { item: "10,000+ steps", color: yellow },
                { item: "No binge eating / junk outside plan", color: red },
                { item: "Read, study, or improve mentally (mindset = fitness)", color: purple },
              ].map((c, i) => (
                <div key={i} className="interactive-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${c.color}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `color-mix(in srgb, ${c.color} 10%, transparent)` }} />
                  <span style={{ color: "#d1d5db", fontSize: 15, fontWeight: 500 }}>{c.item}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, background: `linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(0,0,0,0))`, borderRadius: 16, padding: "32px 24px", border: `1px solid rgba(249, 115, 22, 0.3)`, textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div className="pulse" style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, background: "rgba(249, 115, 22, 0.2)", filter: "blur(50px)", borderRadius: "50%", pointerEvents: "none" }} />
              <div className="bebas" style={{ color: accent, fontSize: 36, letterSpacing: 2, marginBottom: 12, position: "relative", zIndex: 1 }}>YOUR 6-MONTH MISSION</div>
              <p style={{ margin: 0, color: "#d1d5db", fontSize: 15.5, lineHeight: 1.8, position: "relative", zIndex: 1, maxWidth: 600, marginInline: "auto" }}>
                From 82 kg → 70–72 kg lean. Face fat gone, jawline sharp, belly flat, shoulders defined. Not Instagram genetics — just <strong style={{ color: "#fff" }}>discipline, protein, and progressive overload</strong>. At 21, your body is a Ferrari. Feed it right. Train it hard. Sleep it well. The transformation will happen. The only variable is whether <strong style={{ color: accent }}>you show up every day.</strong>
              </p>
            </div>
          </Section>

        </div>}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border-color)", padding: "32px 24px", textAlign: "center", color: "var(--text-dim)", fontSize: 13, background: "rgba(0,0,0,0.5)" }}>
        🔬 Science-based plan by certified fitness & nutrition methodology • Personalized for Lokesh • All recommendations based on TDEE, Mifflin-St Jeor BMR, and evidence-based sports nutrition
      </div>
    </div>
  );
}

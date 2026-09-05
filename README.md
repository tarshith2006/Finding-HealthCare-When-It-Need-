# CareRoute — Finding Healthcare When It Matters

> **Tagline:** Finding Healthcare When It Matters.  
> **Project Type:** Smart Emergency Healthcare Discovery and Hospital Recommendation Web Application (MVP).

---

## 1. Project Name
**CareRoute**

## 2. Project Overview
CareRoute is a lightweight, responsive, and secure healthcare discovery and navigation web application built for emergency preparedness and rapid hospital recommendations. It provides real-time guidance to help users identify nearby emergency departments, locate matching specialized clinical services, check blood bank inventory, and receive explainable hospital recommendations with navigation assistance.

---

## 3. Problem Statement
During medical crises (car collisions, acute cardiac events, stroke symptoms, major burns, or pregnancy distress), patients and caregivers often waste crucial minutes navigating fragmented sources. Users frequently do not know:
- Which nearby hospital specializes in their specific emergency
- Whether an emergency room (ER) is active 24/7 or only operating as a day clinic
- Where urgently required blood groups (such as O- or A+) are stocked
- Whether relevant specialists (e.g. Interventional Cardiologist, Stroke Neurologist, Trauma Surgeon) are on call
- How long it will take to reach the most suitable facility

CareRoute bridges this gap by unifying discovery into a simple, high-speed, mobile-friendly workflow:  
**Emergency Type → Location → Nearby Hospitals → Blood Availability → Doctor/Service Availability → Best Hospital → Navigation.**

---

## 4. Exactly 5 Core Features

### Feature 1 — Emergency Mode & Emergency Type Selection
- 6 emergency categories:
  1. **Accident & Physical Trauma** (Trauma Care, Orthopedics, Emergency Department)
  2. **Heart Emergency** (Cardiology, ICU, Emergency Department)
  3. **Stroke Symptoms** (Neurology, ICU, Emergency Department)
  4. **Pregnancy Emergency** (Gynecology, Pediatrics, Emergency Department)
  5. **Burn Injury** (Burn Care, Trauma Care, Emergency Department)
  6. **General Medical Emergency** (General Medicine, Emergency Department)
- Automatic mapping to required clinical specialties and immediate first-response guidance.
- Direct quick-links to filtered hospital results and smart recommendation scoring.

### Feature 2 — Nearby Hospital Finder
- Geolocation detection via the browser `navigator.geolocation` API.
- Instant manual fallback when location is denied, with preset metropolitan zones and locality search.
- Haversine distance calculation and approximate travel ETA.
- Dynamic filtering by 24/7 emergency readiness, clinical service, blood group, and distance radius.
- Detailed modal inspection showing beds, ICU capability, specialists, and full blood inventory.

### Feature 3 — Blood Availability Directory
- Fast filtering across all 8 major blood groups: **A+, A-, B+, B-, O+, O-, AB+, AB-**.
- Accessible status indicators with clear text and symbols:
  - `✓ Available`
  - `! Limited Stock`
  - `✕ Currently Unavailable`
  - `☎ Contact to Confirm`
- Direct phone call links to hospital blood banks.

### Feature 4 — Doctor & Service Availability
- In-depth department lookup for 9 critical healthcare services:
  - Emergency Department (24/7)
  - Cardiology
  - Neurology
  - Orthopedics
  - Trauma Care
  - Burn Care
  - Pediatrics
  - Gynecology & Maternity
  - General Medicine
- Identifies on-call lead specialists and emergency department operational status.

### Feature 5 — Smart Hospital Recommendation & Navigation
- Explainable mathematical match score (0–100 points maximum):
  - **Emergency & Service Match:** up to **+40 points**
  - **Specialist / Doctor Availability:** up to **+25 points**
  - **Blood Group Inventory Availability:** up to **+20 points**
  - **Distance / Proximity:** up to **+15 points**
- Transparent bulleted reasons explaining why the top hospital was chosen.
- Approximate driving travel time (ETA) calculation.
- 1-click **Start Navigation** generating browser-compatible directions via Google Maps or route query.
- Ranked alternative runner-up facilities for quick comparison.

---

## 5. Technology Stack
- **Frontend Framework:** React 19 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Location:** Browser Geolocation API + Haversine formula
- **Storage:** Browser LocalStorage (persists recent searches, last emergency, user preferences)
- **Deployment:** Vercel / Cloud Run compatible (pure static client build)

---

## 6. Architecture & Data Flow
CareRoute runs entirely client-side for ultra-fast, zero-latency response during critical situations. No server dependencies or paid APIs are mandatory.

```
[User Location / Manual Selection] + [Emergency / Blood / Service Input]
                             │
                             ▼
               [Recommendation Engine (0-100)]
         (Emergency Match + Specialist + Blood + Proximity)
                             │
                             ▼
      [Top Recommended Facility + Distance + Travel ETA]
                             │
                             ▼
      [1-Click Browser Navigation URL (Google Maps / Direct)]
```

---

## 7. Folder Structure
```
careroute/
├── public/
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx              # Platform guide, scoring breakdown & disclaimers
│   │   ├── BloodCard.tsx               # Blood group status card
│   │   ├── Disclaimer.tsx              # Reusable medical & emergency disclaimer
│   │   ├── EmergencyCard.tsx           # Emergency category card
│   │   ├── FilterBar.tsx               # Service, blood, distance, & ER filters
│   │   ├── HospitalCard.tsx            # Standard hospital listing card
│   │   ├── HospitalDetailsModal.tsx    # Comprehensive facility modal view
│   │   ├── Loading.tsx                 # Reusable loading states
│   │   ├── LocationButton.tsx          # Geolocation trigger & manual area presets
│   │   ├── Navbar.tsx                  # Main responsive navigation
│   │   ├── RecommendationCard.tsx      # Top score match & reasons card
│   │   ├── SearchBar.tsx               # Search input with sanitization
│   │   └── ServiceCard.tsx             # Doctor & specialty capability card
│   │
│   ├── data/
│   │   ├── emergencyData.ts            # Emergency categories & required services
│   │   └── hospitalData.ts             # 10 realistic demo hospitals with full specs
│   │
│   ├── pages/
│   │   ├── Home.tsx                    # Landing page & emergency banner
│   │   ├── Emergency.tsx               # Feature 1: Emergency Mode
│   │   ├── Hospitals.tsx               # Feature 2: Nearby Hospital Finder
│   │   ├── BloodAvailability.tsx       # Feature 3: Blood Availability
│   │   ├── Services.tsx                # Feature 4: Doctor & Service Availability
│   │   └── Recommendation.tsx          # Feature 5: Smart Recommendation & Navigation
│   │
│   ├── services/
│   │   ├── locationService.ts          # Geolocation wrapper & preset city coordinates
│   │   ├── navigationService.ts        # Browser navigation URL generator
│   │   └── storageService.ts           # Safe LocalStorage persistence
│   │
│   ├── utils/
│   │   ├── distanceCalculator.ts       # Haversine distance formula & ETA
│   │   ├── hospitalRecommendation.ts   # 0-100 explainable scoring algorithm
│   │   └── validators.ts               # Input sanitizers & validation
│   │
│   ├── types.ts                        # TypeScript interfaces & types
│   ├── App.tsx                         # Core application controller
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Tailwind imports
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 8. Location Handling
- Requests permission using `navigator.geolocation.getCurrentPosition`.
- If granted, computes exact distance in kilometers to each facility.
- If permission is denied or unsupported, displays a non-blocking notification:
  > *"Location access was denied. You can search for a hospital manually."*
- Offers 1-click preset metropolitan zones (Central Metro, North Corridor, East Park MedTech, South Greens, Westside) so users in any environment can experience dynamic distance recalculations.

---

## 9. Hospital Recommendation Logic
`recommendHospital(input)` scores each facility out of 100:
1. **Emergency / Service Match (Max 40 points):** +20 points for 24/7 active ER, +20 points scaled by proportion of emergency-required services offered.
2. **Specialist Availability (Max 25 points):** +25 points when on-duty specialists (surgeons, cardiologists, neurologists) match the emergency.
3. **Blood Availability (Max 20 points):** +20 for "Available", +12 for "Limited", +7 for "Contact to Confirm", 0 for "Unavailable".
4. **Distance Proximity (Max 15 points):** +15 points for <3 km, +11 for <6 km, +7 for <10 km, +4 for <15 km.

---

## 10. Blood Availability
Tracks all 8 blood groups per hospital with clear status badges and labels. Warns users prominently that blood stock fluctuates and that calling ahead to verify is mandatory.

---

## 11. Doctor / Service Availability
Enables inspection of on-duty specialists and medical departments with direct telephone desk links.

---

## 12. Navigation
Generates direct browser-compatible navigation URLs via:
`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${hospitalLat},${hospitalLon}`  
Does **not** require any paid Google Maps API keys or billing accounts.

---

## 13. LocalStorage
Safely persists:
- `careroute_last_emergency`: Last emergency category selected
- `careroute_recent_searches`: Up to 8 recent searches
- `careroute_user_preferences`: Preferred blood group and service filters
- `careroute_recent_recommendations`: Top 5 generated recommendations with timestamps

---

## 14. Installation
```bash
git clone https://github.com/your-username/careroute.git
cd careroute
npm install
```

---

## 15. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 16. GitHub Setup
```bash
git init
git add .
git commit -m "feat: complete CareRoute MVP with 5 core healthcare features"
git branch -M main
git remote add origin https://github.com/your-username/careroute.git
git push -u origin main
```

---

## 17. Vercel Deployment
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. No environment variables are required! The MVP runs 100% free with zero configuration.

---

## 18. Limitations
- Uses realistic demonstration hospital and inventory data for the prototype.
- Travel times (ETA) are approximations based on urban speeds; live real-world traffic requires a third-party traffic integration.
- Not connected to government centralized blood bank APIs in the current MVP.

---

## 19. Future Improvements
- Integration with regional emergency dispatch APIs (e.g. 108/911 ambulance integration).
- Real-time IoT blood bank refrigerator stock feeds.
- Automated SMS/WhatsApp alert dispatch to emergency contacts.
- Offline progressive web app (PWA) caching for zero-connectivity triage.

---

## 20. Healthcare Disclaimer
> **Important Safety Notice:**  
> CareRoute is a healthcare discovery and navigation assistance tool. Hospital, doctor, blood, and service availability may change and must be confirmed directly with the healthcare facility.  
> **This application does not provide medical diagnosis, clinical triage, or patient admission guarantees, and does not replace certified doctors, hospitals, ambulances, or emergency medical response services.**  
> In any life-threatening situation, immediately call **911** or your local emergency response hotline.

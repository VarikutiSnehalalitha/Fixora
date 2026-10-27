# FixNow 24/7 — Complete Technician & Emergency Assistance Platform

FixNow 24/7 is a full-stack, responsive web application connecting customers across India with nearby verified vehicle mechanics, home appliance repair technicians, roadside assistance providers (towing, jump-starts, punctures), and legally authorized emergency fuel suppliers.

---

## 1. Key Platform Capabilities

- **Instant Emergency Roadside SOS**: Rapid 1-click or 3-step emergency broadcast with GPS auto-detection, landmark specification, direction of travel, and priority dispatch.
- **Home Appliance Diagnostics & Repair**: Multi-brand repairs (Samsung, LG, Whirlpool, Daikin, etc.) for refrigerators, washing machines, air conditioners, TVs, microwaves, and water purifiers with a 30-day workmanship warranty.
- **Regulated Fuel Logistics (PESO Compliance)**: Compliant with the Petroleum Rules 2002. Petrol is strictly capped at 5L maximum in factory-sealed, PESO-approved steel canisters; Diesel is capped at 20L roadside assistance. Non-compliant requests fallback to verified 24/7 retail fuel pumps with direct navigation.
- **Dynamic State Machine**: Strict server-enforced workflow:
  `REQUESTED` ➔ `SEARCHING` ➔ `PROVIDER_ASSIGNED` ➔ `PROVIDER_EN_ROUTE` ➔ `ARRIVED` ➔ `DIAGNOSING` ➔ `QUOTE_PENDING` ➔ `QUOTE_APPROVED` ➔ `IN_PROGRESS` ➔ `COMPLETED`
- **Arrival & Completion OTP Handover**: Dual verification codes protect customer safety on technician arrival and confirm delivered services/fuel before releasing payouts.
- **Itemized Digital Quotes**: Technicians perform physical inspection and submit itemized parts & labour quotes; chargeable work requires explicit customer digital approval.
- **Payments & Test Mode**: Razorpay test mode integration with server-side HMAC SHA256 signature verification, UPI simulation, and cash workflow.
- **Administrative Governance**: Document review (Aadhaar, commercial driving license, ITI trade certificate), PESO license audits, state machine overrides, pricing matrix configuration, and dispute refund handling.

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom brand & emergency design tokens
- **Interactive Mapping**: Leaflet & OpenStreetMap (dynamic GPS route, custom emergency & technician markers, fallback fuel pump pins)
- **Database & RLS**: PostgreSQL schema with Row Level Security (RLS) policies (`supabase/migrations/20261027_init.sql`)
- **State & Data Store**: Dual-mode data layer providing in-memory/localStorage seed persistence for immediate out-of-the-box local testing, combined with Supabase client integrations.
- **Automated Tests**: Comprehensive test suite in `src/__tests__/app.test.ts` covering pricing calculations, state transitions, Haversine dispatch ranking, and PESO fuel regulatory enforcement.

---

## 3. Directory Structure

```
├── src/
│   ├── app/
│   │   ├── (Public & Services)
│   │   │   ├── page.tsx                    # Landing page with emergency SOS & service grid
│   │   │   ├── emergency/page.tsx          # Priority roadside SOS workflow
│   │   │   ├── services/vehicle/page.tsx   # Vehicle mechanics & towing
│   │   │   ├── services/appliance/page.tsx # Home appliances repair
│   │   │   ├── services/fuel/page.tsx      # Regulated fuel delivery & pump fallback
│   │   │   ├── petroleum-compliance/page.tsx # Petroleum Rules 2002 statutory disclosure
│   │   │   ├── book/page.tsx               # Service scheduling & dispatch
│   │   │   ├── tracking/[id]/page.tsx      # Live GPS tracking, arrival OTP & quote approval
│   │   │   ├── checkout/[id]/page.tsx      # Itemized tax invoice & Razorpay/UPI checkout
│   │   │   └── booking/confirmation/[id]/  # Confirmation with celebration confetti
│   │   ├── customer/                       # Customer dashboard, vehicles, appliances, bookings, support
│   │   ├── provider/                       # Specialist onboarding, dashboard, job execution terminal, earnings
│   │   ├── fuel-partner/                   # PESO partner registration, order handover terminal
│   │   ├── admin/                          # Operational analytics, document verification, audit logs
│   │   ├── api/                            # Server routes: bookings, quotes, dispatch, payments, OTP
│   │   ├── globals.css                     # Design tokens & Leaflet map styling
│   │   └── layout.tsx                      # Root layout with responsive Navbar & Footer
│   ├── components/
│   │   ├── ui/                             # Button, Card, Badge, Modal, StarRating, AlertBanner
│   │   ├── layout/                         # Navbar (with 1-click Demo Role Switcher) & Footer
│   │   └── map/LiveMap.tsx                 # Leaflet interactive map component
│   ├── lib/
│   │   ├── constants.ts                    # Services, Indian cities, state transitions, demo accounts
│   │   ├── pricing.ts                      # Pricing engine (base, distance, night surcharge, GST 18%)
│   │   ├── dispatch.ts                     # Haversine distance, travel time, candidate ranking
│   │   ├── fuel-compliance.ts              # PESO limits, Class A vs B fuel rules, verified pump fallback
│   │   ├── store.ts                        # Unified persistence layer with realistic demo data
│   │   └── supabase.ts                     # Supabase client wrapper
│   ├── types/index.ts                      # Complete TypeScript data model
│   └── __tests__/app.test.ts               # Core architecture test suite
├── supabase/migrations/20261027_init.sql   # PostgreSQL DDL, indexes, and RLS policies
├── .env.example                            # Sample environment variables
├── package.json                            # Scripts and dependencies
└── README.md                               # Project documentation
```

---

## 4. Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v20 and v26)
- npm v9+

### Installation
```bash
# Clone and enter workspace
git clone <repo-url>
cd Fixora

# Install dependencies
npm install
```

### Running Automated Tests
```bash
npm test
```
*Runs all 10 unit and integration tests covering the pricing engine, dispatch ranking, state machine transitions, and statutory PESO quantity rules.*

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm start
```

---

## 5. Instant Role Switching for Demo & QA

The application includes an instant **Demo Role Switcher** at the top right of the navigation bar, allowing testers to view the platform from any of the 5 user roles without logging out:

1. **Customer (`Rahul Sharma`)**:
   - Create emergency bookings at `/emergency` or `/book`.
   - Access saved vehicles (Hyundai Creta, Royal Enfield) at `/customer/vehicles`.
   - Access saved appliances (Samsung Refrigerator, LG Washing Machine) at `/customer/appliances`.
   - Track live booking status, share 4-digit arrival OTP, approve repair quotes, and pay via test-mode Razorpay.
2. **Vehicle Mechanic (`Vikram Singh — Apex Auto Care`)**:
   - Toggle online/offline status at `/provider/dashboard`.
   - Receive incoming roadside requests at `/provider/jobs`.
   - Open the Job Action Terminal at `/provider/jobs/[id]` to mark departure, verify customer arrival OTP, submit diagnosis estimates, and complete work.
   - View earnings and platform commission deductions at `/provider/earnings`.
3. **Appliance Technician (`Anand Kumar — CoolTech`)**:
   - Specializes in refrigerator, AC, and washing machine diagnostics with warranty reports.
4. **Authorized Fuel Partner (`SafeFuel BPCL Partner`)**:
   - Regulated terminal at `/fuel-partner/dashboard` displaying active PESO License (`PESO/SC/2023/BLR-0892`).
   - Verifies customer handover OTP and logs delivered quantity under Rule 130.
5. **System Administrator**:
   - Review pending provider documents at `/admin/providers`.
   - Audit fuel partner certifications at `/admin/fuel-partners`.
   - Monitor real-time dispatch and force transitions at `/admin/bookings`.
   - Inspect immutable audit logs and customer dispute tickets at `/admin/support`.

---

## 6. Supabase Database Migration & RLS

To link a live Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to the SQL Editor in Supabase and run the full migration script located at:
   ```
   supabase/migrations/20261027_init.sql
   ```
3. Copy your project URL and Anon Key into `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
*Note: The platform features a dual-mode data layer. If Supabase keys are not set, it operates out of the box with realistic seed records in local memory/storage.*

---

## 7. Petroleum Rules 2002 & Safety Standard

In accordance with Indian statutory requirements:
- **Class A Petroleum (Petrol)**: Highly inflammable (flash point <23°C). Delivery is strictly capped at **5 Litres maximum** in factory-sealed, PESO-certified steel safety canisters for emergency top-up to reach the nearest station.
- **Class B Petroleum (Diesel)**: Permitted up to **20 Litres maximum** for roadside assistance using approved containers or authorized mobile bowsers.
- If no compliant partner is within the service perimeter, FixNow automatically directs motorists to nearby 24/7 retail petrol pumps with contact numbers and driving directions.

---

## 8. License

FixNow 24/7 Technologies India Private Limited. All rights reserved.

# AI Clinic Management System

A full-stack clinic management platform built with **Next.js 16**, **Firebase**, **Redux Toolkit**, and **AI-powered prescription explanations**. Designed for multi-role access: Admin, Doctor, Receptionist, and Patient.

---

## Features

- **Role-based dashboards** — Admin, Doctor, Receptionist, Patient each have dedicated views
- **Patient management** — Register, view, edit, delete patients; search & filter
- **Appointment booking** — Book, view, update, and cancel appointments with status tracking
- **Patient history timeline** — Full appointment history per patient with status filters
- **Prescriptions** — Create prescriptions with medications, generate PDF via `pdf-lib` & Firebase Storage
- **AI Explain** — Gemini / OpenAI powered plain-language explanation of any prescription
- **Authentication** — Email/password + Google Sign-In via Firebase Auth
- **Redux architecture** — CoreStock-style: `createSlice`, `AppDispatch`, typed thunk actions, no `any`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| State management | Redux Toolkit + React-Redux |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Firebase Storage |
| Admin SDK | firebase-admin |
| PDF generation | pdf-lib |
| Styling | Tailwind CSS v4 |
| Validation | Zod |
| Notifications | react-toastify |
| AI | Google Gemini 1.5 Flash / OpenAI GPT-3.5 |

---

## Project Structure

```
app/
  api/
    ai/explain/route.ts        # AI prescription explanation endpoint
    prescriptions/route.ts     # PDF generation + Firebase Storage upload
  dashboard/
    admin/     receptionist/   doctor/    patient/
  patients/
    [id]/
      history/page.tsx         # Patient appointment timeline
      edit/page.tsx
    create/page.tsx
  appointments/
    [id]/page.tsx
    create/page.tsx
  prescriptions/
    create/page.tsx
    page.tsx                   # List with AI Explain button
  types/                       # TypeScript interfaces
    auth.ts  user.ts  patient.ts  appointment.ts  prescription.ts
redux/
  store.ts
  reducers/
    auth-reducer/   user-reducer/   patient-reducer/
    appointment-reducer/   prescription-reducer/
  actions/
    auth-action/   user-action/   patient-action/
    appointment-action/   prescription-action/
  Provider.tsx                 # AuthStateListener + ReduxProvider
lib/
  firebase.ts                  # Client SDK
  firebaseAdmin.ts             # Admin SDK (server only)
  auth.ts                      # Auth helpers
  hooks/
    useRequireAuth.tsx          # Role-protected route hook
components/
  AppShell.tsx                 # Navigation shell
  Sidebar.tsx                  # Role-aware sidebar
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-side only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=

# AI (at least one required for AI Explain feature)
GEMINI_API_KEY=           # Google AI Studio: https://aistudio.google.com/
OPENAI_API_KEY=           # Optional fallback
```

### Getting Firebase Admin credentials

1. Go to **Firebase Console** -> Project Settings -> Service Accounts
2. Click **Generate new private key** -> Download JSON
3. Copy `project_id`, `client_email`, and `private_key` into `.env.local`

### Getting Gemini API key

1. Visit https://aistudio.google.com/app/apikey
2. Create an API key and paste it as `GEMINI_API_KEY`

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Add environment variables
cp .env.example .env.local   # then fill in values

# 3. Start development server
npm run dev
```

Open http://localhost:3000

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in https://vercel.com
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy

Note: The `FIREBASE_PRIVATE_KEY` must include literal `\n` characters. In Vercel, paste the key exactly as it appears in the JSON file (with newlines).

---

## Redux Architecture

Follows the CoreStock pattern:

```typescript
// Action pattern
export const fetchPatientsAction = () => async (dispatch: AppDispatch) => {
  dispatch(setPatientLoading(true));
  try {
    const snap = await getDocs(collection(db, 'patients'));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Patient));
    dispatch(setPatients(data));
  } catch (err: unknown) {
    dispatch(setPatientError(err instanceof Error ? err.message : 'Failed'));
  } finally {
    dispatch(setPatientLoading(false));
  }
};
```

- All actions use `AppDispatch` (not `any`)
- All state shapes are fully typed with interfaces in `app/types/`
- Reducers use `createSlice` with proper `PayloadAction<T>` types
- `Provider.tsx` uses an inner `AuthStateListener` component for Firebase auth sync

---

## User Roles

| Role | Access |
|---|---|
| `admin` | Full access - all dashboards, patient/appointment management |
| `doctor` | Own appointments, prescriptions, patient history |
| `receptionist` | Patient registration, appointment booking |
| `patient` | Own appointments only |

Role is stored in Firestore under `users/{uid}.role` and set during sign-up.

---

## License

MIT

# Digital Strategy Launchpad - Installation Guide

## ✅ Build Complete - 28 Files Total

### Quick Installation

1. **Unzip** to your project root
2. **Run database migration** in Supabase SQL Editor
3. **Update imports** if your project structure differs
4. **Visit** `/launchpad` to test

---

## File Structure

```
launchpad-build/
├── supabase/
│   └── migrations/
│       └── 003_client_intakes.sql      ← RUN THIS FIRST
│
├── src/
│   ├── types/
│   │   └── launchpad.ts                ← Copy to your src/types/
│   │
│   ├── hooks/
│   │   ├── useFormPersistence.ts       ← Copy to your src/hooks/
│   │   └── index.ts
│   │
│   └── app/
│       ├── launchpad/
│       │   ├── page.tsx                ← Main entry point
│       │   ├── recover/
│       │   │   └── page.tsx            ← Magic link recovery
│       │   └── components/
│       │       ├── LaunchpadWizard.tsx
│       │       ├── ProgressTracker.tsx
│       │       ├── fields/
│       │       │   ├── MultiFileUploader.tsx
│       │       │   ├── RepeaterField.tsx
│       │       │   ├── RangeSlider.tsx
│       │       │   ├── GuidedMultiSelect.tsx
│       │       │   ├── ColorPicker.tsx
│       │       │   └── index.ts
│       │       └── steps/
│       │           ├── Step1Identity.tsx
│       │           ├── Step2BusinessModel.tsx
│       │           ├── Step3Strategy.tsx
│       │           ├── Step4Design.tsx
│       │           ├── Step5Content.tsx
│       │           ├── Step6Pages.tsx
│       │           ├── Step7Assets.tsx
│       │           ├── Step8Review.tsx
│       │           └── index.ts
│       │
│       └── api/
│           └── launchpad/
│               ├── save/route.ts
│               ├── submit/route.ts
│               ├── upload/route.ts
│               └── recover/route.ts
```

---

## Step-by-Step Installation

### 1. Database Migration

Open **Supabase SQL Editor** and run:

```sql
-- Contents of supabase/migrations/003_client_intakes.sql
```

Or run via CLI:
```bash
supabase migration up
```

### 2. Copy Files

```bash
# From your project root:
cp -r launchpad-build/src/types/launchpad.ts src/types/
cp -r launchpad-build/src/hooks/* src/hooks/
cp -r launchpad-build/src/app/launchpad src/app/
cp -r launchpad-build/src/app/api/launchpad src/app/api/
```

### 3. Verify Imports

Check these paths match your project:
- `@/types/launchpad` → points to your types folder
- `@/lib/supabase` → points to your Supabase client
- `@/lib/sendgrid` → points to your email utility (optional)

### 4. Environment Variables

Ensure these are set:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SENDGRID_API_KEY=your-key (optional, for emails)
```

### 5. Test

```bash
npm run dev
# Visit http://localhost:3000/launchpad
```

---

## Features Included

| Feature | Status |
|---------|--------|
| 8-Step Wizard | ✅ |
| Auto-save to localStorage | ✅ |
| Auto-save to Supabase | ✅ |
| Progress indicator | ✅ |
| Business model fork (service/ecommerce/hybrid) | ✅ |
| Copywriting upsell trigger | ✅ |
| Vibe sliders (1-10 scales) | ✅ |
| Multi-file uploader | ✅ |
| Repeater fields (testimonials, team) | ✅ |
| Magic link recovery | ✅ |
| Mobile responsive | ✅ |
| Dark theme | ✅ |

---

## Customization

### Change Branding
Edit `src/app/launchpad/page.tsx`:
- Logo in header
- Company name
- Footer links

### Modify Questions
Edit individual step components in `src/app/launchpad/components/steps/`

### Change Styling
All components use Tailwind CSS with these base patterns:
- Input: `bg-gray-900/50 border border-gray-800`
- Focus: `focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500`
- Selected card: `border-cyan-500 bg-cyan-500/10`

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/launchpad/save` | POST | Auto-save draft |
| `/api/launchpad/submit` | POST | Final submission |
| `/api/launchpad/upload` | POST | File uploads |
| `/api/launchpad/recover` | GET/POST | Magic link recovery |

---

## Troubleshooting

### "Cannot find module '@/types/launchpad'"
→ Verify `tsconfig.json` has path alias configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### "Supabase connection failed"
→ Check environment variables are set correctly

### "Upload fails"
→ Create Supabase storage bucket named `assets` with public access

---

## Questions?

This build is ready for production use. Adjust branding, colors, and copy to match your needs.

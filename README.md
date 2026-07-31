# Barangay 418 Online Registration Website

A responsive online registration website for Barangay 418 residents to register their family information. Data is exported as Excel (same format as batch import template) for import into the offline RBI-DBIS system.

## Features

- 4-step registration form (Family Details → Head → Members → Review)
- Mobile-first responsive design
- Download as Excel button
- Excel format matches batch import template

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
cd D:\Backup\BSIT-3B\SYSARCH\registration-website-vercel
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

1. Push this project to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repository
4. Vercel will auto-detect Next.js and configure the build
5. Click "Deploy"

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   └── layout.tsx        # Root layout
├── components/
│   ├── RegistrationForm.tsx  # Main 4-step form
│   └── steps/
│       ├── FamilyDetailsStep.tsx   # Step 1: Address, pets, vehicles
│       ├── FamilyHeadStep.tsx      # Step 2: Head personal info
│       ├── FamilyMembersStep.tsx   # Step 3: Add family members
│       └── ReviewStep.tsx          # Step 4: Summary + Export
└── lib/
    └── excelExport.ts   # Excel export functionality
```

## Excel Export Format

The exported Excel matches the batch import template format:

| Column | Description |
|--------|-------------|
| family_id | Auto-generated (FAM-{timestamp}) |
| relationship | Head, Spouse, Child, etc. |
| block | Block number (1, 2, 3) |
| household_number | Household number (001-100) |
| house_number, street_name, alley | Address |
| has_pets, number_of_dogs, etc. | Pet information |
| has_vehicles, number_of_motorcycles, etc. | Vehicle information |
| last_name, first_name, etc. | Personal information |
| is_voter, is_pwd, is_solo_parent | Status flags |

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Export:** xlsx library
- **Deployment:** Vercel

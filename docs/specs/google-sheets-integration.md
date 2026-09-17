# Google Sheets Integration Spec

Handoff spec for wiring the Barangay 418 online registration site to a Google
Spreadsheet so collected registrations can be exported and imported into the
offline RBI-DBIS system.

## Repos / files to read first

- **Website repo:** `registration-website-vercel`
  - `src/lib/excelExport.ts` — already builds the registration rows and includes
    `registered_at`. **Reuse this row-building logic** for the Sheets append
    (extract a shared `buildRegistrationRows(data, submittedAt)` so the Excel
    export and the API route stay identical).
  - `src/components/RegistrationForm.tsx`, `src/lib/validation.ts` — form data
    and validation.
  - `src/app/` — currently only `page.tsx` / `layout.tsx`; there is **no** API
    route yet.
- **Offline system repo (reference only, do not modify unless asked):**
  `rbi-dbis`
  - `packages/desktop/src/components/ui/BatchImportModal.tsx` → `TEMPLATE_COLUMNS`
    (the authoritative 33 columns).
  - `packages/server/src/controllers/residentController.ts` →
    `batchImportResidents`.
  - `packages/server/src/services/familyImportValidation.ts` → required fields.

## DO NOT do (human-only, handled by the account owner)

Creating the Google Cloud project, enabling the Google Sheets API, creating the
service account, generating/downloading its JSON key, and sharing the
spreadsheet. Those come from the environment variables below. **Do not attempt
console/account setup.**

## Environment variables (assume provided in Vercel)

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY` (contains newlines; handle `\n`)
- `GOOGLE_SPREADSHEET_ID`
- `GOOGLE_SHEET_NAME` (tab name)

## Data contract — 33 columns, exact names, this order

```
family_id, relationship, block, household_number, house_number, street_name, alley,
has_pets, number_of_dogs, number_of_cats, other_animals, has_vehicles,
number_of_motorcycles, motorcycle_plate_numbers, number_of_other_vehicles, vehicle_plate_numbers,
last_name, first_name, middle_name, suffix, date_of_birth, place_of_birth, civil_status, sex,
contact_number, occupation, is_student, education_level, is_voter, is_pwd, is_solo_parent,
is_owner, registered_at
```

Rules:

- **One row per resident** (head + members). Repeat household/address/pet/vehicle
  fields on **every** row.
- `family_id`: unique per submission (e.g. `FAM-<epoch-ms>-<rand>`), identical on
  all of that family's rows.
- `relationship` = `"Head"` for the head; member relationship otherwise.

## Value formats

- Booleans: `"Yes"` / `"No"`. Sex: `"Male"` / `"Female"`.
- `date_of_birth`: `YYYY-MM-DD`.
- `registered_at`: ISO 8601 date+time, e.g. `2026-09-18T14:30:00.000Z` (UTC),
  **generated server-side at write time**, the same value on every row of a
  submission.
- Integers as strings; blanks allowed for optional fields.

## Text preservation (critical)

Write with `valueInputOption: "RAW"` and/or set these columns'
`numberFormat.type = "TEXT"`:

`household_number`, `contact_number`, `date_of_birth`, `registered_at`.

Otherwise Sheets coerces `001` → `1`, phone numbers lose the leading `0`, and
dates become date cells that break the offline import.

## Implementation

- Add a Next.js App Router **server** route: `src/app/api/submit/route.ts` (POST).
  The key must **never** be exposed to the browser.
- Validate input with existing `src/lib/validation.ts`; build the 33-column rows;
  append:
  - `sheets.spreadsheets.values.append`
  - range: `'<GOOGLE_SHEET_NAME>'!A:AG` (33 columns = A..AG)
  - `valueInputOption: "RAW"`, `insertDataOption: "INSERT_ROWS"`
- Write the **header row once** (exact names above).
- Libraries: `googleapis` (service-account JWT) or `google-spreadsheet`.
- Return a JSON success/error response; the client shows a confirmation
  (currently it downloads Excel — keep that or replace with the submit call).

## Offline consumption (context, for correctness)

- The sheet will be exported (File → Download → .xlsx / .csv) and imported via
  the offline **Batch Import**.
- Offline import reads **only the first worksheet** → keep **one accumulating
  tab**.
- Import is **create-only**: duplicates matched by `name + date_of_birth` are
  skipped.

## Security

- Credentials server-side only; never commit the key.
- Sanitize/limit input; add basic spam protection (honeypot/CAPTCHA) since the
  form is public.
- The sheet contains residents' PII — restrict access to the service account +
  barangay.

## Human setup checklist (for the account owner)

1. Create/select a Google Cloud project.
2. Enable the **Google Sheets API**.
3. Create a **service account** and a **JSON key**; download it.
4. Create/choose the target **Google Sheet** and **Share** it with the service
   account email (`...@....iam.gserviceaccount.com`) as **Editor**.
5. Provide the four environment values above (never commit the key).

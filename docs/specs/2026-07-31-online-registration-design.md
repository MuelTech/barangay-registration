# Online Registration Website Design

## Overview

A responsive online registration website for Barangay 418 residents to register their family information. Data is exported as Excel (same format as batch import template) for import into the offline system.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (responsive, mobile-first)
- **Data Storage:** Google Sheets API (future)
- **Deployment:** Vercel

## Form Steps

### Step 1: Family Details
- Block (1, 2, 3)
- Household Number (001-100)
- House Number, Street Name, Alley
- Pets (Yes/No → dogs, cats, other)
- Vehicles (Yes/No → motorcycles, other)

### Step 2: Family Head
- Name (First, Middle, Last, Suffix)
- Birth Date, Birth Place
- Civil Status, Sex
- Occupation, Contact Number
- Student (Yes/No → Education Level)
- Voter, PWD, Solo Parent checkboxes

### Step 3: Family Members
- Add multiple members
- Same fields as Family Head + Relationship
- Collapsible cards for each member

### Step 4: Review & Submit
- Summary of all data
- Download as Excel button
- Submit button (future: Google Sheets)

## Export Format

Same as batch import template:
- family_id, relationship
- block, household_number, house_number, street_name, alley
- has_pets, number_of_dogs, number_of_cats, other_animals
- has_vehicles, number_of_motorcycles, motorcycle_plate_numbers, number_of_other_vehicles, vehicle_plate_numbers
- last_name, first_name, middle_name, suffix, date_of_birth, place_of_birth, civil_status, sex, contact_number, occupation, is_student, education_level, is_voter, is_pwd, is_solo_parent, is_owner

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly inputs
- Collapsible sections on mobile

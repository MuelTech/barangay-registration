export interface ValidationErrors {
  [key: string]: string;
}

export const SEXES = ["Male", "Female"] as const;
export const SUFFIXES = ["Jr.", "Sr.", "II", "III", "IV"] as const;
export const CIVIL_STATUSES = [
  "Single",
  "Married",
  "Widowed",
  "Separated",
  "Divorced",
] as const;
export const OCCUPATIONS = [
  "Employed",
  "Self-Employed",
  "Unemployed",
  "Student",
] as const;
export const EDUCATION_LEVELS = [
  "Day Care",
  "Kinder",
  "Elementary",
  "High School",
  "College",
  "Vocational",
] as const;

/** Minimum plausible age per education level (obvious impossibilities only). */
export const EDUCATION_MIN_AGE: Record<string, number> = {
  "Day Care": 2,
  Kinder: 4,
  Elementary: 5,
  "High School": 11,
  College: 15,
  Vocational: 15,
};

export const VOTER_MIN_AGE = 18;

function canonical(value: string, allowed: readonly string[]): string | undefined {
  const v = value.trim().toLowerCase();
  return allowed.find((a) => a.toLowerCase() === v);
}

export function toTitleCase(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(
      /(^|[\s\-'.])(\p{L})/gu,
      (_m, sep: string, ch: string) => sep + ch.toUpperCase()
    );
}

export function ageFrom(date: Date, now: Date = new Date()): number {
  let age = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < date.getDate())) age--;
  return age;
}

function educationAndVoterErrors(data: {
  birthDate?: string;
  isStudent?: boolean;
  educationLevel?: string;
  isVoter?: boolean;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  const age = data.birthDate ? ageFrom(new Date(data.birthDate)) : null;
  const level = data.educationLevel
    ? canonical(data.educationLevel, EDUCATION_LEVELS)
    : undefined;

  if (data.isStudent) {
    if (!data.educationLevel) {
      errors.educationLevel = "Education level is required for students";
    } else if (!level) {
      errors.educationLevel = "Invalid education level";
    } else if (age !== null && age < (EDUCATION_MIN_AGE[level] ?? 0)) {
      errors.educationLevel = "Education level is too advanced for the given age";
    }
  } else if (data.educationLevel && !level) {
    errors.educationLevel = "Invalid education level";
  }

  if (data.isVoter && age !== null && age < VOTER_MIN_AGE) {
    errors.isVoter = "Voter must be at least 18 years old";
  }

  return errors;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (!/^09\d{9}$/.test(cleaned)) {
    return "Must be 11 digits starting with 09 (e.g., 09123456789)";
  }
  return null;
}

export function validateDate(dateStr: string, fieldName: string): string | null {
  if (!dateStr) return `${fieldName} is required`;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return `${fieldName} is invalid`;
  if (date > new Date()) return `${fieldName} cannot be in the future`;
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim() === "") return `${fieldName} is required`;
  return null;
}

export function validateName(value: string, fieldName: string): string | null {
  if (!value || value.trim() === "") return null; // use validateRequired for required check
  if (!/^[A-Za-z\s\-'.]+$/.test(value.trim())) {
    return `${fieldName} should only contain letters, spaces, hyphens, or apostrophes`;
  }
  return null;
}

export function validateDateOfBirth(dateStr: string): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid date format';
  const now = new Date();
  if (date > now) return 'Date cannot be in the future';
  const maxAge = new Date();
  maxAge.setFullYear(maxAge.getFullYear() - 150);
  if (date < maxAge) return 'Date is too old';
  return null;
}

export function validateNumber(value: string, min: number, max: number, fieldName: string): string | null {
  if (!value || value.trim() === '') return null;
  const num = parseInt(value, 10);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (num > max) return `${fieldName} must be at most ${max}`;
  return null;
}

export function validatePlateNumber(value: string): string | null {
  if (!value || value.trim() === '') return null;
  if (!/^[A-Za-z0-9\s\-]+$/.test(value.trim())) {
    return 'Plate number should only contain letters, numbers, spaces, or hyphens';
  }
  return null;
}

export function validateFamilyDetails(data: {
  block: string;
  householdNumber: string;
  houseNumber: string;
  streetName: string;
  alley: string;
  hasPets?: boolean;
  hasVehicles?: boolean;
  motorcyclePlateNumbers?: string;
  vehiclePlateNumbers?: string;
  numberOfDogs?: string;
  numberOfCats?: string;
  numberOfMotorcycles?: string;
  numberOfOtherVehicles?: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  const blockErr = validateRequired(data.block, "Block");
  if (blockErr) errors.block = blockErr;

  const hhErr = validateRequired(data.householdNumber, "Household Number");
  if (hhErr) errors.householdNumber = hhErr;

  const houseErr = validateRequired(data.houseNumber, "House Number");
  if (houseErr) errors.houseNumber = houseErr;

  const streetErr = validateRequired(data.streetName, "Street Name");
  if (streetErr) errors.streetName = streetErr;

  const alleyErr = validateRequired(data.alley, "Alley");
  if (alleyErr) errors.alley = alleyErr;

  if (data.hasPets) {
    const dogsErr = validateNumber(data.numberOfDogs || '', 0, 100, 'Number of Dogs');
    if (dogsErr) errors.numberOfDogs = dogsErr;

    const catsErr = validateNumber(data.numberOfCats || '', 0, 100, 'Number of Cats');
    if (catsErr) errors.numberOfCats = catsErr;
  }

  if (data.hasVehicles) {
    const plateErr1 = validatePlateNumber(data.motorcyclePlateNumbers || '');
    if (plateErr1) errors.motorcyclePlateNumbers = plateErr1;

    const plateErr2 = validatePlateNumber(data.vehiclePlateNumbers || '');
    if (plateErr2) errors.vehiclePlateNumbers = plateErr2;

    const motorcyclesErr = validateNumber(data.numberOfMotorcycles || '', 0, 50, 'Number of Motorcycles');
    if (motorcyclesErr) errors.numberOfMotorcycles = motorcyclesErr;

    const otherVehiclesErr = validateNumber(data.numberOfOtherVehicles || '', 0, 50, 'Number of Other Vehicles');
    if (otherVehiclesErr) errors.numberOfOtherVehicles = otherVehiclesErr;
  }

  return errors;
}

export function validateFamilyHead(data: {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  birthDate: string;
  birthPlace: string;
  civilStatus: string;
  sex: string;
  contactNumber: string;
  occupation: string;
  isStudent?: boolean;
  educationLevel?: string;
  isVoter?: boolean;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  const firstNameErr = validateRequired(data.firstName, "First Name");
  if (firstNameErr) {
    errors.firstName = firstNameErr;
  } else {
    const nameErr = validateName(data.firstName, "First Name");
    if (nameErr) errors.firstName = nameErr;
  }

  const lastNameErr = validateRequired(data.lastName, "Last Name");
  if (lastNameErr) {
    errors.lastName = lastNameErr;
  } else {
    const nameErr = validateName(data.lastName, "Last Name");
    if (nameErr) errors.lastName = nameErr;
  }

  if (data.middleName) {
    const middleNameErr = validateName(data.middleName, "Middle Name");
    if (middleNameErr) errors.middleName = middleNameErr;
  }

  if (data.suffix && !canonical(data.suffix, SUFFIXES)) {
    errors.suffix = "Invalid suffix";
  }

  if (!data.birthDate) {
    errors.birthDate = 'Birth Date is required';
  } else {
    const dateErr = validateDateOfBirth(data.birthDate);
    if (dateErr) errors.birthDate = dateErr;
  }

  const birthPlaceErr = validateRequired(data.birthPlace, "Birth Place");
  if (birthPlaceErr) errors.birthPlace = birthPlaceErr;

  if (!data.civilStatus) {
    errors.civilStatus = "Civil Status is required";
  } else if (!canonical(data.civilStatus, CIVIL_STATUSES)) {
    errors.civilStatus = "Invalid civil status";
  }

  if (!data.sex) {
    errors.sex = "Sex is required";
  } else if (!canonical(data.sex, SEXES)) {
    errors.sex = "Invalid sex";
  }

  const contactErr = validateRequired(data.contactNumber, "Contact Number");
  if (contactErr) {
    errors.contactNumber = contactErr;
  } else {
    const phoneErr = validatePhone(data.contactNumber);
    if (phoneErr) errors.contactNumber = phoneErr;
  }

  if (!data.occupation) {
    errors.occupation = "Occupation is required";
  } else if (!canonical(data.occupation, OCCUPATIONS)) {
    errors.occupation = "Invalid occupation";
  }

  Object.assign(errors, educationAndVoterErrors(data));

  return errors;
}

export function validateFamilyMember(
  data: {
    relationship: string;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix?: string;
    birthDate: string;
    civilStatus?: string;
    sex: string;
    contactNumber: string;
    occupation?: string;
    isStudent?: boolean;
    educationLevel?: string;
    isVoter?: boolean;
  },
  index: number
): ValidationErrors {
  const errors: ValidationErrors = {};
  const prefix = `member_${index}_`;

  const relationshipErr = validateRequired(data.relationship, "Relationship");
  if (relationshipErr) errors[`${prefix}relationship`] = relationshipErr;

  const firstNameErr = validateRequired(data.firstName, "First Name");
  if (firstNameErr) {
    errors[`${prefix}firstName`] = firstNameErr;
  } else {
    const nameErr = validateName(data.firstName, "First Name");
    if (nameErr) errors[`${prefix}firstName`] = nameErr;
  }

  const lastNameErr = validateRequired(data.lastName, "Last Name");
  if (lastNameErr) {
    errors[`${prefix}lastName`] = lastNameErr;
  } else {
    const nameErr = validateName(data.lastName, "Last Name");
    if (nameErr) errors[`${prefix}lastName`] = nameErr;
  }

  if (data.middleName) {
    const middleNameErr = validateName(data.middleName, "Middle Name");
    if (middleNameErr) errors[`${prefix}middleName`] = middleNameErr;
  }

  if (data.suffix && !canonical(data.suffix, SUFFIXES)) {
    errors[`${prefix}suffix`] = "Invalid suffix";
  }

  if (!data.birthDate) {
    errors[`${prefix}birthDate`] = 'Birth Date is required';
  } else {
    const dateErr = validateDateOfBirth(data.birthDate);
    if (dateErr) errors[`${prefix}birthDate`] = dateErr;
  }

  if (!data.sex) {
    errors[`${prefix}sex`] = "Sex is required";
  } else if (!canonical(data.sex, SEXES)) {
    errors[`${prefix}sex`] = "Invalid sex";
  }

  if (data.contactNumber) {
    const phoneErr = validatePhone(data.contactNumber);
    if (phoneErr) errors[`${prefix}contactNumber`] = phoneErr;
  }

  if (data.civilStatus && !canonical(data.civilStatus, CIVIL_STATUSES)) {
    errors[`${prefix}civilStatus`] = "Invalid civil status";
  }

  if (data.occupation && !canonical(data.occupation, OCCUPATIONS)) {
    errors[`${prefix}occupation`] = "Invalid occupation";
  }

  const extra = educationAndVoterErrors(data);
  if (extra.educationLevel) errors[`${prefix}educationLevel`] = extra.educationLevel;
  if (extra.isVoter) errors[`${prefix}isVoter`] = extra.isVoter;

  return errors;
}

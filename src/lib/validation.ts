export interface ValidationErrors {
  [key: string]: string;
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

export function validateFamilyDetails(data: {
  block: string;
  householdNumber: string;
  houseNumber: string;
  streetName: string;
  alley: string;
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

  return errors;
}

export function validateFamilyHead(data: {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  civilStatus: string;
  sex: string;
  contactNumber: string;
  occupation: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  const firstNameErr = validateRequired(data.firstName, "First Name");
  if (firstNameErr) errors.firstName = firstNameErr;

  const lastNameErr = validateRequired(data.lastName, "Last Name");
  if (lastNameErr) errors.lastName = lastNameErr;

  const birthDateErr = validateDate(data.birthDate, "Birth Date");
  if (birthDateErr) errors.birthDate = birthDateErr;

  const birthPlaceErr = validateRequired(data.birthPlace, "Birth Place");
  if (birthPlaceErr) errors.birthPlace = birthPlaceErr;

  const civilStatusErr = validateRequired(data.civilStatus, "Civil Status");
  if (civilStatusErr) errors.civilStatus = civilStatusErr;

  const sexErr = validateRequired(data.sex, "Sex");
  if (sexErr) errors.sex = sexErr;

  const contactErr = validateRequired(data.contactNumber, "Contact Number");
  if (contactErr) {
    errors.contactNumber = contactErr;
  } else {
    const phoneErr = validatePhone(data.contactNumber);
    if (phoneErr) errors.contactNumber = phoneErr;
  }

  const occupationErr = validateRequired(data.occupation, "Occupation");
  if (occupationErr) errors.occupation = occupationErr;

  return errors;
}

export function validateFamilyMember(
  data: {
    relationship: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    sex: string;
    contactNumber: string;
  },
  index: number
): ValidationErrors {
  const errors: ValidationErrors = {};
  const prefix = `member_${index}_`;

  const relationshipErr = validateRequired(data.relationship, "Relationship");
  if (relationshipErr) errors[`${prefix}relationship`] = relationshipErr;

  const firstNameErr = validateRequired(data.firstName, "First Name");
  if (firstNameErr) errors[`${prefix}firstName`] = firstNameErr;

  const lastNameErr = validateRequired(data.lastName, "Last Name");
  if (lastNameErr) errors[`${prefix}lastName`] = lastNameErr;

  const birthDateErr = validateDate(data.birthDate, "Birth Date");
  if (birthDateErr) errors[`${prefix}birthDate`] = birthDateErr;

  const sexErr = validateRequired(data.sex, "Sex");
  if (sexErr) errors[`${prefix}sex`] = sexErr;

  if (data.contactNumber) {
    const phoneErr = validatePhone(data.contactNumber);
    if (phoneErr) errors[`${prefix}contactNumber`] = phoneErr;
  }

  return errors;
}

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

  if (data.hasVehicles) {
    const plateErr1 = validatePlateNumber(data.motorcyclePlateNumbers || '');
    if (plateErr1) errors.motorcyclePlateNumbers = plateErr1;

    const plateErr2 = validatePlateNumber(data.vehiclePlateNumbers || '');
    if (plateErr2) errors.vehiclePlateNumbers = plateErr2;

    const dogsErr = validateNumber(data.numberOfDogs || '', 0, 100, 'Number of Dogs');
    if (dogsErr) errors.numberOfDogs = dogsErr;

    const catsErr = validateNumber(data.numberOfCats || '', 0, 100, 'Number of Cats');
    if (catsErr) errors.numberOfCats = catsErr;

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
  birthDate: string;
  birthPlace: string;
  civilStatus: string;
  sex: string;
  contactNumber: string;
  occupation: string;
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

  if (!data.birthDate) {
    errors.birthDate = 'Birth Date is required';
  } else {
    const dateErr = validateDateOfBirth(data.birthDate);
    if (dateErr) errors.birthDate = dateErr;
  }

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
    middleName: string;
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

  if (!data.birthDate) {
    errors[`${prefix}birthDate`] = 'Birth Date is required';
  } else {
    const dateErr = validateDateOfBirth(data.birthDate);
    if (dateErr) errors[`${prefix}birthDate`] = dateErr;
  }

  const sexErr = validateRequired(data.sex, "Sex");
  if (sexErr) errors[`${prefix}sex`] = sexErr;

  if (data.contactNumber) {
    const phoneErr = validatePhone(data.contactNumber);
    if (phoneErr) errors[`${prefix}contactNumber`] = phoneErr;
  }

  return errors;
}

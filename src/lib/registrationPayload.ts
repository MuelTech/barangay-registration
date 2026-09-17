import {
  FamilyData,
  FamilyMemberData,
} from "./registrationRows";
import {
  ValidationErrors,
  toTitleCase,
  validateFamilyDetails,
  validateFamilyHead,
  validateFamilyMember,
} from "./validation";

export const MAX_MEMBERS = 30;
const MAX_STRING_LENGTH = 300;

const str = (value: unknown, maxLength: number = MAX_STRING_LENGTH): string => {
  if (typeof value === "string") return value.trim().slice(0, maxLength);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

const bool = (value: unknown): boolean => value === true;

const record = (value: unknown): Record<string, unknown> => {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
};

const toMember = (input: unknown): FamilyMemberData => {
  const member = record(input);
  return {
    firstName: toTitleCase(str(member.firstName)),
    middleName: toTitleCase(str(member.middleName)),
    lastName: toTitleCase(str(member.lastName)),
    suffix: str(member.suffix),
    birthDate: str(member.birthDate),
    birthPlace: toTitleCase(str(member.birthPlace)),
    civilStatus: str(member.civilStatus),
    sex: str(member.sex),
    contactNumber: str(member.contactNumber),
    occupation: str(member.occupation),
    isStudent: bool(member.isStudent),
    educationLevel: str(member.educationLevel),
    isVoter: bool(member.isVoter),
    isPwd: bool(member.isPwd),
    isSoloParent: bool(member.isSoloParent),
    isOwner: bool(member.isOwner),
    relationship: str(member.relationship),
  };
};

export type ParseRegistrationResult =
  | { ok: true; data: FamilyData }
  | { ok: false; errors: ValidationErrors };

export function parseRegistrationPayload(
  input: unknown
): ParseRegistrationResult {
  const root = record(input);
  const rawMembers = Array.isArray(root.members) ? root.members : [];

  const data: FamilyData = {
    block: str(root.block),
    householdNumber: str(root.householdNumber),
    houseNumber: str(root.houseNumber),
    streetName: str(root.streetName),
    alley: str(root.alley),
    hasPets: bool(root.hasPets),
    numberOfDogs: str(root.numberOfDogs),
    numberOfCats: str(root.numberOfCats),
    otherAnimals: str(root.otherAnimals),
    hasVehicles: bool(root.hasVehicles),
    numberOfMotorcycles: str(root.numberOfMotorcycles),
    motorcyclePlateNumbers: str(root.motorcyclePlateNumbers),
    numberOfOtherVehicles: str(root.numberOfOtherVehicles),
    vehiclePlateNumbers: str(root.vehiclePlateNumbers),
    head: toMember(root.head),
    members: rawMembers.slice(0, MAX_MEMBERS).map(toMember),
  };

  const errors: ValidationErrors = {};

  if (rawMembers.length > MAX_MEMBERS) {
    errors.members = `A maximum of ${MAX_MEMBERS} family members is allowed`;
  }

  Object.assign(errors, validateFamilyDetails(data));
  Object.assign(errors, validateFamilyHead(data.head));
  data.members.forEach((member, index) => {
    Object.assign(errors, validateFamilyMember(member, index));
  });

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}

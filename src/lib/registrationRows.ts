export interface FamilyMemberData {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthDate: string;
  birthPlace: string;
  civilStatus: string;
  sex: string;
  contactNumber: string;
  occupation: string;
  isStudent: boolean;
  educationLevel: string;
  isVoter: boolean;
  isPwd: boolean;
  isSoloParent: boolean;
  isOwner: boolean;
  relationship: string;
}

export interface FamilyData {
  block: string;
  householdNumber: string;
  houseNumber: string;
  streetName: string;
  alley: string;
  hasPets: boolean;
  numberOfDogs: string;
  numberOfCats: string;
  otherAnimals: string;
  hasVehicles: boolean;
  numberOfMotorcycles: string;
  motorcyclePlateNumbers: string;
  numberOfOtherVehicles: string;
  vehiclePlateNumbers: string;
  head: FamilyMemberData;
  members: FamilyMemberData[];
}

export const REGISTRATION_HEADERS = [
  "family_id",
  "relationship",
  "block",
  "household_number",
  "house_number",
  "street_name",
  "alley",
  "has_pets",
  "number_of_dogs",
  "number_of_cats",
  "other_animals",
  "has_vehicles",
  "number_of_motorcycles",
  "motorcycle_plate_numbers",
  "number_of_other_vehicles",
  "vehicle_plate_numbers",
  "last_name",
  "first_name",
  "middle_name",
  "suffix",
  "date_of_birth",
  "place_of_birth",
  "civil_status",
  "sex",
  "contact_number",
  "occupation",
  "is_student",
  "education_level",
  "is_voter",
  "is_pwd",
  "is_solo_parent",
  "is_owner",
  "registered_at",
] as const;

export type RegistrationRow = string[];

const text = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const yesNo = (value: boolean): string => (value ? "Yes" : "No");

export function createFamilyId(now: number = Date.now()): string {
  const random = Math.random().toString(36).slice(2, 8).padEnd(6, "0");
  return `FAM-${now}-${random}`;
}

export function buildRegistrationRows(
  data: FamilyData,
  submittedAt: string
): { headers: string[]; rows: RegistrationRow[] } {
  const familyId = createFamilyId();

  const baseRow: Record<string, string> = {
    family_id: familyId,
    block: text(data.block),
    household_number: text(data.householdNumber),
    house_number: text(data.houseNumber),
    street_name: text(data.streetName),
    alley: text(data.alley),
    has_pets: yesNo(data.hasPets),
    number_of_dogs: text(data.numberOfDogs),
    number_of_cats: text(data.numberOfCats),
    other_animals: text(data.otherAnimals),
    has_vehicles: yesNo(data.hasVehicles),
    number_of_motorcycles: text(data.numberOfMotorcycles),
    motorcycle_plate_numbers: text(data.motorcyclePlateNumbers),
    number_of_other_vehicles: text(data.numberOfOtherVehicles),
    vehicle_plate_numbers: text(data.vehiclePlateNumbers),
    registered_at: submittedAt,
  };

  const memberRow = (
    member: FamilyMemberData,
    relationship: string
  ): Record<string, string> => ({
    ...baseRow,
    relationship,
    last_name: text(member.lastName),
    first_name: text(member.firstName),
    middle_name: text(member.middleName),
    suffix: text(member.suffix),
    date_of_birth: text(member.birthDate),
    place_of_birth: text(member.birthPlace),
    civil_status: text(member.civilStatus),
    sex: text(member.sex),
    contact_number: text(member.contactNumber),
    occupation: text(member.occupation),
    is_student: yesNo(member.isStudent),
    education_level: text(member.educationLevel),
    is_voter: yesNo(member.isVoter),
    is_pwd: yesNo(member.isPwd),
    is_solo_parent: yesNo(member.isSoloParent),
    is_owner: yesNo(member.isOwner),
  });

  const memberRows = [
    memberRow(data.head, "Head"),
    ...data.members.map((member) => memberRow(member, member.relationship)),
  ];

  const rows = memberRows.map((row) =>
    REGISTRATION_HEADERS.map((header) => row[header] ?? "")
  );

  return { headers: [...REGISTRATION_HEADERS], rows };
}

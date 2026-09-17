import * as XLSX from "xlsx";

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

const toYesNo = (value: boolean): string => (value ? "Yes" : "No");

export function exportToExcel(data: FamilyData) {
  const submittedAt = new Date();
  const familyId = `FAM-${submittedAt.getTime()}`;
  const rows: Record<string, string>[] = [];

  const baseFields = {
    family_id: familyId,
    block: data.block,
    household_number: data.householdNumber,
    house_number: data.houseNumber,
    street_name: data.streetName,
    alley: data.alley,
    has_pets: toYesNo(data.hasPets),
    number_of_dogs: data.numberOfDogs,
    number_of_cats: data.numberOfCats,
    other_animals: data.otherAnimals,
    has_vehicles: toYesNo(data.hasVehicles),
    number_of_motorcycles: data.numberOfMotorcycles,
    motorcycle_plate_numbers: data.motorcyclePlateNumbers,
    number_of_other_vehicles: data.numberOfOtherVehicles,
    vehicle_plate_numbers: data.vehiclePlateNumbers,
  };

  const addMemberRow = (member: FamilyMemberData) => {
    rows.push({
      ...baseFields,
      relationship: member.relationship,
      last_name: member.lastName,
      first_name: member.firstName,
      middle_name: member.middleName,
      suffix: member.suffix,
      date_of_birth: member.birthDate,
      place_of_birth: member.birthPlace,
      civil_status: member.civilStatus,
      sex: member.sex,
      contact_number: member.contactNumber,
      occupation: member.occupation,
      is_student: toYesNo(member.isStudent),
      education_level: member.educationLevel,
      is_voter: toYesNo(member.isVoter),
      is_pwd: toYesNo(member.isPwd),
      is_solo_parent: toYesNo(member.isSoloParent),
      is_owner: toYesNo(member.isOwner),
      registered_at: submittedAt.toISOString(),
    });
  };

  addMemberRow({ ...data.head, relationship: "Head" });
  data.members.forEach((member) => addMemberRow(member));

  const headers = Object.keys(rows[0]);
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registration");

  const colWidths = headers.map((h) => ({ wch: Math.max(h.length + 2, 15) }));
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, `Barangay418_Registration_${familyId}.xlsx`);
}

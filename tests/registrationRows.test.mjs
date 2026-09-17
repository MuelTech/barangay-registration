import test from "node:test";
import assert from "node:assert/strict";
import {
  REGISTRATION_HEADERS,
  buildRegistrationRows,
  createFamilyId,
} from "../src/lib/registrationRows.ts";

const EXPECTED_HEADERS = [
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
];

const baseMember = {
  firstName: "Juan",
  middleName: "Dela",
  lastName: "Cruz",
  suffix: "",
  birthDate: "1990-01-02",
  birthPlace: "Manila",
  civilStatus: "Married",
  sex: "Male",
  contactNumber: "09123456789",
  occupation: "Teacher",
  isStudent: false,
  educationLevel: "College",
  isVoter: true,
  isPwd: false,
  isSoloParent: false,
  isOwner: true,
  relationship: "",
};

const baseData = {
  block: "1",
  householdNumber: "001",
  houseNumber: "12",
  streetName: "Rizal",
  alley: "A",
  hasPets: true,
  numberOfDogs: "2",
  numberOfCats: "0",
  otherAnimals: "",
  hasVehicles: true,
  numberOfMotorcycles: "1",
  motorcyclePlateNumbers: "ABC-123",
  numberOfOtherVehicles: "0",
  vehiclePlateNumbers: "",
  head: baseMember,
  members: [{ ...baseMember, firstName: "Maria", relationship: "Spouse", isOwner: false }],
};

const submittedAt = "2026-09-18T14:30:00.000Z";

test("headers are exactly the 33 spec columns in order", () => {
  assert.equal(REGISTRATION_HEADERS.length, 33);
  assert.deepEqual([...REGISTRATION_HEADERS], EXPECTED_HEADERS);
});

test("produces one row per member with head first", () => {
  const { rows } = buildRegistrationRows(baseData, submittedAt);
  assert.equal(rows.length, 2);
  assert.equal(rows[0][REGISTRATION_HEADERS.indexOf("relationship")], "Head");
  assert.equal(rows[1][REGISTRATION_HEADERS.indexOf("relationship")], "Spouse");
});

test("every row shares one family_id and the submitted_at timestamp", () => {
  const { rows } = buildRegistrationRows(baseData, submittedAt);
  const idIndex = REGISTRATION_HEADERS.indexOf("family_id");
  const atIndex = REGISTRATION_HEADERS.indexOf("registered_at");
  assert.match(rows[0][idIndex], /^FAM-\d+-[a-z0-9]+$/);
  assert.equal(rows[0][idIndex], rows[1][idIndex]);
  assert.equal(rows[0][atIndex], submittedAt);
  assert.equal(rows[1][atIndex], submittedAt);
});

test("row length matches header length and preserves leading zeros", () => {
  const { rows } = buildRegistrationRows(baseData, submittedAt);
  assert.equal(rows[0].length, 33);
  assert.equal(
    rows[0][REGISTRATION_HEADERS.indexOf("household_number")],
    "001"
  );
  assert.equal(
    rows[1][REGISTRATION_HEADERS.indexOf("contact_number")],
    "09123456789"
  );
});

test("booleans render as Yes/No and repeat household fields on member rows", () => {
  const { rows } = buildRegistrationRows(baseData, submittedAt);
  assert.equal(rows[0][REGISTRATION_HEADERS.indexOf("has_pets")], "Yes");
  assert.equal(rows[1][REGISTRATION_HEADERS.indexOf("has_pets")], "Yes");
  assert.equal(rows[1][REGISTRATION_HEADERS.indexOf("is_owner")], "No");
  assert.equal(rows[0][REGISTRATION_HEADERS.indexOf("is_voter")], "Yes");
});

test("createFamilyId returns unique, well-formed ids", () => {
  const first = createFamilyId(1000);
  const second = createFamilyId(1000);
  assert.match(first, /^FAM-1000-[a-z0-9]+$/);
  assert.notEqual(first, second);
});

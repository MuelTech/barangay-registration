import test from "node:test";
import assert from "node:assert/strict";
import {
  EDUCATION_LEVELS,
  toTitleCase,
  validateFamilyDetails,
  validateFamilyHead,
  validateFamilyMember,
} from "../src/lib/validation.ts";

const head = {
  firstName: "Juan",
  middleName: "Dela",
  lastName: "Cruz",
  suffix: "",
  birthDate: "1990-01-02",
  birthPlace: "Manila",
  civilStatus: "Married",
  sex: "Male",
  contactNumber: "09123456789",
  occupation: "Employed",
  isStudent: false,
  educationLevel: "",
  isVoter: true,
  isPwd: false,
  isSoloParent: false,
  isOwner: true,
};

const details = {
  block: "1",
  householdNumber: "001",
  houseNumber: "12",
  streetName: "Rizal",
  alley: "A",
};

test("toTitleCase converts all-caps names", () => {
  assert.equal(toTitleCase("JUAN DELA CRUZ"), "Juan Dela Cruz");
  assert.equal(toTitleCase("O'BRIEN"), "O'Brien");
});

test("education levels include Day Care and Kinder", () => {
  assert.ok(EDUCATION_LEVELS.includes("Day Care"));
  assert.ok(EDUCATION_LEVELS.includes("Kinder"));
});

test("a valid head passes", () => {
  assert.deepEqual(validateFamilyHead(head), {});
});

test("rejects an invalid sex, civil status, and occupation", () => {
  assert.ok(validateFamilyHead({ ...head, sex: "X" }).sex);
  assert.ok(validateFamilyHead({ ...head, civilStatus: "Whatever" }).civilStatus);
  assert.ok(validateFamilyHead({ ...head, occupation: "Wizard" }).occupation);
});

test("rejects an invalid suffix", () => {
  assert.ok(validateFamilyHead({ ...head, suffix: "XII" }).suffix);
});

test("rejects a voter younger than 18", () => {
  assert.ok(
    validateFamilyHead({ ...head, birthDate: "2015-01-01", isVoter: true }).isVoter
  );
});

test("requires an education level for students", () => {
  assert.ok(
    validateFamilyHead({ ...head, isStudent: true, educationLevel: "" })
      .educationLevel
  );
});

test("rejects an impossible education level for the age", () => {
  assert.ok(
    validateFamilyHead({
      ...head,
      birthDate: "2025-01-01",
      isStudent: true,
      educationLevel: "College",
    }).educationLevel
  );
});

test("allows Day Care for a toddler", () => {
  assert.equal(
    validateFamilyHead({
      ...head,
      birthDate: "2023-06-01",
      isStudent: true,
      educationLevel: "Day Care",
    }).educationLevel,
    undefined
  );
});

test("validates pet counts when hasPets is true even if hasVehicles is false", () => {
  const errors = validateFamilyDetails({
    ...details,
    hasPets: true,
    hasVehicles: false,
    numberOfDogs: "-1",
    numberOfCats: "0",
  });
  assert.ok(errors.numberOfDogs);
});

test("member validation enforces sex enum with a prefixed key", () => {
  const errors = validateFamilyMember(
    { ...head, relationship: "Child", sex: "X" },
    0
  );
  assert.ok(errors.member_0_sex);
});

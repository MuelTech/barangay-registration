"use client";

import { useState } from "react";
import FamilyDetailsStep from "./steps/FamilyDetailsStep";
import FamilyHeadStep from "./steps/FamilyHeadStep";
import FamilyMembersStep from "./steps/FamilyMembersStep";
import ReviewStep from "./steps/ReviewStep";
import { FamilyData } from "@/lib/registrationRows";
import {
  validateFamilyDetails,
  validateFamilyHead,
  validateFamilyMember,
  ValidationErrors,
} from "@/lib/validation";

const STEPS = [
  { label: "Family Details", short: "Details" },
  { label: "Family Head", short: "Head" },
  { label: "Family Members", short: "Members" },
  { label: "Review & Submit", short: "Review" },
];

const defaultFamilyDetails = {
  block: "",
  householdNumber: "",
  houseNumber: "",
  streetName: "",
  alley: "",
  hasPets: false,
  numberOfDogs: "",
  numberOfCats: "",
  otherAnimals: "",
  hasVehicles: false,
  numberOfMotorcycles: "",
  motorcyclePlateNumbers: "",
  numberOfOtherVehicles: "",
  vehiclePlateNumbers: "",
};

const defaultHead = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  birthDate: "",
  birthPlace: "",
  civilStatus: "",
  sex: "",
  contactNumber: "",
  occupation: "",
  isStudent: false,
  educationLevel: "",
  isVoter: false,
  isPwd: false,
  isSoloParent: false,
  isOwner: false,
  relationship: "",
};

export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [familyDetails, setFamilyDetails] = useState(defaultFamilyDetails);
  const [head, setHead] = useState(defaultHead);
  const [members, setMembers] = useState<typeof defaultHead[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const familyData: FamilyData = {
    ...familyDetails,
    head,
    members,
  };

  const handleSubmit = async () => {
    setSubmitStatus("submitting");
    setSubmitError("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...familyData, company: honeypot }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        setSubmitStatus("error");
        const fieldErrors = result?.errors
          ? Object.values(result.errors as Record<string, string>)
          : [];
        setSubmitError(
          result?.error ??
            fieldErrors[0] ??
            "Unable to save registration. Please try again."
        );
        return;
      }

      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
      setSubmitError(
        "Network error. Please check your connection and try again."
      );
    }
  };

  const canNext = () => {
    if (step === 0) {
      const errs = validateFamilyDetails(familyDetails);
      return Object.keys(errs).length === 0;
    }
    if (step === 1) {
      const errs = validateFamilyHead(head);
      return Object.keys(errs).length === 0;
    }
    if (step === 2) {
      for (let i = 0; i < members.length; i++) {
        const errs = validateFamilyMember(members[i], i);
        if (Object.keys(errs).length > 0) return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    let newErrors: ValidationErrors = {};

    if (step === 0) {
      newErrors = validateFamilyDetails(familyDetails);
    } else if (step === 1) {
      newErrors = validateFamilyHead(head);
    } else if (step === 2) {
      for (let i = 0; i < members.length; i++) {
        const memberErrs = validateFamilyMember(members[i], i);
        newErrors = { ...newErrors, ...memberErrs };
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-2xl mx-auto p-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Barangay 418 Registration
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Step {step + 1} of {STEPS.length}: {STEPS[step].label}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-blue-600 transition-all duration-300"
              style={{
                width: `${(step / (STEPS.length - 1)) * 100}%`,
              }}
            />
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center z-10"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    i <= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-xs mt-1 hidden sm:block ${
                    i <= step ? "text-blue-600 font-medium" : "text-gray-500"
                  }`}
                >
                  {s.short}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-6">
          {step === 0 && (
            <FamilyDetailsStep
              data={familyDetails}
              onChange={(data) =>
                setFamilyDetails((prev) => ({ ...prev, ...data }))
              }
              errors={errors}
            />
          )}
          {step === 1 && (
            <FamilyHeadStep
              data={head}
              onChange={(data) => setHead((prev) => ({ ...prev, ...data }))}
              errors={errors}
              showHomeowner
            />
          )}
          {step === 2 && (
            <FamilyMembersStep
              members={members}
              onChange={setMembers}
              errors={errors}
            />
          )}
          {step === 3 && (
            <ReviewStep
              data={familyData}
              onSubmit={handleSubmit}
              status={submitStatus}
              error={submitError}
              honeypot={honeypot}
              onHoneypotChange={setHoneypot}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-300 transition-colors min-h-[48px]"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canNext()}
              className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-colors min-h-[48px] ${
                canNext()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

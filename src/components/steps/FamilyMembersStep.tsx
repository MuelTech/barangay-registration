"use client";

import { useState } from "react";
import FamilyHeadStep from "./FamilyHeadStep";

interface MemberData {
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

const RELATIONSHIP_OPTIONS = [
  { value: "Spouse", label: "Spouse" },
  { value: "Child", label: "Child" },
  { value: "Parent", label: "Parent" },
  { value: "Sibling", label: "Sibling" },
  { value: "Grandparent", label: "Grandparent" },
  { value: "Grandchild", label: "Grandchild" },
  { value: "Other", label: "Other" },
];

const EMPTY_MEMBER: MemberData = {
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

interface Props {
  members: MemberData[];
  onChange: (members: MemberData[]) => void;
  errors?: Record<string, string>;
}

export default function FamilyMembersStep({ members, onChange, errors }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addMember = () => {
    onChange([...members, { ...EMPTY_MEMBER }]);
    setExpandedIndex(members.length);
  };

  const updateMember = (index: number, data: Partial<MemberData>) => {
    const updated = [...members];
    updated[index] = { ...updated[index], ...data };
    onChange(updated);
  };

  const removeMember = (index: number) => {
    onChange(members.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
    else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Family Members
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Add all family members living in this household.
        </p>

        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                onClick={() =>
                  setExpandedIndex(
                    expandedIndex === index ? null : index
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : `Member ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.relationship || "No relationship set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMember(index);
                    }}
                    className="text-red-500 hover:text-red-700 p-1 rounded"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {expandedIndex === index && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship *
                    </label>
                    <select
                      value={member.relationship}
                      onChange={(e) =>
                        updateMember(index, {
                          relationship: e.target.value,
                        })
                      }
                      className={`w-full border rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors?.[`member_${index}_relationship`] ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">Select Relationship</option>
                      {RELATIONSHIP_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors?.[`member_${index}_relationship`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`member_${index}_relationship`]}
                      </p>
                    )}
                  </div>
                  <FamilyHeadStep
                    data={member}
                    onChange={(data) => updateMember(index, data)}
                    errors={Object.fromEntries(
                      Object.entries(errors || {}).filter(([key]) =>
                        key.startsWith(`member_${index}_`)
                      ).map(([key, value]) => [key.replace(`member_${index}_`, ""), value])
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="font-medium">No family members added yet</p>
            <p className="text-sm">
              Click &quot;Add Member&quot; to add family members.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={addMember}
          className="w-full mt-4 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl transition-colors min-h-[48px] flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Member
        </button>
      </div>
    </div>
  );
}

"use client";

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
  relationship: string;
}

const SUFFIX_OPTIONS = [
  { value: "Jr.", label: "Jr." },
  { value: "Sr.", label: "Sr." },
  { value: "III", label: "III" },
];

const CIVIL_STATUS_OPTIONS = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Widowed", label: "Widowed" },
  { value: "Separated", label: "Separated" },
];

const OCCUPATION_OPTIONS = [
  { value: "Employed", label: "Employed" },
  { value: "Self-Employed", label: "Self-Employed" },
  { value: "Unemployed", label: "Unemployed" },
  { value: "Student", label: "Student" },
];

const EDUCATION_LEVEL_OPTIONS = [
  { value: "Elementary", label: "Elementary" },
  { value: "High School", label: "High School" },
  { value: "College", label: "College" },
  { value: "Vocational", label: "Vocational" },
];

interface Props {
  data: MemberData;
  onChange: (data: Partial<MemberData>) => void;
  errors?: Record<string, string>;
}

export default function FamilyHeadStep({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={data.firstName}
                onChange={(e) => onChange({ firstName: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors?.firstName ? "border-red-500" : "border-gray-300"}`}
                placeholder="First name"
              />
              {errors?.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                value={data.middleName}
                onChange={(e) => onChange({ middleName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Middle name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={data.lastName}
                onChange={(e) => onChange({ lastName: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors?.lastName ? "border-red-500" : "border-gray-300"}`}
                placeholder="Last name"
              />
              {errors?.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suffix
              </label>
              <select
                value={data.suffix}
                onChange={(e) => onChange({ suffix: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">None</option>
                {SUFFIX_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date *
              </label>
              <input
                type="date"
                value={data.birthDate}
                onChange={(e) => onChange({ birthDate: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors?.birthDate ? "border-red-500" : "border-gray-300"}`}
              />
              {errors?.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Place *
              </label>
              <input
                type="text"
                value={data.birthPlace}
                onChange={(e) => onChange({ birthPlace: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors?.birthPlace ? "border-red-500" : "border-gray-300"}`}
                placeholder="City, Province"
              />
              {errors?.birthPlace && <p className="text-red-500 text-xs mt-1">{errors.birthPlace}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Civil Status
              </label>
              <select
                value={data.civilStatus}
                onChange={(e) => onChange({ civilStatus: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors?.civilStatus ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Status</option>
                {CIVIL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors?.civilStatus && <p className="text-red-500 text-xs mt-1">{errors.civilStatus}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sex *
              </label>
              <select
                value={data.sex}
                onChange={(e) => onChange({ sex: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors?.sex ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors?.sex && <p className="text-red-500 text-xs mt-1">{errors.sex}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contact & Employment
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupation
              </label>
              <select
                value={data.occupation}
                onChange={(e) => onChange({ occupation: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors?.occupation ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Occupation</option>
                {OCCUPATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors?.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                value={data.contactNumber}
                onChange={(e) =>
                  onChange({ contactNumber: e.target.value })
                }
                maxLength={11}
                className={`w-full border rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors?.contactNumber ? "border-red-500" : "border-gray-300"}`}
                placeholder="09XX XXX XXXX"
              />
              {errors?.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Student Status
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Is Student?
            </span>
            <button
              type="button"
              onClick={() => onChange({ isStudent: !data.isStudent })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                data.isStudent ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  data.isStudent ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {data.isStudent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education Level
              </label>
              <select
                value={data.educationLevel}
                onChange={(e) =>
                  onChange({ educationLevel: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Level</option>
                {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Information
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={data.isVoter}
              onChange={(e) => onChange({ isVoter: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Registered Voter
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={data.isPwd}
              onChange={(e) => onChange({ isPwd: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Person with Disability (PWD)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={data.isSoloParent}
              onChange={(e) =>
                onChange({ isSoloParent: e.target.checked })
              }
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Solo Parent
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

"use client";

interface FamilyMemberData {
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

interface FamilyData {
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

interface Props {
  data: FamilyData;
  onDownloadExcel: () => void;
}

function formatName(m: FamilyMemberData) {
  const parts = [m.firstName, m.middleName, m.lastName].filter(Boolean);
  let name = parts.join(" ");
  if (m.suffix) name += ` ${m.suffix}`;
  return name || "—";
}

export default function ReviewStep({ data, onDownloadExcel }: Props) {
  const allMembers = [
    { ...data.head, relationship: "Head" },
    ...data.members,
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Address Information
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Block</span>
            <p className="font-medium">{data.block || "—"}</p>
          </div>
          <div>
            <span className="text-gray-500">Household #</span>
            <p className="font-medium">{data.householdNumber || "—"}</p>
          </div>
          <div>
            <span className="text-gray-500">House #</span>
            <p className="font-medium">{data.houseNumber || "—"}</p>
          </div>
          <div>
            <span className="text-gray-500">Street</span>
            <p className="font-medium">{data.streetName || "—"}</p>
          </div>
          <div>
            <span className="text-gray-500">Alley</span>
            <p className="font-medium">{data.alley || "—"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pets & Vehicles
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-500">Pets</span>
            <p className="font-medium">
              {data.hasPets
                ? `${data.numberOfDogs || "0"} dogs, ${data.numberOfCats || "0"} cats${
                    data.otherAnimals ? `, ${data.otherAnimals}` : ""
                  }`
                : "None"}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Vehicles</span>
            <p className="font-medium">
              {data.hasVehicles
                ? `${data.numberOfMotorcycles || "0"} motorcycles${
                    data.motorcyclePlateNumbers
                      ? ` (${data.motorcyclePlateNumbers})`
                      : ""
                  }, ${data.numberOfOtherVehicles || "0"} other${
                    data.vehiclePlateNumbers
                      ? ` (${data.vehiclePlateNumbers})`
                      : ""
                  }`
                : "None"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Household Members ({allMembers.length})
        </h3>
        <div className="space-y-4">
          {allMembers.map((member, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                index === 0
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {formatName(member)}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    {member.relationship}
                  </p>
                </div>
                <div className="flex gap-2">
                  {member.isVoter && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Voter
                    </span>
                  )}
                  {member.isPwd && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      PWD
                    </span>
                  )}
                  {member.isSoloParent && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      Solo Parent
                    </span>
                  )}
                  {member.isStudent && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Student
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
                <div>
                  <span className="text-gray-400">DOB</span>
                  <p>{member.birthDate || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-400">Sex</span>
                  <p>{member.sex || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-400">Civil Status</span>
                  <p>{member.civilStatus || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-400">Occupation</span>
                  <p>{member.occupation || "—"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Export & Submit
        </h3>
        <div className="space-y-3">
          <button
            type="button"
            onClick={onDownloadExcel}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors min-h-[48px] flex items-center justify-center gap-2"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download as Excel
          </button>
          <button
            type="button"
            disabled
            className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-xl min-h-[48px] cursor-not-allowed"
          >
            Submit Registration (Coming Soon)
          </button>
          <p className="text-xs text-gray-500 text-center">
            Google Sheets integration coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

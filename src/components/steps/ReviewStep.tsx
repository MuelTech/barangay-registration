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
  onSubmit: () => void;
  status: "idle" | "submitting" | "success" | "error";
  error: string;
  honeypot: string;
  onHoneypotChange: (value: string) => void;
}

function formatName(m: FamilyMemberData) {
  const parts = [m.firstName, m.middleName, m.lastName].filter(Boolean);
  let name = parts.join(" ");
  if (m.suffix) name += ` ${m.suffix}`;
  return name || "—";
}

export default function ReviewStep({
  data,
  onSubmit,
  status,
  error,
  honeypot,
  onHoneypotChange,
}: Props) {
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
          Submit Registration
        </h3>
        <div className="space-y-3">
          <div
            aria-hidden="true"
            className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => onHoneypotChange(event.target.value)}
            />
          </div>

          {status === "success" ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              Registration submitted successfully. Thank you!
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onSubmit}
                disabled={status === "submitting"}
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors min-h-[48px] flex items-center justify-center gap-2 ${
                  status === "submitting"
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {status === "submitting"
                  ? "Submitting..."
                  : "Submit Registration"}
              </button>
              {status === "error" && error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <p className="text-xs text-gray-500 text-center">
                Your registration will be saved to the barangay Google Sheet.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

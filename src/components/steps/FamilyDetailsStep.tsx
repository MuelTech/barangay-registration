"use client";

interface FamilyDetailsData {
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
}

const BLOCK_OPTIONS = [
  { value: "1", label: "Block 1" },
  { value: "2", label: "Block 2" },
  { value: "3", label: "Block 3" },
];

interface Props {
  data: FamilyDetailsData;
  onChange: (data: Partial<FamilyDetailsData>) => void;
}

export default function FamilyDetailsStep({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Address Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Block
              </label>
              <select
                value={data.block}
                onChange={(e) => onChange({ block: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Block</option>
                {BLOCK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Household Number
              </label>
              <select
                value={data.householdNumber}
                onChange={(e) =>
                  onChange({ householdNumber: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Number</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const num = String(i + 1).padStart(3, "0");
                  return (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              House Number
            </label>
            <input
              type="text"
              value={data.houseNumber}
              onChange={(e) => onChange({ houseNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter house number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Name
            </label>
            <input
              type="text"
              value={data.streetName}
              onChange={(e) => onChange({ streetName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter street name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alley
            </label>
            <input
              type="text"
              value={data.alley}
              onChange={(e) => onChange({ alley: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter alley"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pets</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Has Pets?
            </span>
            <button
              type="button"
              onClick={() => onChange({ hasPets: !data.hasPets })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                data.hasPets ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  data.hasPets ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {data.hasPets && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dogs
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.numberOfDogs}
                  onChange={(e) =>
                    onChange({ numberOfDogs: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cats
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.numberOfCats}
                  onChange={(e) =>
                    onChange({ numberOfCats: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Animals
                </label>
                <input
                  type="text"
                  value={data.otherAnimals}
                  onChange={(e) =>
                    onChange({ otherAnimals: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 2 birds"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicles</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Has Vehicles?
            </span>
            <button
              type="button"
              onClick={() => onChange({ hasVehicles: !data.hasVehicles })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                data.hasVehicles ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  data.hasVehicles ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {data.hasVehicles && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Motorcycles
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.numberOfMotorcycles}
                  onChange={(e) =>
                    onChange({ numberOfMotorcycles: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motorcycle Plate Numbers
                </label>
                <input
                  type="text"
                  value={data.motorcyclePlateNumbers}
                  onChange={(e) =>
                    onChange({ motorcyclePlateNumbers: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. ABC 1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Other Vehicles
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.numberOfOtherVehicles}
                  onChange={(e) =>
                    onChange({ numberOfOtherVehicles: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Plate Numbers
                </label>
                <input
                  type="text"
                  value={data.vehiclePlateNumbers}
                  onChange={(e) =>
                    onChange({ vehiclePlateNumbers: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. XYZ 5678"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

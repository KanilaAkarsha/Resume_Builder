import {
  BriefcaseBusiness,
  Globe,
  GlobeIcon,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

const PersonalInfoForm = ({
  data,
  onChange,
  removeBackground,
  setRemoveBackground,
}) => {
  const handleChange = (field, value) => {
    onChange(
      {
        ...data, // Spread the existing data to retain other fields
        [field]: value,
      }, // Specify the section being updated
    );
  };
  const fields = [
    {
      key: "full_name",
      label: "Full Name",
      icon: User,
      type: "text",
      required: true,
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      required: true,
    },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    {
      key: "profession",
      label: "Profession",
      icon: BriefcaseBusiness,
      type: "text",
    },
    { key: "website", label: "Personal Website", icon: Globe, type: "url" },
    {
      key: "linkedin",
      label: "LinkedIn Profile",
      icon: GlobeIcon,
      type: "url",
    },
    {
      key: "github",
      label: "GitHub Profile",
      icon: GlobeIcon,
      type: "url",
    },
  ];
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h3>
      <p className="text-sm text-gray-600">
        Get Started with the Personal Information
      </p>
      <div className="flex items-center gap-2">
        <label>
          {data.image ? (
            <img
              src={
                typeof data.image === "string"
                  ? data.image
                  : URL.createObjectURL(data.image)
              }
              alt="User Avatar"
              className="w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80"
            />
          ) : (
            <div className="inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer">
              <User className="size-10 p-2.5 border rounded-full" />
              Upload user image
            </div>
          )}
          <input
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            className="hidden"
            onChange={(e) => {
              handleChange("image", e.target.files[0]);
            }}
          />
        </label>
        {typeof data.image === "object" && (
          <div className="flex flex-col gap-1 pl-4 text-sm">
            <p>Remove Background</p>
            <label className="relative inline-flex text-gray-900 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={removeBackground}
                onChange={() => setRemoveBackground((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
              <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transitions-transform duration-200 peer-checked:translate-x-4 ease-in-out"></span>
            </label>
          </div>
        )}
      </div>

      {fields.map((fields) => {
        const Icon = fields.icon;
        return (
          <div key={fields.key} className="space-y-1 mt-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Icon className="size-4" />
              {fields.label}
              {fields.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={fields.type}
              placeholder={`Enter Your ${fields.label}`}
              value={data[fields.key] || ""}
              onChange={(e) => handleChange(fields.key, e.target.value)}
              className="mt-1 w-full px-3  border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none py-2 transition-colors text-sm"
              required={fields.required}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PersonalInfoForm;

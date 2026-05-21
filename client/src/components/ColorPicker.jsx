import { Check, Palette } from "lucide-react";
import React from "react";

const ColorPicker = ({ selectedColor, onChange }) => {
  const colors = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Purple", value: "#9333ea" },
    { name: "Orange", value: "#d97706" },
    { name: "Red", value: "#dc2626" },
    { name: "Cyan", value: "#0284c7" },
    { name: "Green", value: "#16a34a" },
    { name: "Pink", value: "#ec4899" },
    { name: "Indigo", value: "#4f46e5" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Yellow", value: "#eab308" },
    { name: "Gray", value: "#6b7280" },
    { name: "Black", value: "#1F2937" },
  ];

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-r from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg">
        <Palette size={16} />{" "}
        <span className="max-sm:hidden">Accent Color</span>
      </button>
      {isOpen && (
        <div className="grid grid-cols-4 absolute top-full left-0 right-0 mt-2 w-60 gap-2 bg-white rounded-md shadow-sm border border-gray-200 p-3 z-10">
          {colors.map((color) => (
            <div
              key={color.value}
              onClick={() => {
                onChange(color.value);
                setIsOpen(false);
              }}
              className="relative  cursor-pointer group flex flex-col">
              <div
                className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors"
                style={{ backgroundColor: color.value }}></div>
              {selectedColor === color.value && (
                <div className="absolute top-0 left-0 right-0 bottom-4.5 flex items-center justify-center">
                  <Check className="size-5 text-white " />
                </div>
              )}
              <p className="text-xs text-center mt-1 text-gray-600">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;

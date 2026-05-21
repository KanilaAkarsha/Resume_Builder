import { Check, Layout } from "lucide-react";
import React from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview:
        "A Clean , Traditional resume layout with a left sidebar for personal info and skills, and a main section for experience and education.",
    },
    {
      id: "modern",
      name: "Modern",
      preview:
        "A Contemporary resume design with a top header for personal info, followed by sections for summary, experience, education, and skills.",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview:
        "A simple, clean resume design with a focus on readability and whitespace.",
    },
    {
      id: "minimal-image",
      name: "Minimal + Image",
      preview: "A minimal resume design with a profile image section.",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg">
        <Layout size={14} /> <span className="max-sm:hidden">Template</span>
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 w-xs space-y-3 bg-white rounded-md shadow-sm border border-gray-200 p-3 z-10">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }}
              className={`relative p-3 border border-md cursor-pointer transition-all ${selectedTemplate === template.id ? "bg-blue-100 border-blue-400" : "border-gray-300 hover:bg-gray-400 hover:bg-gray-100"}`}>
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="size-5 bg-blue-400 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic">
                  {template.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;

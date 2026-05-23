import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import API from "../configs/api";

const ProjectForm = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  const generateDescription = async (index) => {
    setGeneratingIndex(index);
    const project = data[index];
    const prompt = `Generate a concise and impactful project description for a resume based on the following details: Project Name: ${project.name}, Project Type: ${project.type}, Description: ${project.description}. Focus on key responsibilities and achievements.`;

    try {
      const { data } = await API.post(
        "/api/ai/enhance-project-desc",
        { userContent: prompt },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      updateProject(index, "description", data.enhancedProjectDescription);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setGeneratingIndex(-1);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Projects
          </h3>
          <p className="text-sm text-gray-500">Add Your Projects</p>
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors">
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-4 mt-6">
        {data.map((project, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <h4>Project #{index + 1}</h4>
              <button
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 transition-colors">
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="grid gap-3">
              <input
                type="text"
                placeholder="Project Name"
                value={project.name || ""}
                onChange={(e) => updateProject(index, "name", e.target.value)}
                className="px-3 py-2 text-sm rounded-lg"
              />
              <input
                type="text"
                placeholder="Project Type"
                value={project.type || ""}
                onChange={(e) => updateProject(index, "type", e.target.value)}
                className="px-3 py-2 text-sm rounded-lg"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Project Description
                  </label>
                  <button
                    onClick={() => generateDescription(index)}
                    disabled={generatingIndex === index || !project.name}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50">
                    {generatingIndex === index ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Enhance With AI
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Describe your project, the technologies used, and your role in it."
                  value={project.description || ""}
                  onChange={(e) =>
                    updateProject(index, "description", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;

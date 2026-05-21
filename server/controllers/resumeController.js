import imageKit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body; // Get user ID from auth middleware

    const newResume = await Resume.create({
      userId,
      title,
    });

    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    console.error("Error creating resume:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    await Resume.deleteOne({ _id: resumeId, userId });

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume.__v = undefined; // Hide version key in response
    resume.createdAt = undefined; // Hide createdAt in response
    resume.updatedAt = undefined; // Hide updatedAt in response

    return res.status(200).json({ resume });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, isPublic: true });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    console.error("Error fetching public resume:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;
    let resumeDataCopy = JSON.parse(resumeData);

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });
      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findByIdAndUpdate(
      { _id: resumeId, userId },
      resumeDataCopy,
      { new: true },
    );

    return res
      .status(200)
      .json({ message: "Resume updated successfully", resume });
  } catch (error) {
    console.error("Error updating resume:", error);
    return res.status(400).json({ message: error.message });
  }
};

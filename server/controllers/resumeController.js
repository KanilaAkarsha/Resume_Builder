import imageKit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";
import fs from "node:fs";
import mongoose from "mongoose";

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

    // The schema uses `public` as the field name. Query that field.
    console.log("getPublicResumeById: looking up resumeId=", resumeId);

    // If the URL accidentally contains the title or extra text (e.g. "<id> My Resume!"),
    // extract the first whitespace-delimited token and validate it as an ObjectId.
    const idToken = String(resumeId).split(" ")[0];
    if (!mongoose.isValidObjectId(idToken)) {
      console.warn("getPublicResumeById: invalid resume id token:", idToken);
      return res.status(400).json({ message: "Invalid resume id" });
    }

    // Accept either `public` or legacy `isPublic` field to be tolerant of past data.
    const resume = await Resume.findOne({
      _id: idToken,
      $or: [{ public: true }, { isPublic: true }],
    });
    console.log("getPublicResumeById: result=", !!resume);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Hide internal fields before returning
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    console.log("getPublicResumeById: returning resume", resume._id);

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
    const parsedResumeData =
      typeof resumeData === "string" ? JSON.parse(resumeData) : resumeData;
    let resumeDataCopy = structuredClone(parsedResumeData);

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const baseUploadOptions = {
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
      };

      let response;

      try {
        response = await imageKit.files.upload({
          ...baseUploadOptions,
          transformation: {
            pre:
              "w-300,h-300,fo-face,z-0.75" +
              (removeBackground ? ",e-bgremove" : ""),
          },
        });
      } catch (uploadError) {
        if (removeBackground) {
          console.warn(
            "ImageKit background removal failed, falling back to normal upload:",
            uploadError.message,
          );

          response = await imageKit.files.upload(baseUploadOptions);
        } else {
          throw uploadError;
        }
      }

      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      resumeDataCopy,
      { returnDocument: "after" },
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res
      .status(200)
      .json({ message: "Resume updated successfully", resume });
  } catch (error) {
    console.error("Error updating resume:", error);
    return res.status(400).json({ message: error.message });
  }
};

import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "User content is required" });
    }

    // Call AI service to enhance the professional summary
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "system",
          parts: [
            {
              text: "You are an expert resume writer. Your task is to enhance the professional summary for a resume based on the user's input. Make it more impactful and concise while highlighting key skills and achievements, exprience. Avoid adding any new information that is not provided by the user.Make it compelling and ATS friendly.and only return text no options or anything else.",
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: userContent }],
        },
      ],
    });
    const enhancedSummary = response.text;
    return res.status(200).json({ enhancedSummary });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "User content is required" });
    }

    // Call AI service to enhance the job description
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "system",
          parts: [
            {
              text: "You are an expert resume writer. Your task is to enhance the job description for a resume based on the user's input. Make it more impactful and concise while highlighting key skills and achievements, exprience. Avoid adding any new information that is not provided by the user.Make it compelling and ATS friendly.and only return text no options or anything else.",
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: userContent }],
        },
      ],
    });
    const enhancedJobDescription = response.text;
    return res.status(200).json({ enhancedJobDescription });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const enhanceProjectDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "User content is required" });
    }

    // Call AI service to enhance the project description
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "system",
          parts: [
            {
              text: "You are an expert resume writer. Your task is to enhance the project description for a resume based on the user's input. Make it more impactful and concise while highlighting key skills and achievements, exprience. Avoid adding any new information that is not provided by the user.Make it compelling and ATS friendly.and only return text no options or anything else.",
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: userContent }],
        },
      ],
    });
    const enhancedProjectDescription = response.text;
    return res.status(200).json({ enhancedProjectDescription });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId; // Assuming userId is set in the request object after authentication

    if (!title) {
      return res.status(400).json({ message: "Resume title is required" });
    }

    if (!resumeText) {
      return res.status(400).json({ message: "Resume text is required" });
    }

    const systemPrompt =
      "You are an expert AI agent to extract data from resume";

    const userPrompt = `extract data from this resume: ${resumeText}


    Provide data in the following JSON format with no additional text before or after:

    {
        professional_summary: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
      },
    ],
    personal_info: {
      image: {
        type: String,
        default: "",
      },
      full_name: {
        type: String,
        default: "",
      },
      profession: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    experience: [
      {
        company: {
          type: String,
        },
        position: {
          type: String,
        },
        start_date: {
          type: String,
        },
        end_date: {
          type: String,
        },
        description: {
          type: String,
        },
        is_current: {
          type: Boolean,
        },
      },
    ],
    projects: [
      {
        name: {
          type: String,
        },
        type: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    education: [
      {
        institution: {
          type: String,
        },
        degree: {
          type: String,
        },
        field: {
          type: String,
        },
        graduation_date: {
          type: String,
        },
        gpa: {
          type: String,
        },
      },
    ],
    }`;

    // Call AI service to upload and process the resume
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "system",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      responseFormat: {
        type: "json_object",
      },
    });

    const enhancedResume = response.text?.trim();

    if (!enhancedResume) {
      return res.status(502).json({
        message:
          "AI service returned an empty response while processing the resume",
      });
    }

    const jsonMatch = /\{[\s\S]*\}/.exec(enhancedResume);

    if (!jsonMatch) {
      return res.status(422).json({
        message: "AI response did not contain valid JSON",
        rawResponse: enhancedResume,
      });
    }

    let parsedResume;

    try {
      parsedResume = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      return res.status(422).json({
        message: "AI returned malformed JSON for the resume data",
        error: parseError.message,
      });
    }

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedResume,
    });
    return res.status(200).json({ resumeId: newResume._id });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(400).json({ message: error.message });
  }
};

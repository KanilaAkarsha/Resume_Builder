import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import Loader from "../components/Loader";
import ResumePreview from "../components/ResumePreview";
import { ArrowBigLeft, ArrowLeftIcon } from "lucide-react";

const Preview = () => {
  const [loading, setLoading] = useState(true);
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);

  const loadResume = async () => {
    setResumeData(
      dummyResumeData.find((resume) => resume._id === resumeId || null),
      setLoading(false),
    ); // Replace with actual API call to fetch resume by ID
  };

  useEffect(() => {
    loadResume();
  }, []);

  return resumeData ? (
    <div className=" bg-slate-100">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accentColor}
          classes="py-4 bg-white"
        />
      </div>
    </div>
  ) : (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-center text-6xl text-slate-400 font-medium">
            Resume not found
          </p>
          <a
            href="/"
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 rounded-full flex items-center transition-colors">
            <ArrowLeftIcon className="mr-2 size-4" />
            Go To Home Page
          </a>
        </div>
      )}
    </div>
  );
};

export default Preview;

// Enhanced TypeScript interfaces
export type Tip = { 
  type: "good" | "improve"; 
  tip: string; 
  explanation: string; 
};

export type CategoryFeedback = {
  score?: number;
  tips?: Tip[];
};

export type ATSFeedback = {
  score?: number;
  keywordMatch?: number;
  formatCompatibility?: number;
  sectionStructure?: number;
  tips?: Tip[];
  keywords?: {
    found: string[];
    missing: string[];
    suggestions: string[];
  };
};

export type ExtendedFeedback = {
  overallScore?: number;
  toneAndStyle?: CategoryFeedback;
  content?: CategoryFeedback;
  structure?: CategoryFeedback;
  skills?: CategoryFeedback;
  ats?: ATSFeedback; // New ATS section
};

// Enhanced Summary Component
import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score, status }: { 
  title: string; 
  score?: number; 
  status?: string;
}) => {
  const safeScore = score ?? 0;
  const textColor = safeScore > 70 ? "text-green-600" : safeScore > 49 ? "text-yellow-600" : "text-red-600";
  const defaultStatus = safeScore > 70 ? "Good" : safeScore > 49 ? "Needs Work" : "Needs Work";

  return (
    <div className="resume-summary">
      <div className="category flex flex-row justify-between items-center py-3 px-4 border-b border-gray-100 last:border-b-0">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-xl font-medium">{title}</p>
          {status && (
            <span className={`text-sm px-2 py-1 rounded ${
              safeScore > 70 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}>
              {status}
            </span>
          )}
        </div>
        <p className="text-xl font-semibold">
          <span className={textColor}>{safeScore}</span>/100
        </p>
      </div>
    </div>
  );
};

const ATSScoreSection = ({ atsData }: { atsData?: ATSFeedback }) => {
  const atsScore = atsData?.score ?? 0;
  const status = atsScore > 70 ? "Good" : "Needs Improvement";
  const statusColor = atsScore > 70 ? "text-green-600" : "text-red-600";
  const bgColor = atsScore > 70 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";

  return (
    <div className={`rounded-xl p-4 border-2 ${bgColor} mt-4`}>
      <div className="flex flex-row items-center gap-3 mb-2">
        <div className="bg-red-500 rounded-full p-1">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          ATS Score - {atsScore}/100
        </h3>
      </div>
      
      <h4 className={`font-semibold mb-2 ${statusColor}`}>{status}</h4>
      
      <p className="text-gray-700 text-sm leading-relaxed">
        {atsScore > 70 
          ? "Great! Your resume is well-optimized for Applicant Tracking Systems and should pass most ATS filters successfully."
          : "This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers. Keep refining your resume to improve your chances of getting past ATS filters and into the hands of hiring managers."
        }
      </p>

      {atsData?.keywords && (
        <div className="mt-3 space-y-2">
          {atsData.keywords.found.length > 0 && (
            <div>
              <p className="text-sm font-medium text-green-700">
                Found Keywords: {atsData.keywords.found.slice(0, 3).join(", ")}
                {atsData.keywords.found.length > 3 && ` +${atsData.keywords.found.length - 3} more`}
              </p>
            </div>
          )}
          {atsData.keywords.missing.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-700">
                Missing Keywords: {atsData.keywords.missing.slice(0, 3).join(", ")}
                {atsData.keywords.missing.length > 3 && ` +${atsData.keywords.missing.length - 3} more`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Summary = ({ feedback }: { feedback?: ExtendedFeedback }) => {
  if (!feedback) {
    return (
      <div className="bg-white rounded-2xl shadow-md w-full p-4 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-6 gap-8">
        <ScoreGauge score={feedback.overallScore ?? 0} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-800">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below
          </p>
        </div>
      </div>

      <div className="px-6">
        <Category 
          title="Tone & Style" 
          score={feedback.toneAndStyle?.score}
          status={feedback.toneAndStyle?.score && feedback.toneAndStyle.score > 70 ? "Good" : "Needs Work"}
        />
        <Category 
          title="Content" 
          score={feedback.content?.score}
          status={feedback.content?.score && feedback.content.score > 70 ? "Good" : "Needs Work"}
        />
        <Category 
          title="Structure" 
          score={feedback.structure?.score}
          status={feedback.structure?.score && feedback.structure.score > 70 ? "Good" : "Needs Work"}
        />
        <Category 
          title="Skills" 
          score={feedback.skills?.score}
          status={feedback.skills?.score && feedback.skills.score > 70 ? "Good" : "Needs Work"}
        />
      </div>

      <div className="p-6">
        <ATSScoreSection atsData={feedback.ats} />
      </div>
    </div>
  );
};

export default Summary;
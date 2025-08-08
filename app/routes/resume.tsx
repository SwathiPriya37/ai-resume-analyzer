// app/routes/resume.tsx  (or app/components/Resume.tsx depending on your structure)
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "../components/Summary";
import ATS from "../components/ATS";
import Details from "../components/Details";

export const meta = () => [
  { title: "Resumind | Review " },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth, navigate, id]);

  useEffect(() => {
    const loadResume = async () => {
      if (!id) return;
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      let data;
      try {
        data = JSON.parse(resume);
      } catch (err) {
        console.error("Error parsing stored resume data:", err);
        return;
      }

      // resume file -> blob
      try {
        const resumeBlob = await fs.read(data.resumePath);
        if (resumeBlob) {
          const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
          setResumeUrl(URL.createObjectURL(pdfBlob));
        }
      } catch (err) {
        console.error("Error reading resume file:", err);
      }

      // image file -> blob
      try {
        const imageBlob = await fs.read(data.imagePath);
        if (imageBlob) {
          setImageUrl(URL.createObjectURL(imageBlob));
        }
      } catch (err) {
        console.error("Error reading image file:", err);
      }

      // Safe feedback defaults
      const safeFeedback = {
        overallScore: data?.feedback?.overallScore ?? data?.feedback?.score ?? 0,
        ATS: {
          score: data?.feedback?.ATS?.score ?? data?.feedback?.ATSScore ?? 0,
          tips: data?.feedback?.ATS?.tips ?? data?.feedback?.ATS?.suggestions ?? [],
        },
        toneAndStyle: {
          score: data?.feedback?.toneAndStyle?.score ?? 0,
          tips: data?.feedback?.toneAndStyle?.tips ?? [],
        },
        content: {
          score: data?.feedback?.content?.score ?? 0,
          tips: data?.feedback?.content?.tips ?? [],
        },
        structure: {
          score: data?.feedback?.structure?.score ?? 0,
          tips: data?.feedback?.structure?.tips ?? [],
        },
        skills: {
          score: data?.feedback?.skills?.score ?? 0,
          tips: data?.feedback?.skills?.tips ?? [],
        },
        strengths: data?.feedback?.strengths ?? [],
        weaknesses: data?.feedback?.weaknesses ?? [],
        recommendations: data?.feedback?.recommendations ?? [],
      };

      setFeedback(safeFeedback);
    };

    loadResume();
  }, [id, kv, fs]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img src={imageUrl} className="w-full h-full object-contain rounded-2xl" title="resume" />
              </a>
            </div>
          )}
        </section>

        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>

          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS score={feedback?.ATS?.score ?? 0} suggestions={feedback?.ATS?.tips ?? []} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
// Updated Resume interface for the Home component
interface Resume {
  id: string;
  title: string;
  rating: number;
  uploadDate: string;
  status: 'processing' | 'completed' | 'error';
  fileName: string;
  jobTitle?: string;
  company?: string;
  feedback?: {
    overallScore: number;
    toneAndStyle?: {
      score?: number;
      tips?: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
    content?: {
      score?: number;
      tips?: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
    structure?: {
      score?: number;
      tips?: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
    skills?: {
      score?: number;
      tips?: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
    };
    // NEW: ATS scoring section
    ats?: {
      score?: number;
      keywordMatch?: number;
      formatCompatibility?: number;
      sectionStructure?: number;
      tips?: Array<{
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }>;
      keywords?: {
        found: string[];
        missing: string[];
        suggestions: string[];
      };
    };
  };
}

// Example of how to create/update a resume with ATS data
const exampleResumeWithATS: Resume = {
  id: "resume_123",
  title: "Software Developer Resume",
  rating: 75,
  uploadDate: "2025-08-08T10:30:00Z",
  status: "completed",
  fileName: "swathi_resume.pdf",
  jobTitle: "Full Stack Developer",
  company: "Tech Corp",
  feedback: {
    overallScore: 75,
    toneAndStyle: {
      score: 80,
      tips: [
        {
          type: "good",
          tip: "Professional language",
          explanation: "Your resume uses appropriate professional terminology throughout."
        }
      ]
    },
    content: {
      score: 70,
      tips: [
        {
          type: "improve",
          tip: "Add more quantifiable achievements",
          explanation: "Include specific numbers and metrics to demonstrate your impact."
        }
      ]
    },
    structure: {
      score: 85,
      tips: [
        {
          type: "good",
          tip: "Clear section organization",
          explanation: "Your resume sections are well-organized and easy to navigate."
        }
      ]
    },
    skills: {
      score: 75,
      tips: [
        {
          type: "improve",
          tip: "Include more relevant technologies",
          explanation: "Add trending technologies relevant to your target role."
        }
      ]
    },
    // ATS scoring data
    ats: {
      score: 65,
      keywordMatch: 70,
      formatCompatibility: 85,
      sectionStructure: 90,
      tips: [
        {
          type: "improve",
          tip: "Optimize keyword density",
          explanation: "Include more job-specific keywords naturally throughout your resume."
        },
        {
          type: "good",
          tip: "ATS-friendly format",
          explanation: "Your resume format is compatible with most ATS systems."
        }
      ],
      keywords: {
        found: ["JavaScript", "React", "Node.js", "Python", "Git"],
        missing: ["TypeScript", "AWS", "Docker", "Kubernetes"],
        suggestions: ["Next.js", "GraphQL", "MongoDB", "CI/CD"]
      }
    }
  }
};

// Function to save resume with ATS data
const saveResumeWithATS = async (resumeData: Resume, kv: any) => {
  try {
    await kv.set(`resume:${resumeData.id}`, JSON.stringify(resumeData));
    console.log('Resume saved with ATS data successfully');
  } catch (error) {
    console.error('Failed to save resume:', error);
  }
};

// Function to calculate overall ATS impact on resume score
const calculateOverallScore = (feedback: Resume['feedback']) => {
  if (!feedback) return 0;
  
  const scores = [
    feedback.toneAndStyle?.score ?? 0,
    feedback.content?.score ?? 0,
    feedback.structure?.score ?? 0,
    feedback.skills?.score ?? 0,
    feedback.ats?.score ?? 0, // Include ATS score in overall calculation
  ];
  
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

export { Resume, exampleResumeWithATS, saveResumeWithATS, calculateOverallScore };
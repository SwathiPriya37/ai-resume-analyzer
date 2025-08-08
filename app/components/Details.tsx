import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

// ---------------------
// Type definitions
// ---------------------
export type Tip = {
  type: "good" | "bad";
  tip: string;
  explanation?: string;
};

export type ATSFeedback = {
  score: number;
  keywordMatch?: number;
  formatCompatibility?: number;
  sectionStructure?: number;
  keywords?: {
    found: string[];
    missing: string[];
    suggestions: string[];
  };
  tips?: Tip[];
};

export type CategoryFeedback = {
  score: number;
  tips?: Tip[];
};

export type ExtendedFeedback = {
  ats?: ATSFeedback;
  toneAndStyle?: CategoryFeedback;
  content?: CategoryFeedback;
  structure?: CategoryFeedback;
  skills?: CategoryFeedback;
};

// ---------------------
// Components
// ---------------------
const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        score > 69 ? "bg-badge-green" : score > 39 ? "bg-badge-yellow" : "bg-badge-red"
      )}
    >
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className="size-4"
        onError={(e) => ((e.target as HTMLImageElement).src = "/icons/fallback.svg")}
      />
      <p
        className={cn(
          "text-sm font-medium",
          score > 69 ? "text-badge-green-text" : score > 39 ? "text-badge-yellow-text" : "text-badge-red-text"
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({ title, categoryScore }: { title: string; categoryScore?: number }) => {
  const safeScore = categoryScore ?? 0;
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <p className="text-2xl font-semibold">{title}</p>
      <ScoreBadge score={safeScore} />
    </div>
  );
};

const CategoryContent = ({ tips }: { tips?: Tip[] }) => {
  const safeTips = tips ?? [];

  if (safeTips.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center w-full">
        <div className="bg-gray-50 w-full rounded-lg px-5 py-4 text-center">
          <p className="text-gray-500">No specific feedback available for this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeTips.map((tip: Tip, index: number) => (
          <div className="flex flex-row gap-2 items-center" key={index}>
            <img
              src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt="score"
              className="size-5 flex-shrink-0"
              onError={(e) => ((e.target as HTMLImageElement).src = "/icons/fallback.svg")}
            />
            <p className="text-lg text-gray-600">{tip.tip}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 w-full">
        {safeTips.map((tip: Tip, index: number) => (
          <div
            key={index + tip.tip}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4",
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              <img
                src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt="score"
                className="size-5"
                onError={(e) => ((e.target as HTMLImageElement).src = "/icons/fallback.svg")}
              />
              <p className="text-xl font-semibold">{tip.tip}</p>
            </div>
            <p className="leading-relaxed">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ATSContent = ({ atsData }: { atsData?: ATSFeedback }) => {
  const safeTips = atsData?.tips ?? [];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ATS Score Breakdown */}
      <div className="bg-gray-50 w-full rounded-lg px-5 py-4">
        <h4 className="font-semibold mb-3 text-gray-800">ATS Compatibility Breakdown:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600">Keyword Match</p>
            <p className="text-xl font-semibold text-blue-600">{atsData?.keywordMatch ?? 0}%</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600">Format Score</p>
            <p className="text-xl font-semibold text-green-600">{atsData?.formatCompatibility ?? 0}%</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600">Structure Score</p>
            <p className="text-xl font-semibold text-purple-600">{atsData?.sectionStructure ?? 0}%</p>
          </div>
        </div>
      </div>

      {/* Keywords Analysis */}
      {atsData?.keywords && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-blue-800">Keywords Analysis:</h4>

          {atsData.keywords.found.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-green-700 mb-1">✓ Found Keywords:</p>
              <div className="flex flex-wrap gap-2">
                {atsData.keywords.found.map((keyword: string, index: number) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {atsData.keywords.missing.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-red-700 mb-1">⚠ Missing Keywords:</p>
              <div className="flex flex-wrap gap-2">
                {atsData.keywords.missing.map((keyword: string, index: number) => (
                  <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {atsData.keywords.suggestions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">💡 Suggested Keywords:</p>
              <div className="flex flex-wrap gap-2">
                {atsData.keywords.suggestions.map((keyword: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <CategoryContent tips={safeTips} />
    </div>
  );
};

type DetailsProps = {
  feedback?: ExtendedFeedback;
};

const Details = ({ feedback }: DetailsProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        <AccordionItem id="ats-compatibility">
          <AccordionHeader itemId="ats-compatibility">
            <CategoryHeader title="ATS Compatibility" categoryScore={feedback?.ats?.score} />
          </AccordionHeader>
          <AccordionContent itemId="ats-compatibility">
            <ATSContent atsData={feedback?.ats} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader title="Tone & Style" categoryScore={feedback?.toneAndStyle?.score} />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback?.toneAndStyle?.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader title="Content" categoryScore={feedback?.content?.score} />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback?.content?.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader title="Structure" categoryScore={feedback?.structure?.score} />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback?.structure?.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader title="Skills" categoryScore={feedback?.skills?.score} />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback?.skills?.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;

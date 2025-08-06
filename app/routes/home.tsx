import type { Route } from "./+types/home";
import { Navbar } from "~/components/Navbar";
import { resumes } from "../../constants";
import { ResumeCard } from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />
      <section className="flex flex-col items-center justify-center text-center py-12 px-4">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Track Your Application & Resume Ratings
          </h1>
          <h2 className="mt-4 text-xl text-gray-600">
            Review your submissions and check AI-powered feedback.
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      </section>
    </main>
  );
}

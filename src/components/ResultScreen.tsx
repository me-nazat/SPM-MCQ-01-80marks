import React, { useRef } from "react";
import {
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Question, ExamState } from "../types";
import { MathText } from "./MathText";
import html2pdf from "html2pdf.js";

interface ResultScreenProps {
  questions: Question[];
  examState: ExamState;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  questions,
  examState,
  onRestart,
}) => {
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateScore = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach((q) => {
      const answer = examState.answers[q.id];
      if (!answer) {
        skipped++;
      } else if (answer === q.correctOptionId) {
        correct++;
      } else {
        wrong++;
      }
    });

    return { correct, wrong, skipped, total: questions.length };
  };

  const score = calculateScore();

  const handleDownload = () => {
    if (!resultRef.current) return;
    const element = resultRef.current;

    // Temporarily hide the download button for the PDF
    const downloadBtn = document.getElementById("download-btn");
    if (downloadBtn) downloadBtn.style.display = "none";

    html2pdf()
      .set({
        margin: 10,
        filename: `${examState.userName}_Physics_Result.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save()
      .then(() => {
        if (downloadBtn) downloadBtn.style.display = "flex";
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4" ref={resultRef}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative">
          <button
            id="download-btn"
            onClick={handleDownload}
            className="absolute top-6 right-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download size={18} />
            Download Result
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {examState.userName}
            </h1>
            <p className="text-slate-500">Physics Paper 1 MCQ Exam Result</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100">
              <p className="text-sm font-medium text-slate-500 mb-1">
                প্রাপ্ত পয়েন্ট
              </p>
              <p className="text-4xl font-bold text-slate-900">
                {score.correct}/{score.total}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-center border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-green-500" /> Correct
                </span>
                <span className="font-bold text-green-600">
                  {score.correct}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <XCircle size={16} className="text-red-500" /> Wrong
                </span>
                <span className="font-bold text-red-600">{score.wrong}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <AlertCircle size={16} className="text-yellow-500" /> Skipped
                </span>
                <span className="font-bold text-yellow-600">
                  {score.skipped}
                </span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
              <p className="text-2xl font-bold text-green-600">Finished</p>
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 px-2">
            Detailed Review
          </h2>
          {questions.map((q, index) => {
            const userAnswer = examState.answers[q.id];
            const isCorrect = userAnswer === q.correctOptionId;
            const isSkipped = !userAnswer;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {isSkipped && (
                  <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    উত্তর দেওয়া হয়নি
                  </div>
                )}

                <div className="flex gap-4 mb-6">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                    ${isCorrect ? "bg-green-500" : isSkipped ? "bg-yellow-500" : "bg-red-500"}
                  `}
                  >
                    {index + 1}
                  </span>
                  <div className="text-slate-800 text-lg leading-relaxed pr-24">
                    <MathText text={q.questionText} />
                    {q.questionImage && (
                      <img
                        src={q.questionImage}
                        alt="Question diagram"
                        className="mt-4 max-w-full rounded-lg border border-slate-200"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3 pl-12 mb-6">
                  {q.options.map((opt) => {
                    const isUserChoice = userAnswer === opt.id;
                    const isActualCorrect = q.correctOptionId === opt.id;

                    let optionClass = "border-slate-200 bg-white";
                    let icon = null;

                    if (isActualCorrect) {
                      optionClass =
                        "border-green-500 bg-green-50 ring-1 ring-green-500";
                      icon = (
                        <CheckCircle2
                          className="text-green-500 ml-auto"
                          size={20}
                        />
                      );
                    } else if (isUserChoice && !isActualCorrect) {
                      optionClass =
                        "border-red-500 bg-red-50 ring-1 ring-red-500";
                      icon = (
                        <XCircle className="text-red-500 ml-auto" size={20} />
                      );
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 ${optionClass}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
                          ${isUserChoice ? (isCorrect ? "border-green-500" : "border-red-500") : "border-slate-300"}
                        `}
                        >
                          {isUserChoice && (
                            <div
                              className={`w-3 h-3 rounded-full ${isCorrect ? "bg-green-500" : "bg-red-500"}`}
                            />
                          )}
                        </div>
                        <div className="text-slate-700 flex-1">
                          <MathText text={opt.text} />
                          {opt.image && (
                            <img
                              src={opt.image}
                              alt="Option diagram"
                              className="mt-2 max-w-full rounded-lg border border-slate-200"
                            />
                          )}
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="ml-12 bg-green-50 rounded-xl p-5 border border-green-100">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <BookOpen size={18} />
                    ব্যাখ্যা / সমাধান:
                  </h4>
                  <div className="text-green-900 text-sm leading-relaxed">
                    <MathText
                      text={q.explanationText.replace("ব্যাখ্যা:\n", "")}
                    />
                    {q.explanationImage && (
                      <img
                        src={q.explanationImage}
                        alt="Explanation diagram"
                        className="mt-4 max-w-full rounded-lg border border-green-200"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-8 pb-12">
          <button
            onClick={onRestart}
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-sm"
          >
            Start New Exam
          </button>
        </div>
      </div>
    </div>
  );
};

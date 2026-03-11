import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Question } from "../types";
import { MathText } from "./MathText";

interface ExamScreenProps {
  questions: Question[];
  timeLimitMinutes: number;
  onSubmit: (answers: Record<number, string>) => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  questions,
  timeLimitMinutes,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-semibold text-slate-800">
            Physics Paper 1 MCQ Exam
          </h1>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-mono font-medium">
            <Clock size={18} />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-24 pb-28 space-y-6">
        {questions.map((q, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.5) }}
            key={q.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex gap-4 mb-6">
              <span className="flex-shrink-0 w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </span>
              <div className="text-slate-800 text-lg leading-relaxed">
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

            <div className="space-y-3 pl-12">
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(q.id, opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4
                      ${
                        isSelected
                          ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                          : "border-slate-200 hover:border-green-300 hover:bg-slate-50"
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
                      ${isSelected ? "border-green-500" : "border-slate-300"}
                    `}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <div className="text-slate-700">
                      <MathText text={opt.text} />
                      {opt.image && (
                        <img
                          src={opt.image}
                          alt="Option diagram"
                          className="mt-2 max-w-full rounded-lg border border-slate-200"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex justify-end">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-sm"
          >
            Submit Exam
          </button>
        </div>
      </footer>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                জমা দিতে চান?
              </h2>
              <p className="text-slate-500 mb-8">
                আপনি কি নিশ্চিত যে আপনি পরীক্ষা শেষ করতে চান? একবার জমা দিলে আর
                পরিবর্তন করা যাবে না।
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  ফিরে যান
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
                >
                  জমা দিন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

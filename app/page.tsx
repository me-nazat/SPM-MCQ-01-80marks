"use client";

import React, { useState, useEffect } from "react";
import { LandingScreen } from "../src/components/LandingScreen";
import { ExamScreen } from "../src/components/ExamScreen";
import { ResultScreen } from "../src/components/ResultScreen";
import { ScreenState, ExamState, Question } from "../src/types";
import { client } from "../src/lib/turso";
import { AlertCircle } from "lucide-react";

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("landing");
  const [examState, setExamState] = useState<ExamState>({
    userName: "",
    startTime: null,
    endTime: null,
    answers: {},
  });
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!process.env.NEXT_PUBLIC_TURSO_DATABASE_URL || !process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans text-slate-900 p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-lg text-center shadow-sm">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="font-bold text-xl mb-3">Vercel Configuration Missing</h2>
          <p className="mb-4 leading-relaxed">
            The application is crashing because it cannot connect to the database. The environment variables are missing on this deployment.
          </p>
          <div className="text-left bg-white p-4 rounded border border-red-100 font-mono text-sm space-y-2 mb-4 break-all">
            NEXT_PUBLIC_TURSO_DATABASE_URL<br />
            NEXT_PUBLIC_TURSO_AUTH_TOKEN
          </div>
          <p>
            Please go to your <strong className="font-bold">Vercel Project Settings &gt; Environment Variables</strong>, add these two variables exact line your local <code>.env</code> file, and then redeploy.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const rs = await client.execute("SELECT * FROM questions ORDER BY id");
        const parsedQuestions = rs.rows.map(row => ({
          ...row,
          options: JSON.parse(row.options as string)
        })) as unknown as Question[];
        setQuestions(parsedQuestions);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const TIME_LIMIT_MINUTES = 80;

  const handleStart = (name: string, date: Date) => {
    setExamState({
      userName: name,
      startTime: Date.now(),
      endTime: null,
      answers: {},
    });
    setScreen("exam");
  };

  const handleSubmit = (answers: Record<number, string>) => {
    setExamState((prev) => ({
      ...prev,
      endTime: Date.now(),
      answers,
    }));
    setScreen("result");
  };

  const handleRestart = () => {
    setExamState({
      userName: "",
      startTime: null,
      endTime: null,
      answers: {},
    });
    setScreen("landing");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans text-slate-900">
        <div className="animate-pulse text-xl font-semibold text-slate-500">Loading questions from Turso...</div>
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-900">
      {screen === "landing" && (
        <LandingScreen
          onStart={handleStart}
          totalQuestions={questions.length}
        />
      )}
      {screen === "exam" && (
        <ExamScreen
          questions={questions}
          timeLimitMinutes={TIME_LIMIT_MINUTES}
          onSubmit={handleSubmit}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          questions={questions}
          examState={examState}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { LandingScreen } from "./components/LandingScreen";
import { ExamScreen } from "./components/ExamScreen";
import { ResultScreen } from "./components/ResultScreen";
import { ScreenState, ExamState, Question } from "./types";
import { createClient } from "@libsql/client";

const dbUrl = import.meta.env.VITE_TURSO_DATABASE_URL;
const dbAuthToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

export const client = createClient({
  url: dbUrl,
  authToken: dbAuthToken,
});

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

import React, { useState } from "react";
import { BookOpen, Clock, ListOrdered, Key } from "lucide-react";
import { motion } from "motion/react";
import { client } from "../lib/turso";

interface LandingScreenProps {
  onStart: (name: string, date: Date) => void;
  totalQuestions: number;
}

const VALID_CODES = ["a234e", "ab34e", "abc4e", "abcd5", "1234e", "a2345"];
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStart,
  totalQuestions,
}) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [accessCode, setAccessCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!name.trim()) return;
    if (!accessCode.trim()) {
      setErrorMsg("Please enter an access code.");
      return;
    }

    const code = accessCode.trim().toLowerCase();
    
    if (!VALID_CODES.includes(code)) {
      setErrorMsg("Invalid access code. Please try again.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // Check Turso if it was used recently
      const rs = await client.execute({
        sql: "SELECT last_used FROM access_logs WHERE code = ?",
        args: [code]
      });

      const now = Date.now();
      let canAccess = true;

      if (rs.rows.length > 0) {
        const lastUsed = rs.rows[0].last_used as number;
        if (now - lastUsed < ONE_DAY_MS) {
          canAccess = false;
        }
      }

      if (!canAccess) {
        setErrorMsg("This access code has already been used in the last 24 hours.");
        setIsLoading(false);
        return;
      }

      // Update last_used
      await client.execute({
        sql: "INSERT OR REPLACE INTO access_logs (code, last_used) VALUES (?, ?)",
        args: [code, now]
      });

      onStart(name, new Date(date));
    } catch (err) {
      console.error("Error verifying access code:", err);
      setErrorMsg("Network error verifying code. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <BookOpen size={32} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Physics Paper 1 MCQ Exam
        </h1>
        <p className="text-slate-500 mb-8">
          আপনার প্রস্তুতি যাচাই করতে পরীক্ষা শুরু করুন
        </p>

        <div className="flex justify-center gap-4 mb-8">
          <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
            <ListOrdered size={16} />
            {totalQuestions} টি
          </div>
          <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
            <Clock size={16} />
            80 মিনিট
          </div>
        </div>

        <div className="space-y-4 mb-8 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              আপনার নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              তারিখ
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Access Code
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter 5-digit code"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono"
              />
            </div>
            {errorMsg && (
              <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim() || !accessCode.trim() || isLoading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? "Verifying..." : "পরীক্ষা শুরু করুন \u2192"}
        </button>
      </div>
    </motion.div>
  );
};

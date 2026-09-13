"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { WordResult } from "@/lib/types";

interface ResultChartProps {
  results: WordResult[];
  type: "serial-position" | "isolation";
}

export function ResultChart({ results }: ResultChartProps) {
  // 統合版：系列位置効果を表示
  return <SerialPositionChart results={results} />;
}

// 孤立語の統計を表示するコンポーネント
export function IsolationStats({ results }: { results: WordResult[] }) {
  const normalResults = results.filter((r) => !r.isIsolated);
  const isolatedResult = results.find((r) => r.isIsolated);

  const normalCorrect = normalResults.filter((r) => r.correct).length;
  const normalTotal = normalResults.length;
  const normalRate = Math.round((normalCorrect / normalTotal) * 100);

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          通常の言葉
        </div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {normalRate}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {normalCorrect} / {normalTotal}
        </div>
      </div>
      <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          仲間外れ
        </div>
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          {isolatedResult?.correct ? "○" : "×"}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isolatedResult?.word}
        </div>
      </div>
    </div>
  );
}

function SerialPositionChart({ results }: { results: WordResult[] }) {
  const data = results.map((result) => ({
    position: result.position + 1,
    value: result.correct ? 100 : 0,
    correct: result.correct,
    word: result.word,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="position"
            label={{ value: "表示された順番", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            label={{ value: "記憶", angle: -90, position: "insideLeft" }}
            domain={[0, 100]}
            ticks={[0, 100]}
            tickFormatter={(value) => (value === 100 ? "○" : "×")}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold">{data.position}番目</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {data.word}
                    </p>
                    <p className="text-sm">
                      {data.correct ? "○ 正解" : "× 不正解"}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.correct ? "#10b981" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function IsolationChart({ results }: { results: WordResult[] }) {
  const normalResults = results.filter((r) => !r.isIsolated);
  const isolatedResult = results.find((r) => r.isIsolated);

  const normalCorrect = normalResults.filter((r) => r.correct).length;
  const normalTotal = normalResults.length;
  const normalRate = Math.round((normalCorrect / normalTotal) * 100);

  const isolatedRate = isolatedResult?.correct ? 100 : 0;

  const data = [
    {
      type: "通常の言葉",
      rate: normalRate,
      count: `${normalCorrect}/${normalTotal}`,
    },
    {
      type: "仲間外れ",
      rate: isolatedRate,
      count: isolatedResult?.correct ? "1/1" : "0/1",
    },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="type" />
          <YAxis
            label={{ value: "正答率", angle: -90, position: "insideLeft" }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold">{data.type}</p>
                    <p className="text-sm">正答率: {data.rate}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {data.count}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="rate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

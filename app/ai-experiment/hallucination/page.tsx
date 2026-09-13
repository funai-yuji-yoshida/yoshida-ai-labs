"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Header } from "@/components/Header";

export default function HallucinationPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "loading" | "result">("intro");
  const [result, setResult] = useState<{
    question: string;
    correctAnswer: string;
    aiAnswer: string;
  } | null>(null);

  const startExperiment = async () => {
    setPhase("loading");

    try {
      const response = await fetch("/api/ai/hallucination");
      const data = await response.json();

      if (data.error) {
        alert("エラーが発生しました: " + data.error);
        setPhase("intro");
        return;
      }

      setResult(data);
      setPhase("result");
    } catch (error) {
      console.error("Error:", error);
      alert("実験中にエラーが発生しました");
      setPhase("intro");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-4">
        {phase === "intro" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">
                実験：AIのハルシネーション
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  AI（人工知能）は、存在しない情報を「もっともらしく」作り出すことがあります。
                </p>
                <p className="font-semibold">
                  これを「ハルシネーション（幻覚）」と呼びます。
                </p>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  実際にAIに質問して、ハルシネーションを確認してみましょう。
                </p>
              </div>
              <Button onClick={startExperiment} size="lg" className="w-full">
                実験スタート
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "loading" && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                AIに質問しています...
              </p>
            </CardContent>
          </Card>
        )}

        {phase === "result" && result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AIへの質問</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  {result.question}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-950 border-2 border-red-300 dark:border-red-700">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-200">
                  AIの回答
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {result.aiAnswer}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950 border-2 border-green-300 dark:border-green-700">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">
                  正しい答え
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  {result.correctAnswer}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>解説：ハルシネーション</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-lg">
                <p className="leading-relaxed">
                  AIは、学習データに基づいてもっともらしい文章を生成しますが、
                  <span className="font-bold text-red-600 dark:text-red-400">
                    事実かどうかを確認せずに回答する
                  </span>
                  ことがあります。
                </p>
                <p className="leading-relaxed">
                  存在しない情報について質問されても、AIは「分かりません」と答える代わりに、
                  <span className="font-bold text-red-600 dark:text-red-400">
                    それらしい回答を作り出してしまう
                  </span>
                  場合があります。
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700">
                  <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    重要なポイント
                  </p>
                  <ul className="space-y-2 text-base text-gray-700 dark:text-gray-300">
                    <li>• AIの回答を鵜呑みにしない</li>
                    <li>• 重要な情報は必ず確認する</li>
                    <li>• AIは「知ったかぶり」をすることがある</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button
                onClick={() => {
                  setPhase("intro");
                  setResult(null);
                }}
                size="lg"
                className="w-full"
              >
                もう一度実験する
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="lg"
                className="w-full"
              >
                ホームに戻る
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

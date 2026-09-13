"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { MemoryDisplay } from "@/components/MemoryDisplay";
import { AnswerInput } from "@/components/AnswerInput";
import { ResultChart, IsolationStats } from "@/components/ResultChart";
import { Header } from "@/components/Header";
import {
  ExperimentPhase,
  ExperimentSession,
  ReflectionAnswer,
} from "@/lib/types";
import { experiments, getWordSet, shuffleWordSet } from "@/lib/experiments";
import { evaluateAnswers, generateId } from "@/lib/utils";
import { saveSession } from "@/lib/storage";

export default function ExperimentPage() {
  const params = useParams();
  const router = useRouter();
  const experimentId = params.id as string;

  const [phase, setPhase] = useState<ExperimentPhase>("intro");
  const [session, setSession] = useState<ExperimentSession | null>(null);
  const [reflection, setReflection] = useState<ReflectionAnswer>({
    patterns: [],
  });

  const experiment = experiments.find((e) => e.id === experimentId);

  useEffect(() => {
    if (!experiment) {
      router.push("/select");
    }
  }, [experiment, router]);

  if (!experiment) {
    return null;
  }

  const startExperiment = () => {
    const wordSet = getWordSet(experimentId);
    const { shuffledWords, isolatedIndex } = shuffleWordSet(wordSet);

    const newSession: ExperimentSession = {
      id: generateId(),
      experimentId,
      wordSetId: wordSet.id,
      startedAt: new Date().toISOString(),
      displayedWords: shuffledWords,
      answers: [],
      results: [],
      phase: "memorize",
    };

    if (isolatedIndex !== undefined) {
      // 孤立語の位置を保存
      newSession.results = shuffledWords.map((word, index) => ({
        word,
        position: index,
        correct: false,
        isIsolated: index === isolatedIndex,
      }));
    }

    setSession(newSession);
    setPhase("memorize");
  };

  const handleMemoryComplete = () => {
    setPhase("answer");
  };

  const handleAnswerSubmit = (answers: string[]) => {
    if (!session) return;

    const results = evaluateAnswers(
      session.displayedWords,
      answers,
      session.results[0]?.isIsolated !== undefined
        ? session.results.findIndex((r) => r.isIsolated)
        : undefined
    );

    const updatedSession: ExperimentSession = {
      ...session,
      answers,
      results,
      completedAt: new Date().toISOString(),
      phase: "result",
    };

    setSession(updatedSession);
    saveSession(updatedSession);
    setPhase("result");
  };

  const handleReflectionChange = (pattern: string, checked: boolean) => {
    setReflection((prev) => ({
      ...prev,
      patterns: checked
        ? [...prev.patterns, pattern]
        : prev.patterns.filter((p) => p !== pattern),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <Header showHomeButton={phase !== "memorize"} />
      <div className="max-w-4xl mx-auto py-12 px-4">
        {phase === "intro" && <IntroPhase experiment={experiment} onStart={startExperiment} />}

        {phase === "memorize" && session && (
          <MemoryDisplay
            words={session.displayedWords}
            onComplete={handleMemoryComplete}
          />
        )}

        {phase === "answer" && <AnswerInput onSubmit={handleAnswerSubmit} />}

        {phase === "result" && session && (
          <ResultPhase session={session} onNext={() => setPhase("reflection")} />
        )}

        {phase === "reflection" && session && (
          <ReflectionPhase
            reflection={reflection}
            onReflectionChange={handleReflectionChange}
            onNext={() => setPhase("explanation")}
          />
        )}

        {phase === "explanation" && (
          <ExplanationPhase onNext={() => setPhase("complete")} />
        )}

        {phase === "complete" && <CompletePhase />}
      </div>
    </div>
  );
}

function IntroPhase({
  experiment,
  onStart,
}: {
  experiment: { name: string; type: string };
  onStart: () => void;
}) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">実験：{experiment.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg space-y-4 text-gray-700 dark:text-gray-300">
          <p>これから12個の言葉が、1つずつ表示されます。</p>
          <p className="font-semibold">できるだけ多く覚えてください。</p>
          <p className="text-base text-gray-600 dark:text-gray-400">
            順番を覚える必要はありません。
          </p>
        </div>
        <Button onClick={onStart} size="lg" className="w-full">
          実験スタート
        </Button>
      </CardContent>
    </Card>
  );
}

function ResultPhase({
  session,
  onNext,
}: {
  session: ExperimentSession;
  onNext: () => void;
}) {
  const correctCount = session.results.filter((r) => r.correct).length;
  const totalCount = session.results.length;

  return (
    <div className="space-y-8">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl">あなたの結果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
            {correctCount} / {totalCount}
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300">正解</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>では、どの位置を覚えていたでしょうか？</CardTitle>
        </CardHeader>
        <CardContent>
          <ResultChart results={session.results} type="serial-position" />
          <IsolationStats results={session.results} />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-2 border-purple-200 dark:border-purple-800">
        <CardContent className="text-center py-6">
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            何か気づきはありますか？
          </p>
        </CardContent>
      </Card>

      <Button onClick={onNext} size="lg" className="w-full">
        次へ
      </Button>
    </div>
  );
}

function ReflectionPhase({
  reflection,
  onReflectionChange,
  onNext,
}: {
  reflection: ReflectionAnswer;
  onReflectionChange: (pattern: string, checked: boolean) => void;
  onNext: () => void;
}) {
  const patterns = [
    "最初のほうを覚えていた",
    "最後のほうを覚えていた",
    "真ん中をあまり覚えていなかった",
    "仲間外れの言葉を覚えていた",
    "特にパターンはなかった",
    "よく分からない",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>何か気づいたことはありますか？</CardTitle>
        <CardDescription>複数選択可能です</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {patterns.map((pattern) => (
            <label
              key={pattern}
              className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={reflection.patterns.includes(pattern)}
                onChange={(e) => onReflectionChange(pattern, e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-lg">{pattern}</span>
            </label>
          ))}
        </div>
        <Button onClick={onNext} size="lg" className="w-full">
          答えを見る
        </Button>
      </CardContent>
    </Card>
  );
}

function ExplanationPhase({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            実は、記憶には2つの&quot;クセ&quot;があります
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg">
          <p className="leading-relaxed text-center">
            あなたの結果から、人間の記憶の特徴が見えてきます。
          </p>

          {/* 系列位置効果の説明 */}
          <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">
              クセ1：系列位置効果
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Serial Position Effect
            </p>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300 mt-4">
              人間は、並んだ情報を覚えるとき、
              <span className="font-bold text-blue-600 dark:text-blue-400">最初のほう</span>と
              <span className="font-bold text-purple-600 dark:text-purple-400">最後のほう</span>を比較的覚えやすく、
              <span className="font-bold text-red-600 dark:text-red-400">真ん中の情報</span>を忘れやすい傾向があります。
            </p>
            <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                  初頭効果
                </span>
                ：最初のほうを覚えやすい
              </p>
              <p>
                <span className="font-semibold text-purple-700 dark:text-purple-300">
                  新近効果
                </span>
                ：最後のほうを覚えやすい
              </p>
            </div>
          </div>

          {/* 孤立効果の説明 */}
          <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
            <h3 className="text-2xl font-bold mb-4 text-purple-900 dark:text-purple-100">
              クセ2：孤立効果
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Von Restorff Effect / Isolation Effect
            </p>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300 mt-4">
              周囲と明らかに異なる情報（仲間外れ）は、他の情報よりも注意を引きやすく、
              <span className="font-bold text-purple-600 dark:text-purple-400">
                記憶に残りやすくなる
              </span>
              ことがあります。
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              ※ これはあなた1人の今回の結果です。統計的な結論には、より多くのデータが必要です。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-2 border-yellow-300 dark:border-yellow-700">
        <CardContent className="py-8 space-y-4">
          <p className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
            ここで、ちょっと考えてみてください。
          </p>
          <p className="text-lg text-center text-gray-700 dark:text-gray-300">
            人間の記憶に&quot;クセ&quot;があるなら……
          </p>
          <p className="text-2xl font-bold text-center text-orange-700 dark:text-orange-400">
            AIにも&quot;クセ&quot;はあると思いますか？
          </p>
        </CardContent>
      </Card>

      <Button onClick={onNext} size="lg" className="w-full">
        次へ
      </Button>
    </div>
  );
}

function CompletePhase() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            人間の記憶には、クセがある
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <ul className="space-y-3 list-disc list-inside">
            <li>順番によって覚えやすさが変わる（系列位置効果）</li>
            <li>最初と最後が覚えやすい（初頭効果・新近効果）</li>
            <li>周囲と違う情報は目立ちやすい（孤立効果）</li>
            <li>人間は完全に合理的な情報処理をしているわけではない</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-300 dark:border-blue-700">
        <CardContent className="py-8 space-y-6 text-center">
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            では、AIはどうでしょう？
          </p>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
            AIにも&quot;クセ&quot;があります。
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button
          onClick={() => router.push("/ai-experiment/hallucination")}
          size="lg"
          className="w-full"
        >
          AIのハルシネーションを体験
        </Button>
        <Button
          onClick={() => router.push("/experiment/memory-bias")}
          variant="secondary"
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
  );
}

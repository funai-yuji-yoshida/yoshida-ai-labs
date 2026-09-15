'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { getQuestionsForStep } from '@/lib/questions';

export default function AssessmentPage() {
  const router = useRouter();
  const { state, setBasicInfo, answerQuestion, nextStep, prevStep, submitAssessment } = useAssessment();
  const [name, setName] = useState('');

  const handleSubmitBasicInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setBasicInfo({ name: name.trim() || undefined, timestamp: Date.now() });
    nextStep();
  };

  const handleSubmitStep = () => {
    const questions = getQuestionsForStep(state.currentStep);
    const allAnswered = questions.every((q) =>
      state.answers.some((a) => a.questionId === q.id)
    );

    if (!allAnswered) {
      alert('すべての質問に回答してください');
      return;
    }

    if (state.currentStep === state.totalSteps) {
      const result = submitAssessment();
      if (result) {
        router.push(`/result?id=${result.id}`);
      }
    } else {
      nextStep();
    }
  };

  const getStepLabel = (step: number) => {
    if (step === 1) return '基本情報';
    if (step >= 2 && step <= 5) return '個人診断';
    if (step >= 6 && step <= 8) return '組織診断';
    return '';
  };

  const getAnswer = (questionId: string) => {
    return state.answers.find((a) => a.questionId === questionId)?.score;
  };

  // Step 1: Basic Info
  if (state.currentStep === 1) {
    return (
      <div className="min-h-screen p-4 py-8">
        <div className="max-w-2xl mx-auto">
          <ProgressBar
            current={state.currentStep}
            total={state.totalSteps}
            className="mb-8"
          />

          <Card>
            <h1 className="text-2xl font-bold mb-6">基本情報</h1>

            <form onSubmit={handleSubmitBasicInfo}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  お名前（任意）
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="匿名で診断することもできます"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  入力した名前は診断結果に表示されます
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/')}
                >
                  戻る
                </Button>
                <Button type="submit" className="flex-1">
                  次へ
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Steps 2-8: Questions
  const questions = getQuestionsForStep(state.currentStep);

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center text-sm text-gray-600 mb-4">
          <span className="font-semibold">{getStepLabel(state.currentStep)}</span>
          <span className="mx-2">·</span>
          <span>
            ステップ {state.currentStep} / {state.totalSteps}
          </span>
        </div>

        <ProgressBar
          current={state.currentStep}
          total={state.totalSteps}
          className="mb-8"
        />

        <Card>
          <h2 className="text-xl font-bold mb-6">
            {getStepLabel(state.currentStep)}
          </h2>

          <div>
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                value={getAnswer(question.id)}
                onChange={(score) => answerQuestion(question.id, score)}
              />
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={prevStep}
            >
              戻る
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleSubmitStep}
            >
              {state.currentStep === state.totalSteps ? '診断結果を見る' : '次へ'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

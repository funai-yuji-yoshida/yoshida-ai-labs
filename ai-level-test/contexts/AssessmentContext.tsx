'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { BasicInfo, Answer, AssessmentResult } from '@/lib/types';
import { calculateAllScores } from '@/lib/scoring';
import { saveAssessment } from '@/lib/storage';

interface AssessmentState {
  currentStep: number;
  totalSteps: number;
  basicInfo: BasicInfo;
  answers: Answer[];
  isComplete: boolean;
  resultId: string | null;
}

interface AssessmentContextValue {
  state: AssessmentState;
  setBasicInfo: (info: BasicInfo) => void;
  answerQuestion: (questionId: string, score: 1 | 2 | 3 | 4 | 5) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  submitAssessment: () => AssessmentResult | null;
}

const AssessmentContext = createContext<AssessmentContextValue | undefined>(
  undefined
);

const TOTAL_STEPS = 8;

const initialState: AssessmentState = {
  currentStep: 1,
  totalSteps: TOTAL_STEPS,
  basicInfo: { timestamp: Date.now() },
  answers: [],
  isComplete: false,
  resultId: null,
};

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AssessmentState>(initialState);

  const setBasicInfo = useCallback((info: BasicInfo) => {
    setState((prev) => ({
      ...prev,
      basicInfo: { ...info, timestamp: Date.now() },
    }));
  }, []);

  const answerQuestion = useCallback(
    (questionId: string, score: 1 | 2 | 3 | 4 | 5) => {
      setState((prev) => {
        const existingIndex = prev.answers.findIndex(
          (a) => a.questionId === questionId
        );
        const newAnswers = [...prev.answers];

        if (existingIndex >= 0) {
          newAnswers[existingIndex] = { questionId, score };
        } else {
          newAnswers.push({ questionId, score });
        }

        return {
          ...prev,
          answers: newAnswers,
        };
      });
    },
    []
  );

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const submitAssessment = useCallback((): AssessmentResult | null => {
    const personalAnswers = state.answers.filter((a) =>
      a.questionId.startsWith('p_')
    );
    const organizationAnswers = state.answers.filter((a) =>
      a.questionId.startsWith('o_')
    );

    if (personalAnswers.length < 20 || organizationAnswers.length < 15) {
      console.warn('Not all questions answered');
      return null;
    }

    const { axisScores, orgScores, personalLevel, organizationLevel } =
      calculateAllScores(personalAnswers, organizationAnswers);

    const result: AssessmentResult = {
      id: crypto.randomUUID(),
      basicInfo: state.basicInfo,
      personalAnswers,
      organizationAnswers,
      personalLevel,
      organizationLevel,
      axisScores,
      orgScores,
      createdAt: new Date().toISOString(),
    };

    saveAssessment(result);

    setState((prev) => ({
      ...prev,
      isComplete: true,
      resultId: result.id,
    }));

    return result;
  }, [state]);

  const value: AssessmentContextValue = {
    state,
    setBasicInfo,
    answerQuestion,
    nextStep,
    prevStep,
    reset,
    submitAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
}

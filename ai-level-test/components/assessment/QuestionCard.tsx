import React from 'react';
import type { Question } from '@/lib/types';
import { scaleLabels } from '@/lib/questions';

interface QuestionCardProps {
  question: Question;
  value?: 1 | 2 | 3 | 4 | 5;
  onChange: (score: 1 | 2 | 3 | 4 | 5) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200 last:border-0">
      <h3 className="text-lg font-medium mb-4">{question.text}</h3>

      <div className="space-y-2">
        {([1, 2, 3, 4, 5] as const).map((score) => (
          <label
            key={score}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              value === score
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={score}
              checked={value === score}
              onChange={() => onChange(score)}
              className="mr-3"
            />
            <div className="flex-1">
              <span className="font-medium">{score}.</span>{' '}
              <span>{scaleLabels[score]}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

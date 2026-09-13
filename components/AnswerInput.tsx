"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

interface AnswerInputProps {
  onSubmit: (answers: string[]) => void;
}

export function AnswerInput({ onSubmit }: AnswerInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) {
      return;
    }

    // 複数の区切り文字で分割
    const delimiters = /[、,，\s\n]+/;
    const answers = input
      .split(delimiters)
      .map((ans) => ans.trim())
      .filter((ans) => ans.length > 0);

    onSubmit(answers);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>覚えている言葉を入力してください</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          「、」「,」スペース、または改行で区切って入力できます
        </p>
      </CardHeader>
      <CardContent>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 p-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          placeholder="例: りんご、時計、電車、山..."
          autoFocus
        />
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full mt-4"
          size="lg"
        >
          答え合わせ
        </Button>
      </CardContent>
    </Card>
  );
}

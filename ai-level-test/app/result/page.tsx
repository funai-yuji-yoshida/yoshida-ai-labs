'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getAssessmentById } from '@/lib/storage';
import { getLevelDefinition, getRecommendations, getGapRecommendations, analyzeGap, analyzeStrengthWeakness } from '@/lib/recommendations';
import type { AssessmentResult } from '@/lib/types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const assessment = getAssessmentById(id);
      setResult(assessment);
    }
  }, [searchParams]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="text-center">
          <p className="mb-4">診断結果が見つかりません</p>
          <Link href="/">
            <Button>トップページへ戻る</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const personalLevelDef = getLevelDefinition(result.personalLevel);
  const orgLevelDef = getLevelDefinition(result.organizationLevel);
  const recommendations = getRecommendations(result.personalLevel);
  const gapPattern = analyzeGap(result.personalLevel, result.organizationLevel);
  const gapRecommendations = getGapRecommendations(gapPattern);
  const { strengths, weaknesses } = analyzeStrengthWeakness(result.axisScores);

  const radarData = [
    { axis: 'AIリテラシー', score: result.axisScores.literacy },
    { axis: 'AI操作力', score: result.axisScores.operation },
    { axis: '業務活用力', score: result.axisScores.application },
    { axis: '業務設計力', score: result.axisScores.design },
    { axis: '価値創造力', score: result.axisScores.innovation },
  ];

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">診断結果</h1>
            {result.basicInfo.name && (
              <p className="text-gray-600">{result.basicInfo.name}様</p>
            )}
          </div>

          {/* Personal Level */}
          <div className="mb-8">
            <div className="text-center">
              <div className="inline-block bg-blue-100 text-blue-800 px-6 py-3 rounded-lg mb-2">
                <div className="text-sm font-medium">個人レベル</div>
                <div className="text-4xl font-bold">Lv.{result.personalLevel}</div>
                <div className="text-lg font-semibold">{personalLevelDef.name}</div>
              </div>
              <p className="text-gray-600 mt-2">{personalLevelDef.description}</p>
            </div>
          </div>

          {/* Organization Level */}
          <div className="mb-8">
            <div className="text-center">
              <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-lg mb-2">
                <div className="text-sm font-medium">組織レベル</div>
                <div className="text-4xl font-bold">Lv.{result.organizationLevel}</div>
                <div className="text-lg font-semibold">{orgLevelDef.name}</div>
              </div>
              <p className="text-gray-600 mt-2">{orgLevelDef.description}</p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center">5軸スコア</h2>
            <div className="chart-container" style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="axis" />
                  <PolarRadiusAxis domain={[0, 5]} />
                  <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">強み・弱み</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-800">強み</h3>
                <ul className="space-y-1">
                  {strengths.map((s, i) => (
                    <li key={i}>
                      {s.axis}: {s.score.toFixed(1)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-orange-800">弱み</h3>
                <ul className="space-y-1">
                  {weaknesses.map((w, i) => (
                    <li key={i}>
                      {w.axis}: {w.score.toFixed(1)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">推奨アクション</h2>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-blue-600 mr-2">▸</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gap Recommendations */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">ギャップ分析</h2>
            <ul className="space-y-2">
              {gapRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-600 mr-2">▸</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 no-print">
            <Button
              onClick={() => window.print()}
              variant="secondary"
              className="flex-1"
            >
              PDFでダウンロード
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full">トップページへ</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

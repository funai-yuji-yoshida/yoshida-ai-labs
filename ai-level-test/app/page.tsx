import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">AI活用成熟度診断</h1>
        <p className="text-xl text-gray-600 mb-8">
          あなたのAI活用は、
          <br />
          「使う」から「変革する」のどこにありますか？
        </p>

        <div className="space-y-4 mb-8">
          <div className="text-left bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">この診断でわかること</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ 個人のAI活用レベル（Lv.1〜5）</li>
              <li>✓ 組織のAI活用レベル（Lv.1〜5）</li>
              <li>✓ 5軸のスコア分析</li>
              <li>✓ 強み・弱みの可視化</li>
              <li>✓ 次に取り組むべきアクション</li>
            </ul>
          </div>

          <div className="text-left bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">所要時間</h2>
            <p className="text-sm text-gray-700">約10〜15分（全35問）</p>
          </div>
        </div>

        <Link href="/assessment">
          <Button className="w-full sm:w-auto text-lg px-12">
            診断を開始する
          </Button>
        </Link>
      </Card>
    </div>
  );
}

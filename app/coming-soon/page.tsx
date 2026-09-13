import Link from "next/link";
import { Button } from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Header } from "@/components/Header";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <Header />
      <div className="py-12 px-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl text-center">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-xl text-gray-700 dark:text-gray-300">
            AIのクセを体験できる実験を用意しました！
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            人間の記憶のクセを体験したあとは、AIのクセも確認してみましょう。
          </p>
          <div className="pt-4 space-y-3">
            <Link href="/ai-experiment/hallucination">
              <Button size="lg" className="w-full">
                AIのハルシネーションを体験
              </Button>
            </Link>
            <Link href="/experiment/memory-bias">
              <Button variant="secondary" size="lg" className="w-full">
                記憶の実験をやり直す
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full">
                ホームに戻る
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

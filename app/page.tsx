import Link from "next/link";
import { Button } from "@/components/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AIクセ体験ラボ
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-semibold">
            AIは万能なのか？
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            まずは、あなた自身の
            <span className="font-bold text-purple-600 dark:text-purple-400">
              &quot;クセ&quot;
            </span>
            を体験してみよう。
          </p>
        </div>

        <Link href="/select">
          <Button size="lg" className="text-xl px-12 py-6">
            体験をはじめる
          </Button>
        </Link>
      </div>
    </div>
  );
}

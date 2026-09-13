import Link from "next/link";
import { Button } from "./Button";

interface HeaderProps {
  showHomeButton?: boolean;
}

export function Header({ showHomeButton = true }: HeaderProps) {
  return (
    <header className="w-full py-4 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AIクセ体験ラボ
        </Link>
        {showHomeButton && (
          <Link href="/">
            <Button variant="outline" size="sm">
              ホームに戻る
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}

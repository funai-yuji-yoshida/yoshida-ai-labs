import { ExperimentCard } from "@/components/ExperimentCard";
import { experiments } from "@/lib/experiments";

import { Header } from "@/components/Header";

export default function SelectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            記憶のクセ発見実験
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            あなたの記憶にはどんなクセがあるでしょうか？
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {experiments.map((experiment, index) => (
            <ExperimentCard
              key={experiment.id}
              experiment={experiment}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

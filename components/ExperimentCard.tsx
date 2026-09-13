import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./Card";
import { Button } from "./Button";
import { ExperimentDefinition } from "@/lib/types";

interface ExperimentCardProps {
  experiment: ExperimentDefinition;
  index: number;
}

export function ExperimentCard({ experiment, index }: ExperimentCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          実験{index + 1}
        </div>
        <CardTitle>{experiment.name}</CardTitle>
        <CardDescription>{experiment.description}</CardDescription>
      </CardHeader>
      <Link href={`/experiment/${experiment.id}`}>
        <Button className="w-full">実験する</Button>
      </Link>
    </Card>
  );
}

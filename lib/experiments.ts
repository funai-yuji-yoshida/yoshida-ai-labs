import { ExperimentDefinition, WordSet } from "./types";

// 実験定義
export const experiments: ExperimentDefinition[] = [
  {
    id: "memory-bias",
    name: "記憶のクセ発見実験",
    description:
      "12個の言葉を覚えてください。あなたの記憶にはどんなクセがあるでしょうか？",
    type: "serial-position",
  },
  {
    id: "ai-hallucination",
    name: "AIのハルシネーション",
    description:
      "AIは存在しない情報を作り出すことがあります。実際に体験してみましょう。",
    type: "serial-position", // AI実験用の新しいタイプが必要
  },
];

// 統合実験用の単語セット（系列位置効果 + 孤立効果）
export const memoryBiasWordSets: WordSet[] = [
  {
    id: "mb-set-a",
    experimentId: "memory-bias",
    words: [
      "りんご",
      "みかん",
      "バナナ",
      "ぶどう",
      "いちご",
      "すいか",
      "もも",
      "メロン",
      "レモン",
      "さくらんぼ",
      "パイナップル",
      "宇宙船", // 孤立語
    ],
  },
  {
    id: "mb-set-b",
    experimentId: "memory-bias",
    words: [
      "猫",
      "犬",
      "うさぎ",
      "馬",
      "牛",
      "羊",
      "豚",
      "鹿",
      "ライオン",
      "象",
      "キリン",
      "地震", // 孤立語
    ],
  },
  {
    id: "mb-set-c",
    experimentId: "memory-bias",
    words: [
      "机",
      "椅子",
      "棚",
      "ベッド",
      "ソファ",
      "テーブル",
      "本棚",
      "引き出し",
      "クローゼット",
      "鏡台",
      "食器棚",
      "火山", // 孤立語
    ],
  },
];

// 単語セットを取得
export function getWordSet(experimentId: string): WordSet {
  // 統合実験用の単語セットを使用
  const sets = memoryBiasWordSets;

  // ランダムに選択
  const randomSet = sets[Math.floor(Math.random() * sets.length)];

  return randomSet;
}

// 単語セットをシャッフル（孤立語の位置を考慮）
export function shuffleWordSet(wordSet: WordSet): {
  shuffledWords: string[];
  isolatedIndex?: number;
} {
  const words = [...wordSet.words];

  // 孤立語を特定（最後の要素と仮定）
  const isolatedWord = words[words.length - 1];
  const normalWords = words.slice(0, -1);

  // 通常語をシャッフル
  for (let i = normalWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [normalWords[i], normalWords[j]] = [normalWords[j], normalWords[i]];
  }

  // 孤立語を2-11番目のランダムな位置に挿入
  const isolatedPosition = Math.floor(Math.random() * 10) + 1; // 1-10 (0-indexedなので実際は2-11番目)
  normalWords.splice(isolatedPosition, 0, isolatedWord);

  return {
    shuffledWords: normalWords,
    isolatedIndex: isolatedPosition,
  };
}

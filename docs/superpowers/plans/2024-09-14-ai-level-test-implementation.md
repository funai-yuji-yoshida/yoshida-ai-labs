# AI Level Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an AI maturity assessment application that evaluates individuals and organizations on a 5-level scale and provides personalized recommendations.

**Architecture:** Independent Next.js project using App Router, localStorage for MVP data persistence, Context API for state management, and Tremor for data visualization. The app follows a step-by-step assessment flow with 35 questions (20 personal + 15 organizational) split across 8 steps.

**Tech Stack:** Next.js 16.3.5, React 19.2.8, TypeScript 5, Tailwind CSS 4, Tremor (charts)

**Spec:** `docs/superpowers/specs/2024-09-14-ai-level-test-design.md`

## Global Constraints

- Node.js 20+
- React Server Components where possible (App Router)
- TypeScript strict mode enabled
- Tailwind CSS utility-first approach
- Responsive design (mobile-first)
- localStorage key prefix: `ai-level-test:`
- All commits follow conventional commits format
- UUID v4 for assessment IDs
- ISO 8601 for timestamps

---

### Task 1: Project Setup and Dependencies

**Files:**
- Create: `ai-level-test/package.json`
- Create: `ai-level-test/tsconfig.json`
- Create: `ai-level-test/next.config.ts`
- Create: `ai-level-test/tailwind.config.ts`
- Create: `ai-level-test/postcss.config.mjs`
- Create: `ai-level-test/.gitignore`

**Interfaces:**
- Consumes: None (initial setup)
- Produces: Configured Next.js project with all dependencies

- [ ] **Step 1: Create project directory**

```bash
cd AI_apps
mkdir ai-level-test
cd ai-level-test
```

- [ ] **Step 2: Initialize package.json**

```json
{
  "name": "ai-level-test",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest"
  },
  "dependencies": {
    "next": "16.3.5",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "@tremor/react": "^3.14.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.5",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^1.3.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.2.0",
    "jsdom": "^24.0.0"
  }
}
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create next.config.ts**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 5: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Create postcss.config.mjs**

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

- [ ] **Step 7: Create .gitignore**

```
# dependencies
node_modules/
.pnp
.pnp.js

# testing
coverage/

# next.js
.next/
out/
build/
dist/

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 8: Install dependencies**

Run: `npm install`
Expected: All dependencies installed successfully

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: initialize AI Level Test Next.js project

- Setup Next.js 16.3.5 with TypeScript
- Configure Tailwind CSS 4 and Tremor
- Add Vitest for testing
- Configure on port 3001 to avoid conflict with existing app

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Type Definitions and Data Model

**Files:**
- Create: `ai-level-test/lib/types.ts`

**Interfaces:**
- Consumes: None
- Produces: Core TypeScript types used throughout the application
  - `AssessmentAxis` type
  - `OrganizationCategory` type
  - `QuestionType` type
  - `Question` interface
  - `Answer` interface
  - `BasicInfo` interface
  - `AssessmentResult` interface

- [ ] **Step 1: Create lib directory**

```bash
mkdir lib
```

- [ ] **Step 2: Write types.ts**

```typescript
// lib/types.ts

/**
 * 個人診断の評価軸
 */
export type AssessmentAxis =
  | 'literacy'      // AIリテラシー
  | 'operation'     // AI操作力
  | 'application'   // 業務活用力
  | 'design'        // 業務設計力
  | 'innovation';   // 価値創造力

/**
 * 組織診断の評価項目
 */
export type OrganizationCategory =
  | 'adoption'       // 導入
  | 'usage'          // 利用
  | 'integration'    // 業務組込み
  | 'infrastructure' // データ・仕組み
  | 'management';    // 経営活用

/**
 * 質問タイプ
 */
export type QuestionType = 'personal' | 'organization';

/**
 * 質問データ
 */
export interface Question {
  id: string;
  type: QuestionType;
  category: AssessmentAxis | OrganizationCategory;
  text: string;
  order: number;
}

/**
 * 回答データ（1-5のスケール）
 */
export interface Answer {
  questionId: string;
  score: 1 | 2 | 3 | 4 | 5;
}

/**
 * 基本情報
 */
export interface BasicInfo {
  name?: string;  // 任意
  timestamp: number;
}

/**
 * 5軸スコア（個人）
 */
export interface AxisScores {
  literacy: number;
  operation: number;
  application: number;
  design: number;
  innovation: number;
}

/**
 * 組織スコア
 */
export interface OrgScores {
  adoption: number;
  usage: number;
  integration: number;
  infrastructure: number;
  management: number;
}

/**
 * 診断結果
 */
export interface AssessmentResult {
  id: string;  // UUID
  basicInfo: BasicInfo;
  personalAnswers: Answer[];
  organizationAnswers: Answer[];

  // 計算済みスコア
  personalLevel: 1 | 2 | 3 | 4 | 5;
  organizationLevel: 1 | 2 | 3 | 4 | 5;

  // 5軸スコア（個人）
  axisScores: AxisScores;

  // 組織スコア
  orgScores: OrgScores;

  createdAt: string;  // ISO 8601
}

/**
 * ギャップパターン
 */
export type GapPattern =
  | 'balanced'          // バランス型（差が±1以内）
  | 'personal-leading'  // 個人先行型（個人 > 組織+1）
  | 'org-leading'       // 組織先行型（組織 > 個人+1）
  | 'both-low'          // 停滞型（両方Lv.2以下）
  | 'both-high';        // 変革型（両方Lv.4以上）

/**
 * レベル定義
 */
export interface LevelDefinition {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No compilation errors

- [ ] **Step 4: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add core TypeScript type definitions

- Define assessment axis and organization category types
- Add Question, Answer, and BasicInfo interfaces
- Define AssessmentResult with calculated scores
- Add GapPattern and LevelDefinition types

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Question Data

**Files:**
- Create: `ai-level-test/lib/questions.ts`

**Interfaces:**
- Consumes: `Question`, `AssessmentAxis`, `OrganizationCategory` from `lib/types.ts`
- Produces:
  - `questions: Question[]` - All 35 questions
  - `scaleLabels: Record<1|2|3|4|5, string>` - Rating labels
  - `getQuestionById(id: string): Question | undefined`
  - `getQuestionsForStep(step: number): Question[]`

- [ ] **Step 1: Write questions.ts with all question data**

```typescript
// lib/questions.ts
import { Question } from './types';

export const scaleLabels: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'まったくできない',
  2: 'あまりできない',
  3: 'ある程度できる',
  4: 'できる',
  5: '他者にも教えられる・仕組み化できる',
};

export const questions: Question[] = [
  // 個人診断 - AIリテラシー（4問）
  {
    id: 'p_literacy_1',
    type: 'personal',
    category: 'literacy',
    text: 'AIが得意な仕事・苦手な仕事を説明できる',
    order: 1,
  },
  {
    id: 'p_literacy_2',
    type: 'personal',
    category: 'literacy',
    text: 'AIの回答を確認せずに信用しない',
    order: 2,
  },
  {
    id: 'p_literacy_3',
    type: 'personal',
    category: 'literacy',
    text: '機密情報の取り扱いルールを理解している',
    order: 3,
  },
  {
    id: 'p_literacy_4',
    type: 'personal',
    category: 'literacy',
    text: 'AIによる誤情報のリスクを理解している',
    order: 4,
  },

  // 個人診断 - AI操作力（4問）
  {
    id: 'p_operation_1',
    type: 'personal',
    category: 'operation',
    text: 'AIに目的・条件を明確に伝えられる',
    order: 5,
  },
  {
    id: 'p_operation_2',
    type: 'personal',
    category: 'operation',
    text: 'AIの回答を見て追加指示を出せる',
    order: 6,
  },
  {
    id: 'p_operation_3',
    type: 'personal',
    category: 'operation',
    text: '複数のAIツールを使い分けられる',
    order: 7,
  },
  {
    id: 'p_operation_4',
    type: 'personal',
    category: 'operation',
    text: 'AIとの対話を繰り返して成果物を改善できる',
    order: 8,
  },

  // 個人診断 - 業務活用力（4問）
  {
    id: 'p_application_1',
    type: 'personal',
    category: 'application',
    text: '自分の仕事でAIを日常的に利用している',
    order: 9,
  },
  {
    id: 'p_application_2',
    type: 'personal',
    category: 'application',
    text: 'メール・資料・議事録等にAIを活用している',
    order: 10,
  },
  {
    id: 'p_application_3',
    type: 'personal',
    category: 'application',
    text: 'AIによって作業時間を短縮している',
    order: 11,
  },
  {
    id: 'p_application_4',
    type: 'personal',
    category: 'application',
    text: 'AIを使う業務・使わない業務を判断できる',
    order: 12,
  },

  // 個人診断 - 業務設計力（4問）
  {
    id: 'p_design_1',
    type: 'personal',
    category: 'design',
    text: '自分の業務プロセスをAI視点で見直せる',
    order: 13,
  },
  {
    id: 'p_design_2',
    type: 'personal',
    category: 'design',
    text: '「AIに任せる」「人が行う」を切り分けられる',
    order: 14,
  },
  {
    id: 'p_design_3',
    type: 'personal',
    category: 'design',
    text: 'AIを組み込んだ業務フローを考えられる',
    order: 15,
  },
  {
    id: 'p_design_4',
    type: 'personal',
    category: 'design',
    text: 'AIアプリ・自動化を業務に組み込める',
    order: 16,
  },

  // 個人診断 - 価値創造力（4問）
  {
    id: 'p_innovation_1',
    type: 'personal',
    category: 'innovation',
    text: 'AIを顧客理解に活用できる',
    order: 17,
  },
  {
    id: 'p_innovation_2',
    type: 'personal',
    category: 'innovation',
    text: 'AIを商品・サービス改善に活用できる',
    order: 18,
  },
  {
    id: 'p_innovation_3',
    type: 'personal',
    category: 'innovation',
    text: 'AIを意思決定支援に活用できる',
    order: 19,
  },
  {
    id: 'p_innovation_4',
    type: 'personal',
    category: 'innovation',
    text: 'AIで新しい顧客価値を創造できる',
    order: 20,
  },

  // 組織診断 - 導入（3問）
  {
    id: 'o_adoption_1',
    type: 'organization',
    category: 'adoption',
    text: '会社としてAI利用を認めている',
    order: 21,
  },
  {
    id: 'o_adoption_2',
    type: 'organization',
    category: 'adoption',
    text: 'AI利用ルールが明確に定められている',
    order: 22,
  },
  {
    id: 'o_adoption_3',
    type: 'organization',
    category: 'adoption',
    text: '推奨AIツールが提示されている',
    order: 23,
  },

  // 組織診断 - 利用（3問）
  {
    id: 'o_usage_1',
    type: 'organization',
    category: 'usage',
    text: '社員が継続的にAIを利用している',
    order: 24,
  },
  {
    id: 'o_usage_2',
    type: 'organization',
    category: 'usage',
    text: '部門内でAI利用方法が共有されている',
    order: 25,
  },
  {
    id: 'o_usage_3',
    type: 'organization',
    category: 'usage',
    text: 'AI活用事例が蓄積されている',
    order: 26,
  },

  // 組織診断 - 業務組込み（3問）
  {
    id: 'o_integration_1',
    type: 'organization',
    category: 'integration',
    text: 'AIが実際の業務プロセスに組み込まれている',
    order: 27,
  },
  {
    id: 'o_integration_2',
    type: 'organization',
    category: 'integration',
    text: 'AIによる業務改善を継続的に行っている',
    order: 28,
  },
  {
    id: 'o_integration_3',
    type: 'organization',
    category: 'integration',
    text: 'AIアプリ・自動化が実装されている',
    order: 29,
  },

  // 組織診断 - データ・仕組み（3問）
  {
    id: 'o_infrastructure_1',
    type: 'organization',
    category: 'infrastructure',
    text: '社内データをAI活用できる状態にしている',
    order: 30,
  },
  {
    id: 'o_infrastructure_2',
    type: 'organization',
    category: 'infrastructure',
    text: 'RAG等で社内知識をAIから利用できる',
    order: 31,
  },
  {
    id: 'o_infrastructure_3',
    type: 'organization',
    category: 'infrastructure',
    text: 'AI活用を支えるシステム基盤がある',
    order: 32,
  },

  // 組織診断 - 経営活用（3問）
  {
    id: 'o_management_1',
    type: 'organization',
    category: 'management',
    text: '経営判断にAIを活用している',
    order: 33,
  },
  {
    id: 'o_management_2',
    type: 'organization',
    category: 'management',
    text: '顧客価値向上にAIを活用している',
    order: 34,
  },
  {
    id: 'o_management_3',
    type: 'organization',
    category: 'management',
    text: 'AIを前提に業務・組織を再設計している',
    order: 35,
  },
];

/**
 * IDで質問を取得
 */
export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

/**
 * ステップごとの質問を取得
 * ステップ1: 基本情報（質問なし）
 * ステップ2-5: 個人診断（各5問）
 * ステップ6-8: 組織診断（各5問）
 */
export function getQuestionsForStep(step: number): Question[] {
  if (step === 1) {
    return []; // 基本情報入力のみ
  }

  // ステップ2-5: 個人診断（各5問）
  if (step >= 2 && step <= 5) {
    const startIdx = (step - 2) * 5;
    return questions.slice(startIdx, startIdx + 5);
  }

  // ステップ6-8: 組織診断（各5問）
  if (step >= 6 && step <= 8) {
    const startIdx = 20 + (step - 6) * 5;
    return questions.slice(startIdx, startIdx + 5);
  }

  return [];
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No compilation errors

- [ ] **Step 3: Commit**

```bash
git add lib/questions.ts
git commit -m "feat: add question data for assessment

- Add 20 personal assessment questions (5 axes × 4 questions)
- Add 15 organizational assessment questions (5 categories × 3 questions)
- Implement question lookup and step-based filtering
- Define 5-point scale labels

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: localStorage Management

**Files:**
- Create: `ai-level-test/lib/storage.ts`
- Create: `ai-level-test/lib/__tests__/storage.test.ts`

**Interfaces:**
- Consumes: `AssessmentResult` from `lib/types.ts`
- Produces:
  - `saveAssessment(result: AssessmentResult): void`
  - `getAssessments(): AssessmentResult[]`
  - `getAssessmentById(id: string): AssessmentResult | null`
  - `deleteAssessment(id: string): void`

- [ ] **Step 1: Write failing test for saveAssessment**

```typescript
// lib/__tests__/storage.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveAssessment, getAssessments, getAssessmentById, deleteAssessment } from '../storage';
import type { AssessmentResult } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockResult: AssessmentResult = {
    id: 'test-id-1',
    basicInfo: { name: 'Test User', timestamp: Date.now() },
    personalAnswers: [],
    organizationAnswers: [],
    personalLevel: 3,
    organizationLevel: 2,
    axisScores: {
      literacy: 3.5,
      operation: 3.0,
      application: 2.5,
      design: 2.0,
      innovation: 1.5,
    },
    orgScores: {
      adoption: 2.5,
      usage: 2.0,
      integration: 1.5,
      infrastructure: 1.0,
      management: 1.0,
    },
    createdAt: new Date().toISOString(),
  };

  describe('saveAssessment', () => {
    it('should save assessment to localStorage', () => {
      saveAssessment(mockResult);
      const saved = getAssessments();
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe('test-id-1');
    });

    it('should append to existing assessments', () => {
      saveAssessment(mockResult);
      saveAssessment({ ...mockResult, id: 'test-id-2' });
      const saved = getAssessments();
      expect(saved).toHaveLength(2);
    });
  });

  describe('getAssessments', () => {
    it('should return empty array when no assessments exist', () => {
      const result = getAssessments();
      expect(result).toEqual([]);
    });

    it('should return all saved assessments', () => {
      saveAssessment(mockResult);
      saveAssessment({ ...mockResult, id: 'test-id-2' });
      const result = getAssessments();
      expect(result).toHaveLength(2);
    });
  });

  describe('getAssessmentById', () => {
    it('should return null when assessment not found', () => {
      const result = getAssessmentById('non-existent');
      expect(result).toBeNull();
    });

    it('should return assessment when found', () => {
      saveAssessment(mockResult);
      const result = getAssessmentById('test-id-1');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('test-id-1');
    });
  });

  describe('deleteAssessment', () => {
    it('should delete assessment by id', () => {
      saveAssessment(mockResult);
      saveAssessment({ ...mockResult, id: 'test-id-2' });
      deleteAssessment('test-id-1');
      const remaining = getAssessments();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('test-id-2');
    });

    it('should handle deleting non-existent assessment', () => {
      saveAssessment(mockResult);
      deleteAssessment('non-existent');
      const remaining = getAssessments();
      expect(remaining).toHaveLength(1);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test storage.test.ts`
Expected: FAIL (storage module not found)

- [ ] **Step 3: Implement storage module**

```typescript
// lib/storage.ts
import type { AssessmentResult } from './types';

const STORAGE_KEY = 'ai-level-test:assessments';

/**
 * localStorage が利用可能かチェック
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * 診断結果を保存
 */
export function saveAssessment(result: AssessmentResult): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    const existing = getAssessments();
    const updated = [...existing, result];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save assessment:', error);
  }
}

/**
 * 全診断結果を取得
 */
export function getAssessments(): AssessmentResult[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as AssessmentResult[];
  } catch (error) {
    console.error('Failed to get assessments:', error);
    return [];
  }
}

/**
 * IDで特定の診断結果を取得
 */
export function getAssessmentById(id: string): AssessmentResult | null {
  const assessments = getAssessments();
  return assessments.find((a) => a.id === id) || null;
}

/**
 * 診断結果を削除
 */
export function deleteAssessment(id: string): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    const existing = getAssessments();
    const filtered = existing.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete assessment:', error);
  }
}
```

- [ ] **Step 4: Create test directory**

```bash
mkdir -p lib/__tests__
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test storage.test.ts`
Expected: PASS (all tests passing)

- [ ] **Step 6: Commit**

```bash
git add lib/storage.ts lib/__tests__/storage.test.ts
git commit -m "feat: add localStorage management for assessments

- Implement save/get/delete operations for assessment results
- Add localStorage availability check
- Handle errors gracefully with console warnings
- Add comprehensive test coverage

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Scoring Logic

**Files:**
- Create: `ai-level-test/lib/scoring.ts`
- Create: `ai-level-test/lib/__tests__/scoring.test.ts`

**Interfaces:**
- Consumes:
  - `Answer`, `AssessmentAxis`, `AxisScores`, `OrgScores` from `lib/types.ts`
  - `getQuestionById(id: string)` from `lib/questions.ts`
- Produces:
  - `calculateAxisScore(answers: Answer[], axis: AssessmentAxis): number`
  - `calculateOrgScore(answers: Answer[], category: OrganizationCategory): number`
  - `calculatePersonalLevel(axisScores: AxisScores): 1|2|3|4|5`
  - `calculateOrganizationLevel(orgScores: OrgScores): 1|2|3|4|5`
  - `calculateAllScores(personalAnswers: Answer[], organizationAnswers: Answer[]): { axisScores, orgScores, personalLevel, organizationLevel }`

- [ ] **Step 1: Write failing tests for scoring logic**

```typescript
// lib/__tests__/scoring.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateAxisScore,
  calculateOrgScore,
  calculatePersonalLevel,
  calculateOrganizationLevel,
  calculateAllScores,
} from '../scoring';
import type { Answer, AxisScores, OrgScores } from '../types';

describe('scoring', () => {
  describe('calculateAxisScore', () => {
    it('should calculate average score for an axis', () => {
      const answers: Answer[] = [
        { questionId: 'p_literacy_1', score: 4 },
        { questionId: 'p_literacy_2', score: 3 },
        { questionId: 'p_literacy_3', score: 5 },
        { questionId: 'p_literacy_4', score: 4 },
      ];
      const score = calculateAxisScore(answers, 'literacy');
      expect(score).toBe(4); // (4+3+5+4)/4 = 4
    });

    it('should return 0 when no answers for axis', () => {
      const answers: Answer[] = [];
      const score = calculateAxisScore(answers, 'literacy');
      expect(score).toBe(0);
    });
  });

  describe('calculatePersonalLevel', () => {
    it('should return level 5 when average >= 4.5 and min >= 4.0', () => {
      const scores: AxisScores = {
        literacy: 4.5,
        operation: 4.5,
        application: 4.5,
        design: 4.0,
        innovation: 4.5,
      };
      expect(calculatePersonalLevel(scores)).toBe(5);
    });

    it('should return level 4 when average >= 3.5 and min >= 3.0', () => {
      const scores: AxisScores = {
        literacy: 4.0,
        operation: 3.5,
        application: 3.5,
        design: 3.0,
        innovation: 3.5,
      };
      expect(calculatePersonalLevel(scores)).toBe(4);
    });

    it('should return level 3 when average >= 2.5 and min >= 2.0', () => {
      const scores: AxisScores = {
        literacy: 3.0,
        operation: 2.5,
        application: 2.5,
        design: 2.0,
        innovation: 2.5,
      };
      expect(calculatePersonalLevel(scores)).toBe(3);
    });

    it('should return level 2 when average >= 1.5', () => {
      const scores: AxisScores = {
        literacy: 2.0,
        operation: 1.5,
        application: 1.5,
        design: 1.5,
        innovation: 1.5,
      };
      expect(calculatePersonalLevel(scores)).toBe(2);
    });

    it('should return level 1 when average < 1.5', () => {
      const scores: AxisScores = {
        literacy: 1.0,
        operation: 1.0,
        application: 1.0,
        design: 1.0,
        innovation: 1.0,
      };
      expect(calculatePersonalLevel(scores)).toBe(1);
    });

    it('should enforce minimum score requirement', () => {
      // Average is 4.1 but one axis is below 3.0
      const scores: AxisScores = {
        literacy: 5.0,
        operation: 5.0,
        application: 5.0,
        design: 5.0,
        innovation: 0.5, // Below threshold
      };
      expect(calculatePersonalLevel(scores)).toBe(2);
    });
  });

  describe('calculateAllScores', () => {
    it('should calculate all scores from answers', () => {
      const personalAnswers: Answer[] = [
        { questionId: 'p_literacy_1', score: 4 },
        { questionId: 'p_literacy_2', score: 4 },
        { questionId: 'p_literacy_3', score: 4 },
        { questionId: 'p_literacy_4', score: 4 },
        { questionId: 'p_operation_1', score: 3 },
        { questionId: 'p_operation_2', score: 3 },
        { questionId: 'p_operation_3', score: 3 },
        { questionId: 'p_operation_4', score: 3 },
        { questionId: 'p_application_1', score: 3 },
        { questionId: 'p_application_2', score: 3 },
        { questionId: 'p_application_3', score: 3 },
        { questionId: 'p_application_4', score: 3 },
        { questionId: 'p_design_1', score: 3 },
        { questionId: 'p_design_2', score: 3 },
        { questionId: 'p_design_3', score: 3 },
        { questionId: 'p_design_4', score: 3 },
        { questionId: 'p_innovation_1', score: 3 },
        { questionId: 'p_innovation_2', score: 3 },
        { questionId: 'p_innovation_3', score: 3 },
        { questionId: 'p_innovation_4', score: 3 },
      ];

      const organizationAnswers: Answer[] = [
        { questionId: 'o_adoption_1', score: 2 },
        { questionId: 'o_adoption_2', score: 2 },
        { questionId: 'o_adoption_3', score: 2 },
        { questionId: 'o_usage_1', score: 2 },
        { questionId: 'o_usage_2', score: 2 },
        { questionId: 'o_usage_3', score: 2 },
        { questionId: 'o_integration_1', score: 2 },
        { questionId: 'o_integration_2', score: 2 },
        { questionId: 'o_integration_3', score: 2 },
        { questionId: 'o_infrastructure_1', score: 2 },
        { questionId: 'o_infrastructure_2', score: 2 },
        { questionId: 'o_infrastructure_3', score: 2 },
        { questionId: 'o_management_1', score: 2 },
        { questionId: 'o_management_2', score: 2 },
        { questionId: 'o_management_3', score: 2 },
      ];

      const result = calculateAllScores(personalAnswers, organizationAnswers);
      
      expect(result.axisScores.literacy).toBe(4);
      expect(result.axisScores.operation).toBe(3);
      expect(result.personalLevel).toBe(3);
      expect(result.organizationLevel).toBe(2);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test scoring.test.ts`
Expected: FAIL (scoring module not found)

- [ ] **Step 3: Implement scoring logic**

```typescript
// lib/scoring.ts
import type {
  Answer,
  AssessmentAxis,
  OrganizationCategory,
  AxisScores,
  OrgScores,
} from './types';
import { getQuestionById } from './questions';

/**
 * 各軸のスコア計算（平均値）
 */
export function calculateAxisScore(
  answers: Answer[],
  axis: AssessmentAxis
): number {
  const axisAnswers = answers.filter((a) => {
    const question = getQuestionById(a.questionId);
    return question?.category === axis;
  });

  if (axisAnswers.length === 0) {
    return 0;
  }

  const sum = axisAnswers.reduce((acc, a) => acc + a.score, 0);
  return sum / axisAnswers.length;
}

/**
 * 組織スコア計算
 */
export function calculateOrgScore(
  answers: Answer[],
  category: OrganizationCategory
): number {
  const categoryAnswers = answers.filter((a) => {
    const question = getQuestionById(a.questionId);
    return question?.category === category;
  });

  if (categoryAnswers.length === 0) {
    return 0;
  }

  const sum = categoryAnswers.reduce((acc, a) => acc + a.score, 0);
  return sum / categoryAnswers.length;
}

/**
 * 個人総合レベル判定
 * 平均スコアだけでなく最低スコアも考慮
 */
export function calculatePersonalLevel(
  axisScores: AxisScores
): 1 | 2 | 3 | 4 | 5 {
  const scores = Object.values(axisScores);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const minScore = Math.min(...scores);

  // レベル5: 平均4.5以上 かつ 全軸4.0以上
  if (average >= 4.5 && minScore >= 4.0) return 5;

  // レベル4: 平均3.5以上 かつ 全軸3.0以上
  if (average >= 3.5 && minScore >= 3.0) return 4;

  // レベル3: 平均2.5以上 かつ 全軸2.0以上
  if (average >= 2.5 && minScore >= 2.0) return 3;

  // レベル2: 平均1.5以上
  if (average >= 1.5) return 2;

  // レベル1
  return 1;
}

/**
 * 組織総合レベル判定
 */
export function calculateOrganizationLevel(
  orgScores: OrgScores
): 1 | 2 | 3 | 4 | 5 {
  const scores = Object.values(orgScores);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const minScore = Math.min(...scores);

  // レベル5: 平均4.5以上 かつ 全項目4.0以上
  if (average >= 4.5 && minScore >= 4.0) return 5;

  // レベル4: 平均3.5以上 かつ 全項目3.0以上
  if (average >= 3.5 && minScore >= 3.0) return 4;

  // レベル3: 平均2.5以上 かつ 全項目2.0以上
  if (average >= 2.5 && minScore >= 2.0) return 3;

  // レベル2: 平均1.5以上
  if (average >= 1.5) return 2;

  // レベル1
  return 1;
}

/**
 * すべてのスコアを計算
 */
export function calculateAllScores(
  personalAnswers: Answer[],
  organizationAnswers: Answer[]
): {
  axisScores: AxisScores;
  orgScores: OrgScores;
  personalLevel: 1 | 2 | 3 | 4 | 5;
  organizationLevel: 1 | 2 | 3 | 4 | 5;
} {
  const axisScores: AxisScores = {
    literacy: calculateAxisScore(personalAnswers, 'literacy'),
    operation: calculateAxisScore(personalAnswers, 'operation'),
    application: calculateAxisScore(personalAnswers, 'application'),
    design: calculateAxisScore(personalAnswers, 'design'),
    innovation: calculateAxisScore(personalAnswers, 'innovation'),
  };

  const orgScores: OrgScores = {
    adoption: calculateOrgScore(organizationAnswers, 'adoption'),
    usage: calculateOrgScore(organizationAnswers, 'usage'),
    integration: calculateOrgScore(organizationAnswers, 'integration'),
    infrastructure: calculateOrgScore(organizationAnswers, 'infrastructure'),
    management: calculateOrgScore(organizationAnswers, 'management'),
  };

  const personalLevel = calculatePersonalLevel(axisScores);
  const organizationLevel = calculateOrganizationLevel(orgScores);

  return {
    axisScores,
    orgScores,
    personalLevel,
    organizationLevel,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test scoring.test.ts`
Expected: PASS (all tests passing)

- [ ] **Step 5: Commit**

```bash
git add lib/scoring.ts lib/__tests__/scoring.test.ts
git commit -m "feat: add scoring logic for assessment results

- Calculate axis-level and category-level scores
- Implement 5-level grading with minimum score requirements
- Add comprehensive test coverage for all edge cases
- Support both personal and organizational assessment scoring

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Recommendations and Gap Analysis

**Files:**
- Create: `ai-level-test/lib/recommendations.ts`
- Create: `ai-level-test/lib/__tests__/recommendations.test.ts`

**Interfaces:**
- Consumes: `GapPattern`, `AxisScores` from `lib/types.ts`
- Produces:
  - `analyzeGap(personalLevel: number, orgLevel: number): GapPattern`
  - `getRecommendations(level: 1|2|3|4|5): string[]`
  - `getGapRecommendations(pattern: GapPattern): string[]`
  - `analyzeStrengthWeakness(axisScores: AxisScores): { strengths, weaknesses }`
  - `getLevelDefinition(level: 1|2|3|4|5): LevelDefinition`

- [ ] **Step 1: Write failing tests**

```typescript
// lib/__tests__/recommendations.test.ts
import { describe, it, expect } from 'vitest';
import {
  analyzeGap,
  getRecommendations,
  getGapRecommendations,
  analyzeStrengthWeakness,
  getLevelDefinition,
} from '../recommendations';
import type { AxisScores } from '../types';

describe('recommendations', () => {
  describe('analyzeGap', () => {
    it('should identify balanced pattern', () => {
      expect(analyzeGap(3, 3)).toBe('balanced');
      expect(analyzeGap(3, 2)).toBe('balanced');
      expect(analyzeGap(2, 3)).toBe('balanced');
    });

    it('should identify personal-leading pattern', () => {
      expect(analyzeGap(4, 2)).toBe('personal-leading');
      expect(analyzeGap(5, 3)).toBe('personal-leading');
    });

    it('should identify org-leading pattern', () => {
      expect(analyzeGap(2, 4)).toBe('org-leading');
      expect(analyzeGap(1, 3)).toBe('org-leading');
    });

    it('should identify both-low pattern', () => {
      expect(analyzeGap(1, 1)).toBe('both-low');
      expect(analyzeGap(2, 2)).toBe('both-low');
      expect(analyzeGap(1, 2)).toBe('both-low');
    });

    it('should identify both-high pattern', () => {
      expect(analyzeGap(4, 4)).toBe('both-high');
      expect(analyzeGap(5, 5)).toBe('both-high');
      expect(analyzeGap(4, 5)).toBe('both-high');
    });
  });

  describe('getRecommendations', () => {
    it('should return recommendations for each level', () => {
      const level1 = getRecommendations(1);
      expect(level1.length).toBeGreaterThan(0);
      expect(level1[0]).toContain('AI');

      const level5 = getRecommendations(5);
      expect(level5.length).toBeGreaterThan(0);
    });
  });

  describe('getGapRecommendations', () => {
    it('should return recommendations for each gap pattern', () => {
      const personalLeading = getGapRecommendations('personal-leading');
      expect(personalLeading.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeStrengthWeakness', () => {
    it('should identify top 2 strengths and bottom 2 weaknesses', () => {
      const scores: AxisScores = {
        literacy: 4.5,
        operation: 4.0,
        application: 2.5,
        design: 2.0,
        innovation: 1.5,
      };

      const analysis = analyzeStrengthWeakness(scores);
      
      expect(analysis.strengths).toHaveLength(2);
      expect(analysis.strengths[0].axis).toBe('literacy');
      expect(analysis.strengths[1].axis).toBe('operation');
      
      expect(analysis.weaknesses).toHaveLength(2);
      expect(analysis.weaknesses[0].axis).toBe('design');
      expect(analysis.weaknesses[1].axis).toBe('innovation');
    });
  });

  describe('getLevelDefinition', () => {
    it('should return correct definition for each level', () => {
      const level1 = getLevelDefinition(1);
      expect(level1.name).toBe('知る');
      expect(level1.description).toContain('AI');

      const level5 = getLevelDefinition(5);
      expect(level5.name).toBe('変革する');
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test recommendations.test.ts`
Expected: FAIL (recommendations module not found)

- [ ] **Step 3: Implement recommendations module**

```typescript
// lib/recommendations.ts
import type { GapPattern, AxisScores, LevelDefinition } from './types';

/**
 * レベル定義
 */
export const levelDefinitions: LevelDefinition[] = [
  {
    level: 1,
    name: '知る',
    description: 'AIの基本・特性・リスクを理解している段階です。',
  },
  {
    level: 2,
    name: '使う',
    description: '日常業務でAIを利用できる段階です。',
  },
  {
    level: 3,
    name: '改善する',
    description: '自分の業務をAIで効率化・高度化できる段階です。',
  },
  {
    level: 4,
    name: '設計する',
    description: 'AIを組み込んだ業務プロセスを設計できる段階です。',
  },
  {
    level: 5,
    name: '変革する',
    description: 'AIで顧客価値・事業・組織を変革できる段階です。',
  },
];

/**
 * レベル定義を取得
 */
export function getLevelDefinition(level: 1 | 2 | 3 | 4 | 5): LevelDefinition {
  return levelDefinitions[level - 1];
}

/**
 * 評価軸のラベル
 */
const axisLabels: Record<keyof AxisScores, string> = {
  literacy: 'AIリテラシー',
  operation: 'AI操作力',
  application: '業務活用力',
  design: '業務設計力',
  innovation: '価値創造力',
};

/**
 * ギャップ分析
 */
export function analyzeGap(
  personalLevel: number,
  orgLevel: number
): GapPattern {
  const diff = personalLevel - orgLevel;

  if (personalLevel <= 2 && orgLevel <= 2) return 'both-low';
  if (personalLevel >= 4 && orgLevel >= 4) return 'both-high';
  if (diff >= 2) return 'personal-leading';
  if (diff <= -2) return 'org-leading';
  return 'balanced';
}

/**
 * レベル別推奨アクション
 */
const levelRecommendations: Record<1 | 2 | 3 | 4 | 5, string[]> = {
  1: [
    'AIの基本特性を理解する',
    'AI利用の安全性とリスクを学ぶ',
    '小さな業務でAIを試してみる',
  ],
  2: [
    'メール作成・返信にAIを活用する',
    '文書作成・要約にAIを活用する',
    '会議の議事録作成にAIを活用する',
  ],
  3: [
    '自分の業務を棚卸しし、AI活用箇所を発見する',
    'AIと既存ツールを組み合わせて効率化する',
    '作業時間・品質の改善効果を測定する',
  ],
  4: [
    'AIエージェントを業務に組み込む',
    'RAG（社内知識のAI活用）を検討する',
    '部門横断でAI活用プロジェクトを推進する',
  ],
  5: [
    'AIを前提に顧客価値を再設計する',
    'AI活用による新規事業を創出する',
    'AIを組み込んだ組織・業務設計を行う',
  ],
};

/**
 * レベル別推奨アクションを取得
 */
export function getRecommendations(level: 1 | 2 | 3 | 4 | 5): string[] {
  return levelRecommendations[level];
}

/**
 * ギャップパターン別推奨アクション
 */
const gapPatternRecommendations: Record<GapPattern, string[]> = {
  'personal-leading': [
    'AI活用事例を社内で共有する',
    '部門別AIプロジェクトを立ち上げる',
    'AI利用ルールを整備する',
  ],
  'org-leading': [
    '社内のAI研修に参加する',
    'AI活用の成功事例を学ぶ',
    '実践的なAI活用を増やす',
  ],
  balanced: ['個人と組織の両面でAI活用を進める', '継続的な改善を実施する'],
  'both-low': ['まずAI基礎研修から始める', '小さく始めて成功体験を積む'],
  'both-high': [
    'AI活用のベストプラクティスを他部門に展開する',
    '新しいAI技術・手法に挑戦する',
  ],
};

/**
 * ギャップパターン別推奨アクションを取得
 */
export function getGapRecommendations(pattern: GapPattern): string[] {
  return gapPatternRecommendations[pattern];
}

/**
 * 強み・弱み分析
 */
export function analyzeStrengthWeakness(axisScores: AxisScores): {
  strengths: Array<{ axis: string; score: number }>;
  weaknesses: Array<{ axis: string; score: number }>;
} {
  const entries = Object.entries(axisScores) as Array<
    [keyof AxisScores, number]
  >;
  const sorted = entries.sort((a, b) => b[1] - a[1]);

  return {
    strengths: sorted.slice(0, 2).map(([axis, score]) => ({
      axis: axisLabels[axis],
      score,
    })),
    weaknesses: sorted
      .slice(-2)
      .reverse()
      .map(([axis, score]) => ({
        axis: axisLabels[axis],
        score,
      })),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test recommendations.test.ts`
Expected: PASS (all tests passing)

- [ ] **Step 5: Commit**

```bash
git add lib/recommendations.ts lib/__tests__/recommendations.test.ts
git commit -m "feat: add recommendations and gap analysis logic

- Implement gap pattern analysis (balanced, personal-leading, etc.)
- Add level-based and gap-pattern-based recommendations
- Implement strength/weakness analysis
- Define level definitions with Japanese labels
- Add comprehensive test coverage

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Basic UI Components

**Files:**
- Create: `ai-level-test/components/ui/Button.tsx`
- Create: `ai-level-test/components/ui/Card.tsx`
- Create: `ai-level-test/components/ui/ProgressBar.tsx`

**Interfaces:**
- Consumes: None (pure UI components)
- Produces:
  - `Button` component with primary/secondary variants
  - `Card` component for content containers
  - `ProgressBar` component showing percentage completion

- [ ] **Step 1: Create components directory structure**

```bash
mkdir -p components/ui
```

- [ ] **Step 2: Create Button component**

```typescript
// components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-colors';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 3: Create Card component**

```typescript
// components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create ProgressBar component**

```typescript
// components/ui/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>進捗状況</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No compilation errors

- [ ] **Step 6: Commit**

```bash
git add components/ui/
git commit -m "feat: add basic UI components

- Add Button component with primary/secondary variants
- Add Card component for content containers
- Add ProgressBar component with percentage display
- All components use Tailwind CSS for styling

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Assessment Context

**Files:**
- Create: `ai-level-test/contexts/AssessmentContext.tsx`
- Create: `ai-level-test/lib/__tests__/AssessmentContext.test.tsx`

**Interfaces:**
- Consumes:
  - `BasicInfo`, `Answer`, `AssessmentResult` from `lib/types.ts`
  - `calculateAllScores` from `lib/scoring.ts`
  - `saveAssessment` from `lib/storage.ts`
- Produces:
  - `AssessmentProvider` component
  - `useAssessment()` hook returning:
    - `state: AssessmentState`
    - `setBasicInfo(info: BasicInfo): void`
    - `answerQuestion(questionId: string, score: 1|2|3|4|5): void`
    - `nextStep(): void`
    - `prevStep(): void`
    - `reset(): void`
    - `submitAssessment(): AssessmentResult | null`

- [ ] **Step 1: Create contexts directory**

```bash
mkdir contexts
```

- [ ] **Step 2: Create AssessmentContext**

```typescript
// contexts/AssessmentContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { BasicInfo, Answer, AssessmentResult } from '@/lib/types';
import { calculateAllScores } from '@/lib/scoring';
import { saveAssessment } from '@/lib/storage';

interface AssessmentState {
  currentStep: number;
  totalSteps: number;
  basicInfo: BasicInfo;
  answers: Answer[];
  isComplete: boolean;
  resultId: string | null;
}

interface AssessmentContextValue {
  state: AssessmentState;
  setBasicInfo: (info: BasicInfo) => void;
  answerQuestion: (questionId: string, score: 1 | 2 | 3 | 4 | 5) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  submitAssessment: () => AssessmentResult | null;
}

const AssessmentContext = createContext<AssessmentContextValue | undefined>(
  undefined
);

const TOTAL_STEPS = 8;

const initialState: AssessmentState = {
  currentStep: 1,
  totalSteps: TOTAL_STEPS,
  basicInfo: { timestamp: Date.now() },
  answers: [],
  isComplete: false,
  resultId: null,
};

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AssessmentState>(initialState);

  const setBasicInfo = useCallback((info: BasicInfo) => {
    setState((prev) => ({
      ...prev,
      basicInfo: { ...info, timestamp: Date.now() },
    }));
  }, []);

  const answerQuestion = useCallback(
    (questionId: string, score: 1 | 2 | 3 | 4 | 5) => {
      setState((prev) => {
        const existingIndex = prev.answers.findIndex(
          (a) => a.questionId === questionId
        );
        const newAnswers = [...prev.answers];

        if (existingIndex >= 0) {
          newAnswers[existingIndex] = { questionId, score };
        } else {
          newAnswers.push({ questionId, score });
        }

        return {
          ...prev,
          answers: newAnswers,
        };
      });
    },
    []
  );

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const submitAssessment = useCallback((): AssessmentResult | null => {
    const personalAnswers = state.answers.filter((a) =>
      a.questionId.startsWith('p_')
    );
    const organizationAnswers = state.answers.filter((a) =>
      a.questionId.startsWith('o_')
    );

    if (personalAnswers.length < 20 || organizationAnswers.length < 15) {
      console.warn('Not all questions answered');
      return null;
    }

    const { axisScores, orgScores, personalLevel, organizationLevel } =
      calculateAllScores(personalAnswers, organizationAnswers);

    const result: AssessmentResult = {
      id: crypto.randomUUID(),
      basicInfo: state.basicInfo,
      personalAnswers,
      organizationAnswers,
      personalLevel,
      organizationLevel,
      axisScores,
      orgScores,
      createdAt: new Date().toISOString(),
    };

    saveAssessment(result);

    setState((prev) => ({
      ...prev,
      isComplete: true,
      resultId: result.id,
    }));

    return result;
  }, [state]);

  const value: AssessmentContextValue = {
    state,
    setBasicInfo,
    answerQuestion,
    nextStep,
    prevStep,
    reset,
    submitAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No compilation errors

- [ ] **Step 4: Commit**

```bash
git add contexts/AssessmentContext.tsx
git commit -m "feat: add Assessment Context for state management

- Implement React Context for managing assessment flow
- Support basic info, question answers, and navigation
- Calculate and save results on submission
- Use crypto.randomUUID() for assessment IDs
- Mark as 'use client' for Next.js App Router

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 9: App Layout and Global Styles

**Files:**
- Create: `ai-level-test/app/layout.tsx`
- Create: `ai-level-test/app/globals.css`

**Interfaces:**
- Consumes: `AssessmentProvider` from `contexts/AssessmentContext.tsx`
- Produces: Root layout wrapping all pages

- [ ] **Step 1: Create app directory**

```bash
mkdir app
```

- [ ] **Step 2: Create globals.css with Tailwind and print styles**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

/* Print styles for PDF export */
@media print {
  /* Hide non-printable elements */
  header,
  nav,
  footer,
  .no-print {
    display: none !important;
  }

  /* Page setup */
  @page {
    size: A4;
    margin: 2cm;
  }

  /* Ensure charts don't break across pages */
  .tremor-Chart,
  .chart-container,
  section {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Force color printing */
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Adjust background colors for print */
  .bg-gray-50,
  .bg-gray-100 {
    background-color: white !important;
  }
}
```

- [ ] **Step 3: Create root layout**

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI活用成熟度診断',
  description: '個人と組織のAI活用レベルを診断し、推奨アクションを提示します',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AssessmentProvider>{children}</AssessmentProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No compilation errors

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add root layout and global styles

- Setup Next.js App Router root layout
- Wrap app in AssessmentProvider for global state
- Add Tailwind CSS directives
- Add print media queries for PDF export
- Configure metadata for SEO

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Top Page

**Files:**
- Create: `ai-level-test/app/page.tsx`

**Interfaces:**
- Consumes:
  - `Button` from `components/ui/Button`
  - `Card` from `components/ui/Card`
- Produces: Landing page with start button

- [ ] **Step 1: Create top page**

```typescript
// app/page.tsx
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
```

- [ ] **Step 2: Verify page renders**

Run: `npm run dev`
Expected: Dev server starts on port 3001

- [ ] **Step 3: Open browser and verify**

Open: http://localhost:3001
Expected: Top page displays with "診断を開始する" button

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add top page with assessment overview

- Create landing page with app description
- List features and estimated time
- Add start button linking to /assessment
- Use responsive design with Tailwind CSS

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 11: Assessment Page - Basic Info Step

**Files:**
- Create: `ai-level-test/app/assessment/page.tsx`

**Interfaces:**
- Consumes:
  - `useAssessment()` from `contexts/AssessmentContext`
  - `Card`, `Button`, `ProgressBar` from `components/ui/`
  - `getQuestionsForStep()` from `lib/questions.ts`
- Produces: Multi-step assessment page

- [ ] **Step 1: Create assessment directory**

```bash
mkdir app/assessment
```

- [ ] **Step 2: Create assessment page (will be extended in Task 12)**

```typescript
// app/assessment/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function AssessmentPage() {
  const router = useRouter();
  const { state, setBasicInfo, nextStep } = useAssessment();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBasicInfo({ name: name.trim() || undefined, timestamp: Date.now() });
    nextStep();
  };

  // Step 1: Basic Info
  if (state.currentStep === 1) {
    return (
      <div className="min-h-screen p-4 py-8">
        <div className="max-w-2xl mx-auto">
          <ProgressBar
            current={state.currentStep}
            total={state.totalSteps}
            className="mb-8"
          />

          <Card>
            <h1 className="text-2xl font-bold mb-6">基本情報</h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  お名前（任意）
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="匿名で診断することもできます"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  入力した名前は診断結果に表示されます
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/')}
                >
                  戻る
                </Button>
                <Button type="submit" className="flex-1">
                  次へ
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Steps 2-8 will be added in Task 12
  return <div>Loading...</div>;
}
```

- [ ] **Step 3: Test navigation from top page**

Run: `npm run dev` and click "診断を開始する"
Expected: Basic info form displays

- [ ] **Step 4: Commit**

```bash
git add app/assessment/page.tsx
git commit -m "feat: add assessment page with basic info step

- Create assessment page with step-based flow
- Add basic info form (name input, optional)
- Implement navigation with ProgressBar
- Connect to AssessmentContext for state management
- Mark as 'use client' for interactive features

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 12: Assessment Page - Question Steps

**Files:**
- Modify: `ai-level-test/app/assessment/page.tsx`
- Create: `ai-level-test/components/assessment/QuestionCard.tsx`
- Create: `ai-level-test/components/assessment/StepIndicator.tsx`

**Interfaces:**
- Consumes:
  - `Question` from `lib/types.ts`
  - `scaleLabels` from `lib/questions.ts`
- Produces:
  - `QuestionCard` component
  - `StepIndicator` component
  - Complete assessment flow (steps 2-8)

- [ ] **Step 1: Create assessment components directory**

```bash
mkdir components/assessment
```

- [ ] **Step 2: Create QuestionCard component**

```typescript
// components/assessment/QuestionCard.tsx
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
```

- [ ] **Step 3: Create StepIndicator component**

```typescript
// components/assessment/StepIndicator.tsx
import React from 'react';

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  const getStepLabel = (step: number) => {
    if (step === 1) return '基本情報';
    if (step >= 2 && step <= 5) return '個人診断';
    if (step >= 6 && step <= 8) return '組織診断';
    return '';
  };

  return (
    <div className="text-center text-sm text-gray-600 mb-4">
      <span className="font-semibold">{getStepLabel(current)}</span>
      <span className="mx-2">·</span>
      <span>
        ステップ {current} / {total}
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Update assessment page with question steps**

```typescript
// app/assessment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { StepIndicator } from '@/components/assessment/StepIndicator';
import { getQuestionsForStep } from '@/lib/questions';

export default function AssessmentPage() {
  const router = useRouter();
  const { state, setBasicInfo, answerQuestion, nextStep, prevStep, submitAssessment } = useAssessment();
  const [name, setName] = useState('');
  const [stepAnswers, setStepAnswers] = useState<Record<string, 1 | 2 | 3 | 4 | 5>>({});

  const questions = getQuestionsForStep(state.currentStep);

  // Load existing answers when step changes
  useEffect(() => {
    const currentStepAnswers: Record<string, 1 | 2 | 3 | 4 | 5> = {};
    questions.forEach((q) => {
      const existing = state.answers.find((a) => a.questionId === q.id);
      if (existing) {
        currentStepAnswers[q.id] = existing.score;
      }
    });
    setStepAnswers(currentStepAnswers);
  }, [state.currentStep, state.answers, questions]);

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBasicInfo({ name: name.trim() || undefined, timestamp: Date.now() });
    nextStep();
  };

  const handleQuestionChange = (questionId: string, score: 1 | 2 | 3 | 4 | 5) => {
    setStepAnswers((prev) => ({ ...prev, [questionId]: score }));
    answerQuestion(questionId, score);
  };

  const handleNext = () => {
    // Check if all questions in this step are answered
    const allAnswered = questions.every((q) => stepAnswers[q.id] !== undefined);
    if (!allAnswered) {
      alert('すべての質問に回答してください');
      return;
    }

    if (state.currentStep === state.totalSteps) {
      // Last step: submit and go to results
      const result = submitAssessment();
      if (result) {
        router.push(`/result?id=${result.id}`);
      }
    } else {
      nextStep();
    }
  };

  // Step 1: Basic Info
  if (state.currentStep === 1) {
    return (
      <div className="min-h-screen p-4 py-8">
        <div className="max-w-2xl mx-auto">
          <ProgressBar
            current={state.currentStep}
            total={state.totalSteps}
            className="mb-8"
          />
          <StepIndicator current={state.currentStep} total={state.totalSteps} />

          <Card>
            <h1 className="text-2xl font-bold mb-6">基本情報</h1>

            <form onSubmit={handleBasicInfoSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  お名前（任意）
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="匿名で診断することもできます"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  入力した名前は診断結果に表示されます
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/')}
                >
                  戻る
                </Button>
                <Button type="submit" className="flex-1">
                  次へ
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Steps 2-8: Questions
  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <ProgressBar
          current={state.currentStep}
          total={state.totalSteps}
          className="mb-8"
        />
        <StepIndicator current={state.currentStep} total={state.totalSteps} />

        <Card>
          <h1 className="text-2xl font-bold mb-6">
            {state.currentStep <= 5 ? '個人診断' : '組織診断'}
          </h1>

          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              value={stepAnswers[question.id]}
              onChange={(score) => handleQuestionChange(question.id, score)}
            />
          ))}

          <div className="flex gap-4 mt-6">
            <Button type="button" variant="secondary" onClick={prevStep}>
              戻る
            </Button>
            <Button onClick={handleNext} className="flex-1">
              {state.currentStep === state.totalSteps ? '診断結果を見る' : '次へ'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Test complete assessment flow**

Run: `npm run dev` and complete all 8 steps
Expected: Can answer all questions and submit

- [ ] **Step 6: Commit**

```bash
git add app/assessment/page.tsx components/assessment/
git commit -m "feat: add question steps to assessment flow

- Create QuestionCard component with 5-point scale
- Create StepIndicator component showing current phase
- Implement steps 2-8 with question display
- Validate all questions answered before proceeding
- Auto-save answers to context on change
- Navigate to result page after submission

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 13: Result Page - Level Display and Structure

**Files:**
- Create: `ai-level-test/app/result/page.tsx`
- Create: `ai-level-test/components/result/LevelBadge.tsx`

**Interfaces:**
- Consumes:
  - `AssessmentResult` from `lib/types.ts`
  - `getAssessmentById` from `lib/storage.ts`
  - `getLevelDefinition` from `lib/recommendations.ts`
- Produces:
  - Result page layout
  - `LevelBadge` component

- [ ] **Step 1: Create result directory**

```bash
mkdir app/result
mkdir components/result
```

- [ ] **Step 2: Create LevelBadge component**

```typescript
// components/result/LevelBadge.tsx
import React from 'react';
import { getLevelDefinition } from '@/lib/recommendations';

interface LevelBadgeProps {
  level: 1 | 2 | 3 | 4 | 5;
  type: 'personal' | 'organization';
}

export function LevelBadge({ level, type }: LevelBadgeProps) {
  const def = getLevelDefinition(level);
  const colors = {
    1: 'bg-gray-100 text-gray-800 border-gray-300',
    2: 'bg-blue-100 text-blue-800 border-blue-300',
    3: 'bg-green-100 text-green-800 border-green-300',
    4: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    5: 'bg-purple-100 text-purple-800 border-purple-300',
  };

  return (
    <div className={`border-2 rounded-lg p-6 text-center ${colors[level]}`}>
      <div className="text-sm font-medium mb-1">
        {type === 'personal' ? '個人' : '組織'}
      </div>
      <div className="text-4xl font-bold mb-2">Lv.{level}</div>
      <div className="text-xl font-semibold mb-1">{def.name}</div>
      <div className="text-sm">{def.description}</div>
    </div>
  );
}
```

- [ ] **Step 3: Create result page structure**

```typescript
// app/result/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAssessmentById } from '@/lib/storage';
import type { AssessmentResult } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LevelBadge } from '@/components/result/LevelBadge';
import Link from 'next/link';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    if (id) {
      const assessment = getAssessmentById(id);
      setResult(assessment);
    }
  }, [id]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p>診断結果が見つかりません</p>
          <Link href="/">
            <Button className="mt-4">トップへ戻る</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <h1 className="text-3xl font-bold mb-2">診断結果</h1>
          {result.basicInfo.name && (
            <p className="text-gray-600">{result.basicInfo.name} 様</p>
          )}
          <p className="text-sm text-gray-500">
            {new Date(result.createdAt).toLocaleString('ja-JP')}
          </p>
        </Card>

        {/* Level Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <LevelBadge level={result.personalLevel} type="personal" />
          <LevelBadge level={result.organizationLevel} type="organization" />
        </div>

        {/* Placeholder for charts and analysis - will be added in Tasks 14-15 */}
        <Card className="mb-6">
          <p className="text-gray-500 text-center py-8">
            チャートと分析は次のタスクで追加されます
          </p>
        </Card>

        <div className="flex gap-4">
          <Link href="/">
            <Button variant="secondary">トップへ戻る</Button>
          </Link>
          <Link href="/history">
            <Button variant="secondary">診断履歴を見る</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Test result page**

Run: `npm run dev` and complete assessment
Expected: Result page displays with level badges

- [ ] **Step 5: Commit**

```bash
git add app/result/page.tsx components/result/LevelBadge.tsx
git commit -m "feat: add result page with level display

- Create result page fetching assessment by ID
- Add LevelBadge component with color-coded levels
- Display personal and organizational levels
- Show timestamp and optional name
- Add navigation back to top and history

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Tasks 14-17: Summary

The remaining tasks follow the same TDD structure as above. Key components:

**Task 14: Result Page - Charts**
- Create `RadarChart.tsx` using Tremor's BarChart for 5-axis visualization
- Create `MatrixChart.tsx` using Tremor's ScatterChart for personal×organization matrix
- Integrate both charts into result page

**Task 15: Result Page - Analysis Components**
- Create `GapAnalysis.tsx` displaying gap pattern and explanation
- Create `StrengthWeakness.tsx` showing top 2 and bottom 2 axes
- Create `Recommendations.tsx` listing level-based and gap-based actions
- Integrate all analysis components into result page

**Task 16: Result Page - PDF Export**
- Add `PDFDownloadButton.tsx` component (window.print())
- Enhance print CSS in globals.css for better PDF output
- Test PDF generation in browser

**Task 17: History Page**
- Create `app/history/page.tsx` listing all saved assessments
- Display assessment cards with date, name, and levels
- Add delete functionality
- Link to individual result pages

Each task includes:
- TDD approach with tests where applicable
- Complete implementation code
- Verification steps
- Git commit with conventional commit message

---

## Plan Self-Review

**1. Spec Coverage Check:**

Core features from spec:
- ✅ Project setup (Task 1)
- ✅ Type definitions and data model (Task 2)
- ✅ Question data - 35 questions (Task 3)
- ✅ localStorage management (Task 4)
- ✅ Scoring logic with min score requirements (Task 5)
- ✅ Recommendations and gap analysis (Task 6)
- ✅ UI components (Task 7)
- ✅ Assessment Context (Task 8)
- ✅ App layout and globals (Task 9)
- ✅ Top page (Task 10)
- ✅ Assessment flow - 8 steps (Tasks 11-12)
- ✅ Result page - levels, charts, analysis, PDF (Tasks 13-16)
- ✅ History page (Task 17)

All spec requirements covered.

**2. Placeholder Scan:**

No TBD, TODO, or incomplete sections found in tasks 1-13.
Tasks 14-17 are summarized with clear deliverables.

**3. Type Consistency:**

Checked interfaces across tasks:
- `AssessmentResult` - consistent structure
- `Question`, `Answer` - used consistently
- Function signatures match between produces/consumes
- No naming conflicts detected

**4. Ambiguity Check:**

Clear requirements for:
- Question IDs (p_/o_ prefix system)
- Scoring thresholds (exact values specified)
- Step structure (8 steps, question distribution defined)
- localStorage key (`ai-level-test:assessments`)
- Port (3001 to avoid conflict)

No ambiguities remain.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2024-09-14-ai-level-test-implementation.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, with review between tasks for fast iteration. To use this approach:
```
Use the superpowers:subagent-driven-development skill
```

**2. Inline Execution** - Execute tasks in this session using executing-plans, with batch execution and checkpoints for review. To use this approach:
```
Use the superpowers:executing-plans skill
```

**Which approach would you like to use?**

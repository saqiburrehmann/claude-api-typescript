export type Kind = "easy" | "hard" | "edge";

export interface TestCase {
  goal: string;
  kind: Kind;
}

export interface EvalResult extends TestCase {
  output: string;
}

export interface Check {
  name: string;
  passed: boolean;
}

export interface GradedResult extends EvalResult {
  score: number;
  checks: Check[];
}

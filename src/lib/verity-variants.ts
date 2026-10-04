export interface VerityVariant {
  id: string;
  /** 翻译键，指向 ui-verity-model 命名空间 */
  key: string;
  hasTalking: boolean;
}

export const VARIANTS: VerityVariant[] = [
  { id: "happy", key: "ui-verity-model.010", hasTalking: true },
  { id: "neutral", key: "ui-verity-model.011", hasTalking: true },
  { id: "evil", key: "ui-verity-model.012", hasTalking: true },
  { id: "crazy", key: "ui-verity-model.013", hasTalking: true },
  { id: "serious_1", key: "ui-verity-model.014", hasTalking: true },
  { id: "hurt", key: "ui-verity-model.015", hasTalking: false },
  { id: "noface", key: "ui-verity-model.016", hasTalking: false },
  { id: "happy_sleep", key: "ui-verity-model.017", hasTalking: false },
  { id: "smiling_evil", key: "ui-verity-model.018", hasTalking: false },
];

export const TALKING_MAP: Record<string, string> = {
  happy: "happy_talking",
  neutral: "neutral_talking",
  serious_1: "serious_talking",
  serious_2: "serious_talking",
  serious_3: "serious_talking",
  crazy: "crazy_talking",
  evil: "evil_talking",
  smiling_evil: "evil_talking",
  happy_sleep: "happy_talking",
  hurt: "serious_talking",
  noface: "noface",
};

export function getTalkingVariant(variantId: string): string {
  return TALKING_MAP[variantId] || variantId;
}

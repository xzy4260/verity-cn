export interface VerityVariant {
  id: string;
  label: string;
  hasTalking: boolean;
}

export const VARIANTS: VerityVariant[] = [
  { id: "happy", label: "开心", hasTalking: true },
  { id: "neutral", label: "平静", hasTalking: true },
  { id: "evil", label: "邪恶", hasTalking: true },
  { id: "crazy", label: "疯狂", hasTalking: true },
  { id: "serious_1", label: "严肃", hasTalking: true },
  { id: "hurt", label: "受伤", hasTalking: false },
  { id: "noface", label: "无面", hasTalking: false },
  { id: "happy_sleep", label: "困倦", hasTalking: false },
  { id: "smiling_evil", label: "狞笑", hasTalking: false },
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

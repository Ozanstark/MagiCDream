export type TextModelType = {
  id: string;
  name: string;
  description?: string;
};

export const AVAILABLE_TEXT_MODELS: TextModelType[] = [
  {
    id: "mistralai/Mistral-7B-Instruct-v0.1",
    name: "Mistral-7B-Instruct",
    description: "Advanced language model for text generation"
  }
];
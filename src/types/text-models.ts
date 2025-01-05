export type TextModelType = {
  id: string;
  name: string;
  description?: string;
};

export const AVAILABLE_TEXT_MODELS: TextModelType[] = [
  {
    id: "mistralai/Mistral-Nemo-Instruct-2407",
    name: "Mistral-Nemo-Instruct-2407",
    description: "Advanced language model for text generation"
  }
];
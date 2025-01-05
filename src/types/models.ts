export type ModelType = {
  id: string;
  name: string;
  apiUrl: string;
  description?: string;
};

export const AVAILABLE_MODELS: ModelType[] = [
  {
    id: "larrys-cake",
    name: "Realistic Style",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    description: "Censored realistic style model"
  },
  {
    id: "berrys-taylor",
    name: "Realistic Style 2",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    description: "Uncensored realistic style model"
  },
  {
    id: "harrys-torrance",
    name: "Realistic Style 3",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    description: "Uncensored realistic style model"
  },
  {
    id: "townley-hawnley",
    name: "Realistic Style 4",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    description: "Censored realistic style model"
  }
];
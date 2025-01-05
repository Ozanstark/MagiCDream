export interface ModelType {
  id: string;
  name: string;
  description?: string;
  apiUrl: string;
}

export const AVAILABLE_MODELS: ModelType[] = [
  {
    id: "stabilityai/stable-diffusion-2-1",
    name: "Stable Diffusion 2.1",
    description: "Stable Diffusion 2.1 base model",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1"
  },
  {
    id: "runwayml/stable-diffusion-v1-5",
    name: "Stable Diffusion 1.5",
    description: "Stable Diffusion 1.5 base model",
    apiUrl: "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
  },
  {
    id: "prompthero/openjourney",
    name: "Openjourney",
    description: "Midjourney v4 style model",
    apiUrl: "https://api-inference.huggingface.co/models/prompthero/openjourney"
  }
];
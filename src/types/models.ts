export type ModelType = {
  name: string;
  apiUrl: string;
  description?: string;
};

export const AVAILABLE_MODELS: ModelType[] = [
  {
    name: "Larry's Cake Style",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    description: "Creative style model"
  },
  {
    name: "Berry's Taylor Style",
    apiUrl: "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    description: "Artistic style model"
  },
  {
    name: "Harry's Torrance Style",
    apiUrl: "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
    description: "Fantasy style model"
  },
  {
    name: "Townley's Hawnley Style",
    apiUrl: "https://api-inference.huggingface.co/models/lustlyai/Flux_Lustly.ai_Uncensored_nsfw_v1",
    description: "Realistic style model"
  }
];
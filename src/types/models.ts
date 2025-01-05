export type ModelType = {
  name: string;
  apiUrl: string;
  description?: string;
};

export const AVAILABLE_MODELS: ModelType[] = [
  {
    name: "Larry's Cake Style",
    apiUrl: "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
    description: "Uncensored creative style model"
  },
  {
    name: "Berry's Taylor Style",
    apiUrl: "https://api-inference.huggingface.co/models/prashanth970/flux-lora-uncensored",
    description: "Uncensored artistic style model"
  },
  {
    name: "Harry's Torrance Style",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    description: "Uncensored fantasy style model"
  },
  {
    name: "Townley Hawnley Style",
    apiUrl: "https://api-inference.huggingface.co/models/lustlyai/Flux_Lustly.ai_Uncensored_nsfw_v1",
    description: "Uncensored realistic style model"
  }
];
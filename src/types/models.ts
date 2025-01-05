export type ModelType = {
  name: string;
  apiUrl: string;
  description?: string;
};

export const AVAILABLE_MODELS: ModelType[] = [
  {
    name: "Larry's Cake Style (Uncensored)",
    apiUrl: "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
    description: "Uncensored creative style model"
  },
  {
    name: "Realistic Style",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    description: "Photorealistic images style model"
  },
  {
    name: "Berry's Taylor Style (Uncensored)",
    apiUrl: "https://api-inference.huggingface.co/models/prashanth970/flux-lora-uncensored",
    description: "Uncensored artistic style model"
  },
  {
    name: "Harry's Torrance Style (Uncensored)",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    description: "Uncensored artistic style model"
  }
];
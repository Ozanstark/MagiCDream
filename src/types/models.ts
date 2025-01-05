export type ModelType = {
  name: string;
  apiUrl: string;
  description?: string;
};

export const AVAILABLE_MODELS: ModelType[] = [
  {
    name: "Larry's Cake Style (Uncensored)",
    apiUrl: "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
    description: "Uncensored creative style"
  },
  {
    name: "Realistic Style",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    description: "Photorealistic images"
  },
  {
    name: "Anime Style",
    apiUrl: "https://api-inference.huggingface.co/models/Lykon/AAM_XL_AnimeMix",
    description: "Anime and manga style"
  }
];
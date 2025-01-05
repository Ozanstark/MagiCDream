export interface ModelType {
  id: string;
  name: string;
  description?: string;
  apiUrl: string;
}

export const AVAILABLE_MODELS: ModelType[] = [
  {
    id: "sd-turbo",
    name: "Stable Diffusion Turbo",
    description: "Fast image generation",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/sd-turbo",
  },
  {
    id: "sdxl",
    name: "Stable Diffusion XL",
    description: "High quality image generation",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
  },
  {
    id: "anything",
    name: "Anything V5",
    description: "Anime style images",
    apiUrl: "https://api-inference.huggingface.co/models/stablediffusionapi/anything-v5",
  },
  {
    id: "realistic",
    name: "Realistic Vision V5.1",
    description: "Photorealistic images",
    apiUrl: "https://api-inference.huggingface.co/models/stablediffusionapi/realistic-vision-v51",
  },
];
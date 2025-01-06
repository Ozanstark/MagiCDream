export type ModelType = {
  id: string;
  name: string;
  apiUrl: string;
  description?: string;
};

export const AVAILABLE_MODELS: ModelType[] = [
  {
    id: "larrys-cake",
    name: "FLUX.1-Dev",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    description: "Censored realistic style model"
  },
  {
    id: "berrys-taylor",
    name: "Stable-Diffusion-3.5-Large",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    description: "Uncensored realistic style model"
  },
  {
    id: "harrys-torrance",
    name: "FLUX.1-Schnell",
    apiUrl: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    description: "Uncensored realistic style model"
  },
  {
    id: "townley-hawnley",
    name: "Stable-Diffusion-XL-Base-1.0",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    description: "Censored realistic style model"
  },
  {
    id: "realistic-five",
    name: "Stable-Diffusion-3.5-Large-Turbo",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large-turbo",
    description: "Uncensored realistic style model"
  },
  {
    id: "realistic-six",
    name: "FLUX-LoRA-Uncensored",
    apiUrl: "https://api-inference.huggingface.co/models/prashanth970/flux-lora-uncensored",
    description: "Uncensored realistic style model"
  },
  {
    id: "realistic-seven",
    name: "FLUX-Midjourney-Mix2-LoRA",
    apiUrl: "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Midjourney-Mix2-LoRA",
    description: "Uncensored realistic style model"
  },
  {
    id: "stable-diffusion-v1-5",
    name: "Stable Diffusion v1.5",
    apiUrl: "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    description: "Classic Stable Diffusion model, good for general purpose image generation"
  },
  {
    id: "stable-diffusion-v1-4",
    name: "Stable Diffusion v1.4",
    apiUrl: "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
    description: "Classic Stable Diffusion model, predecessor to v1.5"
  }
];
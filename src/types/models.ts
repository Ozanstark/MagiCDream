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
    name: "Tiny 1.0",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    description: "Censored realistic style model"
  },
  {
    id: "realistic-six",
    name: "Flux-LORA-Uncensored",
    apiUrl: "https://api-inference.huggingface.co/models/prashanth970/flux-lora-uncensored",
    description: "Uncensored realistic style model"
  }
];
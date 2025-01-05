export interface ModelType {
  id: string;
  name: string;
  apiUrl: string;
  description?: string;
}

export const AVAILABLE_MODELS: ModelType[] = [
  {
    id: "realistic-one",
    name: "FLUX.1-Dev",
    apiUrl: "https://api-inference.huggingface.co/models/fluxuspompa/FLUX.1-Dev",
    description: "Realistic style model"
  },
  {
    id: "realistic-two",
    name: "Stable-Diffusion-3.5-Large",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    description: "Realistic style model"
  },
  {
    id: "realistic-three",
    name: "FLUX.1-Schnell",
    apiUrl: "https://api-inference.huggingface.co/models/fluxuspompa/FLUX.1-Schnell",
    description: "Realistic style model"
  },
  {
    id: "realistic-four",
    name: "Stable-Diffusion-XL-Base-1.0",
    apiUrl: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    description: "Realistic style model"
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
  }
];
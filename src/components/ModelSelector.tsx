import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_MODELS, ModelType } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2 } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  disabled?: boolean;
}

const ModelSelector = ({ selectedModel, onModelChange, disabled }: ModelSelectorProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        <h2 className="text-lg font-semibold">AI Model Seçin</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {AVAILABLE_MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => onModelChange(model)}
            disabled={disabled}
            className={`p-4 rounded-lg border transition-all duration-300 hover:border-primary/50 hover:shadow-lg ${
              selectedModel.id === model.id 
                ? 'border-primary bg-primary/10 shadow-lg' 
                : 'border-border/20 bg-card/50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wand2 className={`w-4 h-4 ${
                  selectedModel.id === model.id ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className="font-medium text-sm">{model.name}</span>
              </div>
              {selectedModel.id === model.id && (
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Seçili
                </Badge>
              )}
            </div>
            {model.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {model.description}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
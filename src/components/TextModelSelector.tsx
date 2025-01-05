import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_TEXT_MODELS, TextModelType } from "@/types/text-models";

interface TextModelSelectorProps {
  selectedModel: TextModelType;
  onModelChange: (model: TextModelType) => void;
  disabled?: boolean;
}

const TextModelSelector = ({ selectedModel, onModelChange, disabled }: TextModelSelectorProps) => {
  return (
    <div className="w-full space-y-2">
      <Select
        value={selectedModel.name}
        onValueChange={(value) => {
          const model = AVAILABLE_TEXT_MODELS.find((m) => m.name === value);
          if (model) onModelChange(model);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_TEXT_MODELS.map((model) => (
            <SelectItem key={model.name} value={model.name}>
              <div className="flex flex-col">
                <span>{model.name}</span>
                {model.description && (
                  <span className="text-xs text-muted-foreground">
                    {model.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TextModelSelector;
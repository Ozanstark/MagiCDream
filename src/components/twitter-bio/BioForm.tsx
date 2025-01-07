import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface BioFormProps {
  username: string;
  interests: string;
  tone: string;
  onUsernameChange: (value: string) => void;
  onInterestsChange: (value: string) => void;
  onToneChange: (value: string) => void;
}

const BioForm = ({
  username,
  interests,
  tone,
  onUsernameChange,
  onInterestsChange,
  onToneChange,
}: BioFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-lg font-semibold">Name/Username</label>
        <Input
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="@techexpert"
          className="input-premium"
        />
      </div>

      <div className="space-y-2">
        <label className="text-lg font-semibold">Interests/Expertise</label>
        <Textarea
          value={interests}
          onChange={(e) => onInterestsChange(e.target.value)}
          placeholder="Software engineering, AI, tech entrepreneurship"
          className="input-premium min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-lg font-semibold">Tone of voice</label>
        <Input
          value={tone}
          onChange={(e) => onToneChange(e.target.value)}
          placeholder="professional, friendly, tech-savvy"
          className="input-premium"
        />
      </div>
    </div>
  );
};

export default BioForm;
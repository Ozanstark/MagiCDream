import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface GeneratedBioProps {
  bio: string;
}

const GeneratedBio = ({ bio }: GeneratedBioProps) => {
  const { toast } = useToast();

  if (!bio) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bio);
    toast({
      title: "Copied!",
      description: "Bio copied to clipboard",
    });
  };

  return (
    <div className="mt-6 p-4 bg-card rounded-lg border border-primary/20">
      <h2 className="text-lg font-semibold mb-2">Generated Bio:</h2>
      <p className="whitespace-pre-wrap">{bio}</p>
      <Button
        onClick={handleCopy}
        variant="outline"
        className="mt-4"
      >
        Copy to Clipboard
      </Button>
    </div>
  );
};

export default GeneratedBio;
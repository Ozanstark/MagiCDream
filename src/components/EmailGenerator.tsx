import { useState } from "react";
import ComponentHeader from "./shared/ComponentHeader";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EmailGenerator = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { toast } = useToast();

  const handleGenerateEmail = async () => {
    if (!subject || !body) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and body to generate an email.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("generate-email", {
        body: { subject, body },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your email has been generated.",
      });
      setBody(data.email);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate email. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Perfect Your Emails"
        description="Craft professional and impactful emails effortlessly. From formal business communications to friendly messages, find the right tone every time."
      />
      
      <Textarea
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="min-h-[50px] bg-[#1a1b26] text-white border-gray-700 resize-none"
      />
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Email body"
        className="min-h-[200px] bg-[#1a1b26] text-white border-gray-700 resize-none"
      />
      <Button onClick={handleGenerateEmail} className="w-full">
        Generate Email
      </Button>
    </div>
  );
};

export default EmailGenerator;

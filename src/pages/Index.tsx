import { ModeSwitcher } from "@/components/ModeSwitcher";
import { AnnouncementsBanner } from "@/components/AnnouncementsBanner";

const Index = () => {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <AnnouncementsBanner />
      <ModeSwitcher />
    </div>
  );
};

export default Index;
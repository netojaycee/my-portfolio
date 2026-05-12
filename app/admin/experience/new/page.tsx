import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div className="space-y-10">
      <SectionHeader
        title="New Experience"
        subtitle="Add a new milestone to your professional career."
        className="mb-0"
      />
      
      <ExperienceForm />
    </div>
  );
}

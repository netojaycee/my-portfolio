import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-10">
      <SectionHeader
        title="New Project"
        subtitle="Create a new case study to showcase your engineering expertise."
        className="mb-0"
      />
      
      <ProjectForm />
    </div>
  );
}

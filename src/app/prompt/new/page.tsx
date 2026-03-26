import { Header } from "@/components/layout/Header";
import { PromptForm } from "@/components/prompt/PromptForm";

export default function NewPromptPage() {
  return (
    <div className="flex-1">
      <Header title="Create Prompt Template" />
      <main className="p-6">
        <PromptForm mode="create" />
      </main>
    </div>
  );
}

import { ClientPageLayout } from "@/components/ClientPageLayout";
import AgentGridLoader from "@/components/AgentGridLoader";

export default async function UuidPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return (
    <ClientPageLayout>
      {/* This div will ensure that AgentGridLoader and its content can expand to fill the space provided by ClientPageLayout's main area */}
      <div className="w-full h-full flex flex-col">
        <AgentGridLoader threadId={uuid} />
      </div>
    </ClientPageLayout>
  );
}

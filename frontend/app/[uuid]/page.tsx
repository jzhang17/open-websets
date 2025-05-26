import { ClientPageLayout } from "@/components/ClientPageLayout";
import AgentGridLoader from "@/components/AgentGridLoader";

// Enable static optimization for known UUID routes
export const dynamic = 'force-dynamic'; // Since UUID is dynamic
export const revalidate = 0; // No revalidation needed for dynamic routes

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

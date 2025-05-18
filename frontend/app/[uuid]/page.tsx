import { ClientPageLayout } from "@/components/ClientPageLayout";

export default async function UuidPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return (
    <ClientPageLayout uuid={uuid}>
      <div className="shadow-lg rounded-lg p-6 sm:p-10 max-w-md w-full bg-card text-card-foreground">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Item Details
        </h1>
        <div className="space-y-4 text-left">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              ID (UUID):
            </span>
            <code className="p-2 text-sm bg-muted text-muted-foreground rounded-md break-all">
              {uuid}
            </code>
          </div>
        </div>
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            This page displays the generated UUID. Further actions or
            navigation can be implemented here based on your application&apos;s
            logic.
          </p>
        </div>
      </div>
    </ClientPageLayout>
  );
} 
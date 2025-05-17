interface UuidPageProps {
  params: {
    uuid: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function UuidPage({ params, searchParams }: UuidPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { uuid } = resolvedParams;
  const query = resolvedSearchParams?.query;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-10 max-w-md w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Item Details
          </h1>
          <div className="space-y-4 text-left">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">ID (UUID):</span>
              <code className="p-2 text-sm bg-gray-100 text-gray-700 rounded-md break-all">
                {uuid}
              </code>
            </div>
            {query && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Search Query:</span>
                <code className="p-2 text-sm bg-gray-100 text-gray-700 rounded-md break-all">
                  {query}
                </code>
              </div>
            )}
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <p>
              This page displays the generated UUID and the submitted search query.
              Further actions or navigation can be implemented here based on your application&apos;s logic.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 
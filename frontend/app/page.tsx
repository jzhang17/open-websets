"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, BookOpen, Newspaper } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const newUuid = crypto.randomUUID();
    router.push(`/${newUuid}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="w-full">
        <AppHeader />
      </div>
      <div className="flex items-center justify-center flex-1 w-full px-4 -mt-40">
        <div className="text-center max-w-lg w-full">
          <h1 className="text-2xl font-bold tracking-tight">
            Find your (almost) perfect list
          </h1>

          <Tabs defaultValue="people" className="w-full mt-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="people">
                <Users />
                People
              </TabsTrigger>
              <TabsTrigger value="companies">
                <Building2 />
                Companies
              </TabsTrigger>
              <TabsTrigger value="research">
                <BookOpen />
                Papers
              </TabsTrigger>
              <TabsTrigger value="articles">
                <Newspaper />
                Articles
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col items-center space-y-4"
          >
            <Input
              name="query"
              placeholder="Describe what you're looking for..."
              className="w-full text-lg bg-background border-input"
              multiline={true}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

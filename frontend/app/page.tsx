import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, BookOpen, Newspaper } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { OptionsDrawer } from "@/components/OptionsDrawer";

export default function Home() {

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

          <div className="mt-4 flex flex-col items-center space-y-4">
            <Input
              name="query"
              placeholder="Describe what you're looking for..."
              className="w-full text-lg bg-background border-input"
              multiline={true}
            />
          </div>
        </div>
      </div>
      
      <OptionsDrawer />
    </div>
  );
}

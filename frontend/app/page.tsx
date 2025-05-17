import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, BookOpen, Newspaper } from "lucide-react";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 -mt-20">
      <div className="text-center max-w-lg w-full">
        <h1 className="text-2xl font-bold tracking-tight">Find your (almost) perfect list</h1>

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
        
        <div className="mt-2">
          <Input 
            type="text" 
            placeholder="Describe what you're looking for..." 
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

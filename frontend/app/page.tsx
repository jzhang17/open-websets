import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <h1 className="text-3xl font-bold tracking-tight">Find your (almost) perfect list</h1>
        
        <Tabs defaultValue="people" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="research">Papers</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div>
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

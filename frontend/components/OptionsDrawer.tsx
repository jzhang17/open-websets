import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function OptionsDrawer() {
  return (
    <div className="pb-8 px-4 flex justify-center">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost">
            <Lightbulb className="w-4 h-4" />
            Click to see examples
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Examples</DrawerTitle>
            <DrawerDescription>
              See example searches and discover what you can find.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <p>Example content goes here...</p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
} 
"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb, Users, Database, FileText, Zap, Heart, Github, DollarSign, Rocket, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const features = [
  {
    title: "SF Design Engineers",
    description: "Full-stack engineers in SF with strong design skills from AI startups",
    icon: <Users />,
    path: "/46eda902-4ece-4a1d-9812-0b7563b0ccef",
  },
  {
    title: "Rust Vector DB Engineers", 
    description: "Software engineers specializing in Rust and vector databases in SF",
    icon: <Database />,
    path: "/86b17c9d-88df-4a94-a0d2-1b6cfc2b31f7",
  },
  {
    title: "Medical Research Papers",
    description: "Cell regeneration research co-authored by MDs and technologists",
    icon: <FileText />,
    path: "/dda40224-aabc-4513-a221-ed8f2f8dc271",
  },
  {
    title: "Data Center Infrastructure",
    description: "Large substation maintenance companies in Texas (200+ employees)",
    icon: <Zap />,
    path: "/55280544-8997-4cea-8a23-8d1a2d87a7f7",
  },
  {
    title: "Healthcare Facilities",
    description: "Nursing homes and assisted living in Southeast US (150+ beds)",
    icon: <Heart />,
    path: "/e25da2c5-c21f-4ea6-8675-37c55497e890",
  },
  {
    title: "LangChain Projects",
    description: "Open source GitHub projects using LangChain/LangGraph with web search",
    icon: <Github />,
    path: "/7f0ba40f-3733-4ab6-8d7a-09a1d7cb3d34",
  },
  {
    title: "Investment Banking",
    description: "Middle market investment bankers in SoCal (50-200M deals)",
    icon: <DollarSign />,
    path: "/3489d069-dc33-4c07-b490-3751fde92b90",
  },
  {
    title: "React Performance Articles",
    description: "Articles on React Server Components and first paint performance",
    icon: <Rocket />,
    path: "/edc553c7-dca7-4ff3-8490-9e369eb5ecd7",
  },
];

const Feature = ({
  title,
  description,
  icon,
  index,
  path,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  path: string;
}) => {
  return (
    <Link 
      href={path} 
      prefetch={true}
      className={cn(
        "flex flex-col py-6 sm:py-10 relative group/feature dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-200",
        // Large screens (4 columns): right border for all except last in row
        "lg:border-r",
        // Medium screens (2 columns): right border for even indices (0,2,4,6)
        "sm:max-lg:border-r sm:max-lg:[&:nth-child(2n)]:border-r-0",
        // Small screens (1 column): no right borders
        "max-sm:border-r-0",
        // Left borders
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        (index % 2 === 0) && "sm:max-lg:border-l dark:border-neutral-800",
        "max-sm:border-l dark:border-neutral-800",
        // Bottom borders
        index < 4 && "lg:border-b dark:border-neutral-800",
        index < 6 && "sm:max-lg:border-b dark:border-neutral-800",
        index < 7 && "max-sm:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-6 sm:px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-6 sm:px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-6 sm:px-10">
        {description}
      </p>
    </Link>
  );
};

export function OptionsDrawer() {
  const router = useRouter();

  // Prefetch all example routes when drawer opens or on hover
  const handlePrefetch = () => {
    features.forEach(feature => {
      router.prefetch(feature.path);
    });
  };

  return (
    <div className="pb-8 px-4 flex justify-center">
      <Drawer>
        <DrawerTrigger asChild>
          <Button 
            variant="ghost" 
            onClick={handlePrefetch} 
            onMouseEnter={handlePrefetch}
          >
            <Lightbulb className="w-4 h-4" />
            Click to see examples
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="flex-shrink-0 relative px-6 sm:px-10">
            <DrawerTitle>Search Examples</DrawerTitle>
            <DrawerDescription>
              Click any example to try it out and see what you can discover.
            </DrawerDescription>
            {/* X button for desktop (2+ columns) */}
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-6 sm:right-10 h-8 w-8 p-0 hidden sm:flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition-colors duration-200 group"
              >
                <X className="h-4 w-4 text-primary-foreground transition-colors duration-200" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative z-10 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
              ))}
            </div>
          </div>
          {/* Footer with close button - only show on mobile (1 column) */}
          <DrawerFooter className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden">
            <div className="flex flex-col gap-2 max-w-md mx-auto w-full px-4">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
} 
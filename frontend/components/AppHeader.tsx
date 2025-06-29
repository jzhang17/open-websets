import { GithubButton } from "@/components/ui/github-button";
import { ModeToggle } from "@/components/mode-toggle";
import { HomeLink } from "./HomeLink";
import React from "react";

interface AppHeaderProps {
  sidebarToggle?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ sidebarToggle }) => {
  return (
    <header className="flex items-center justify-between p-4 w-full h-full bg-background relative z-10">
      <HomeLink className="text-lg font-bold hover:text-primary transition-colors tracking-tight font-geist">
        Open Websets
      </HomeLink>
      <div className="flex items-center">
        <GithubButton />
        <ModeToggle />
        {sidebarToggle && <div className="ml-2">{sidebarToggle}</div>}
      </div>
    </header>
  );
};

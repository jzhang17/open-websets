import { GithubButton } from '@/components/ui/github-button';
import { ModeToggle } from '@/components/mode-toggle';
import React from 'react';

interface AppHeaderProps {
  sidebarToggle?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ sidebarToggle }) => {
  return (
    <header className="flex items-center justify-end p-4 w-full h-full bg-background">
      <GithubButton />
      <ModeToggle />
      {sidebarToggle && <div className="ml-2">{sidebarToggle}</div>}
    </header>
  );
}; 
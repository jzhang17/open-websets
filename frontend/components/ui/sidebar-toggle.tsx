import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarToggleProps {
  isOpen: boolean;
  toggle: () => void;
  className?: string;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ isOpen, toggle, className }) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      className={className}
      onClick={toggle}
    >
      {isOpen ? (
        <PanelLeftClose className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <PanelLeftOpen className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}; 
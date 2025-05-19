import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GithubButtonProps {
  text?: string;
  href?: string;
}

export const GithubButton: React.FC<GithubButtonProps> = ({
  text,
  href = "https://github.com/jzhang17/open-websets",
}) => {
  return (
    <Button variant="secondary" size="icon" className="mr-2" asChild>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Github className="h-[1.2rem] w-[1.2rem]" />
        {text && <span className="sr-only">{text}</span>}
        {!text && <span className="sr-only">GitHub Repository</span>}
      </a>
    </Button>
  );
};

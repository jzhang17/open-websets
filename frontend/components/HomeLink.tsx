"use client";
import Link from "next/link";
import { useAgentRunCtx } from "@/app/providers/agent-run-provider";
import React from "react";

interface HomeLinkProps {
  className?: string;
  children: React.ReactNode;
}

export const HomeLink: React.FC<HomeLinkProps> = ({ className, children }) => {
  const { setThreadId } = useAgentRunCtx();
  const handleClick = () => {
    setThreadId(null);
  };
  return (
    <Link href="/" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

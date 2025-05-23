import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Database, Sparkles } from "lucide-react";

export function AgentGridLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            <Brain className="h-5 w-5 animate-pulse text-primary" />
            Agents at Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-sm text-muted-foreground">
            Searching the web and extracting entity data...
          </div>
          
          {/* Single agent activity indicator */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
              {/* Inner pulsing core */}
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
              {/* Floating dots */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-0 -left-2 w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -bottom-2 left-2 w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.7s' }}></div>
            </div>
          </div>

          {/* Processing steps with staggered animations */}
          <div className="space-y-3">
            {[
              { icon: Brain, text: "Analyzing web content", delay: "0s" },
              { icon: Sparkles, text: "Extracting entity data", delay: "0.8s" },
              { icon: Database, text: "Preparing results", delay: "1.6s" }
            ].map((step, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 opacity-0 animate-fadeInUp"
                style={{ 
                  animationDelay: step.delay,
                  animationFillMode: 'forwards'
                }}
              >
                <step.icon className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">{step.text}</span>
                <div className="ml-auto flex gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-ping"></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Grid skeleton preview with wave animation */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Database className="h-3 w-3 animate-pulse" />
              Organizing the web data...
            </div>
            <div className="space-y-2">
              {[8, 6, 6, 6].map((height, index) => (
                <Skeleton 
                  key={index}
                  className={`h-${height} animate-shimmer`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    width: index === 0 ? '100%' : index === 2 ? '85%' : index === 3 ? '75%' : '100%'
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 
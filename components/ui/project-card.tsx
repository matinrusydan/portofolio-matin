import React from 'react';
import { Badge } from './badge';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  image?: string;
  link?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tech,
  image,
  link,
}) => {
  return (
    <div className="bg-background/95 backdrop-blur-md text-foreground rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-primary/10 hover:border-primary/30 hover:shadow-primary/20 transition-all duration-500 h-full">
      {image && (
        <div className="w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tech.map((techItem, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              {techItem}
            </Badge>
          ))}
        </div>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium group"
          >
            View Project
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        )}
      </div>
    </div>
  );
};
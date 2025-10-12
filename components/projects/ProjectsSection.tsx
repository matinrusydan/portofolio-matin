'use client';

import ScrollStack, { ScrollStackItem } from '../ScrollStack';
import { projects } from './project-data';

const ProjectsSection = () => {
  return (
    <section className="relative bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">My Projects</h2>
        <ScrollStack useWindowScroll={true} className="w-full" onStackComplete={() => {}}>
          {projects.map((project) => (
            <ScrollStackItem
              key={project.id}
              itemClassName="bg-white text-black shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-2xl font-semibold mb-4">{project.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.link && (
                    <a
                      href={project.link}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
};

export default ProjectsSection;
import { cn } from "@/lib/cn";
import { projects } from "@/lib/constants";
import ProjectCard from "./ProjectCard";

interface FeaturedProjectsProps {
  className?: string;
}

const FeaturedProjects = ({ className }: FeaturedProjectsProps) => {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className={cn(
        "px-6 md:px-12 lg:px-[108px] py-16 lg:py-20",
        className
      )}
    >
      {/* Section Header */}
      <div className="mb-12 lg:mb-[74px] max-w-[600px]">
        <h2
          id="projects-heading"
          className="font-display text-[40px] md:text-[56px] lg:text-[76px] leading-none text-neutral-white mb-2"
        >
          Featured Projects
        </h2>
        <p className="font-body font-normal text-[16px] md:text-[18px] leading-[1.5] text-neutral-offwhite">
          Here are some of the selected projects that showcase my passion for
          software development.
        </p>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-16 lg:gap-[120px]">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;

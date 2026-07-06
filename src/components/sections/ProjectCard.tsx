import Image from "next/image";
import { cn } from "@/lib/cn";
import { TextLink } from "@/components/ui";
import type { Project } from "@/lib/constants";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  return (
    <article
      className={cn(
        "flex flex-col lg:flex-row gap-8 lg:gap-12 items-center",
        className
      )}
    >
      {/* Project Image */}
      <div className="relative w-full lg:w-[600px] aspect-square bg-surface-dark rounded-[var(--radius-md)] overflow-hidden shrink-0">
        <div className="absolute inset-[80px_40px] lg:inset-[126px_57px]">
          <div className="relative w-full h-full rounded-[var(--radius-md)] border-2 border-neutral-black overflow-hidden">
            <Image
              src={project.imageSrc}
              alt={`Screenshot of ${project.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 486px"
            />
          </div>
        </div>

        {/* Tag */}
        {project.tag && (
          <span className="absolute top-4 left-4 bg-neutral-black rounded-[var(--radius-full)] px-4 py-2 font-body font-medium text-[14px] leading-[1.5] text-neutral-white">
            {project.tag}
          </span>
        )}
      </div>

      {/* Project Content */}
      <div className="flex flex-col gap-8 lg:gap-12 flex-1">
        {/* Information */}
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Title and Description */}
          <div className="flex flex-col gap-4">
            <h3 className="font-body font-medium text-[24px] md:text-[28px] lg:text-[32px] leading-[1.4] text-neutral-white">
              {project.title}
            </h3>
            <p className="font-body font-normal text-[16px] md:text-[18px] leading-[1.5] text-neutral-offwhite">
              {project.description}
            </p>
          </div>

          {/* Project Info */}
          <div className="flex flex-col gap-4">
            <h4 className="font-body font-semibold text-[16px] leading-[1.5] text-neutral-white uppercase">
              Project Info
            </h4>
            <div className="flex flex-col border-b border-neutral-dark-gray">
              <div className="flex items-center justify-between py-4 border-t border-neutral-dark-gray">
                <span className="font-body font-medium text-[16px] leading-[1.6] text-neutral-white">
                  Year
                </span>
                <span className="font-body font-medium text-[16px] leading-[1.6] text-neutral-offwhite">
                  {project.year}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-t border-neutral-dark-gray">
                <span className="font-body font-medium text-[16px] leading-[1.6] text-neutral-white">
                  Role
                </span>
                <span className="font-body font-medium text-[16px] leading-[1.6] text-neutral-offwhite">
                  {project.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-start gap-6">
          {project.liveUrl && (
            <TextLink href={project.liveUrl} variant="arrow">
              Live Demo
            </TextLink>
          )}
          {project.githubUrl && (
            <TextLink href={project.githubUrl} variant="github">
              See on Github
            </TextLink>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;

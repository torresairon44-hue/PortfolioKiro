import { cn } from "@/lib/cn";
import { features } from "@/lib/constants";

interface FeaturesMatrixProps {
  className?: string;
}

const FeaturesMatrix = ({ className }: FeaturesMatrixProps) => {
  return (
    <section
      className={cn(
        "px-6 md:px-12 lg:px-[108px] py-12 lg:py-16 bg-[radial-gradient(circle_at_center,#1A160E_0%,#0A0A0A_70%)]",
        className
      )}
      aria-label="Capabilities"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col gap-2">
            <h3 className="font-body font-bold text-[16px] text-neutral-white">
              {feature.title}
            </h3>
            <p className="font-body font-normal text-[13px] leading-[1.5] text-neutral-offwhite">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesMatrix;

"use client";

import { techStack } from "@/lib/constants";
import { Globe } from "@/components/ui/cobe-globe";

const techLocations: [number, number][] = [
  [37.7595, -122.4367],
  [40.7128, -74.006],
  [35.6762, 139.6503],
  [51.5074, -0.1278],
  [-33.8688, 151.2093],
  [-33.9249, 18.4241],
  [25.2048, 55.2708],
  [48.8566, 2.3522],
  [-23.5505, -46.6333],
  [52.52, 13.405],
  [19.076, 72.8777],
  [1.3521, 103.8198],
  [34.0522, -118.2437],
  [55.7558, 37.6173],
  [14.5995, 120.9842],
  [41.9028, 12.4964],
];

const markers = techStack.map((tech, index) => ({
  id: tech.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  location: techLocations[index % techLocations.length],
  label: tech,
}));

const arcs = [
  {
    id: "javascript-react",
    from: [37.7595, -122.4367] as [number, number],
    to: [35.6762, 139.6503] as [number, number],
    label: "JavaScript → Next.js",
  },
  {
    id: "react-typescript",
    from: [40.7128, -74.006] as [number, number],
    to: [51.5074, -0.1278] as [number, number],
    label: "React → TypeScript",
  },
];

export default function GlobeDemo() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-transparent p-8 overflow-hidden">
      <div className="w-full max-w-lg">
        <Globe
          markers={markers}
          arcs={arcs}
          markerColor={[0.62, 0.12, 0.15]}
          baseColor={[1, 1, 1]}
          arcColor={[0.62, 0.12, 0.15]}
          glowColor={[0.94, 0.93, 0.91]}
          dark={0}
          mapBrightness={10}
          markerSize={0.025}
          markerElevation={0.01}
        />
      </div>
    </div>
  );
}
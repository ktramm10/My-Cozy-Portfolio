"use client"

import { useEffect, useState} from 'react';
import { EventBus } from '@/game/EventBus';
import type { ProjectZone } from '@/util/projectZones';

export default function ProjectOverlay() {
    const [activeProject, setActiveProject] = useState<ProjectZone | null>(null);

    useEffect(() => {
        const handleZoneChange = (project: ProjectZone | null) => {
            setActiveProject(project);
        };
        EventBus.on("project-zone-changed", handleZoneChange);

        return () => {
            EventBus.off("project-zone-changed", handleZoneChange);
        };
    }, []);

    if (!activeProject) {
        return null;
    }

    return (
        <div className="project-overlay">
            <h2>{activeProject.name}</h2>

            <p>{activeProject.description}</p>

            <a
                href={activeProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                View on GitHub
            </a>
        </div>
    );
}
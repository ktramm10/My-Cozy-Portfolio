"use client"

import { useEffect, useState} from 'react';
import { EventBus } from '@/game/EventBus';
import type { ProjectZone } from '@/util/projectZones';

export default function ProjectOverlay() {
    const [activeProject, setActiveProject] = useState<ProjectZone | null>(null);
    const [activateOverlay, setActivateOverlay] = useState<boolean>(false);

    useEffect(() => {
        const handleZoneChange = (project: ProjectZone | null) => {
            if (project == null) {
                setActivateOverlay(false);
            }
            setActiveProject(project);
        };
        const displayProject = () => {
            setActivateOverlay(true);
        }
        EventBus.on("project-zone-changed", handleZoneChange);
        EventBus.on("project-interaction-activated", displayProject)

        return () => {
            EventBus.off("project-zone-changed", handleZoneChange);
            EventBus.off("project-interaction-activated", displayProject)
        };
    }, []);

    if (!activeProject) {
        return null;
    }

    if (!activateOverlay) {
        return (
            <div className="popup_interaction">
                <p className="popup_interaction_text">Press E to view project.</p>
            </div>

        );
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
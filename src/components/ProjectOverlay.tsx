"use client"

import { useEffect, useState} from 'react';
import { EventBus } from '@/game/EventBus';
import type { ProjectZone } from '@/util/projectZones';
import Image from 'next/image';

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
                <p className="popup_interaction_text">
                    Press <kbd className="key_cap">E</kbd> to view project
                </p>
            </div>

        );
    }

    return (
        <div className="project-overlay">

            <h2>{activeProject.name}</h2>

            <p>{activeProject.description}</p>

            <h3 className="overlay-section-title">Technology Stack</h3>
            <ul className="tech-stack">
                {activeProject.techStack.map((tech) => (
                    <li key={tech} className="tech-tag">{tech}</li>
                ))}
            </ul>

            <h3 className="overlay-section-title">Screenshots</h3>
            <div className="screenshot-gallery">
                {activeProject.imgURLS.map((item, index) =>  (
                    <figure key={item} className="screenshot-frame">
                        <Image
                            src={item}
                            alt={`${activeProject.name} screenshot ${index + 1}`}
                            width={1200}
                            height={800}
                            className="screenshot-image"
                        />
                    </figure>
                ))}
            </div>

            <a
                href={activeProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                View on GitHub
            </a>

            <p className="overlay-hint">Walk away to close</p>
        </div>
    );
}
export interface ProjectZone {
    id: string;
    name: string;
    description: string;
    githubUrl: string;
}

export interface ZoneArea {
    project: ProjectZone;
    gridX: number;  
    gridY: number;
    rows: number;
    cols: number;
}

export const projectZones: ProjectZone[] = [
    {
        id: "game-engine",
        name: "2D Game Engine",
        description: "Simple 2D game engine using SFML with integrated AI features for prototype small scale 2D games.",
        githubUrl: "https://github.com/ktramm10/Computer-Science-Captstone-Project",
    },
    {
        id: "course-website",
        name: "Course Website",
        description: "Full stack web app that I can use to distribute my BJJ System to my students and to others around the world.",
        githubUrl: "https://github.com/ktramm10/Project-Systematic-Skills",
    }
]
export interface ProjectZone {
    id: string;
    name: string;
    description: string;
    githubUrl: string;

    // The grid tile that triggers this project, matched against PlayerCharacter.getTileIndex().
    tileX: number;
    tileY: number;
}

export const projectZones: ProjectZone[] = [
    {
        id: "game-engine",
        name: "2D Game Engine",
        description: "Simple 2D game engine using SFML with integrated AI features for prototype small scale 2D games.",
        githubUrl: "https://github.com/ktramm10/Computer-Science-Captstone-Project",
        tileX: 0,
        tileY: 0,
    },
    {
        id: "course-website",
        name: "Course Website",
        description: "Full stack web app that I can use to distribute my BJJ System to my students and to others around the world.",
        githubUrl: "https://github.com/ktramm10/Project-Systematic-Skills",
        tileX: 9,
        tileY: 9,
    }
]
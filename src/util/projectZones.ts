export interface ProjectZone {
    id: string;
    name: string;
    description: string;
    techStack: string[];
    imgURLS: string[];
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
        techStack: [
            "C++",
            "SFML",
            "Composition (ECS)",
            "Practical Mathematics (Vectors, Derivative Calculus, Trigonometry)",
            "Object Persistence (JSON parsing for saving and loading)",
            "Logistic Regression Machine Learning",
        ],
        description: "Simple 2D game engine using SFML with integrated AI features for prototype small scale 2D games.",
        imgURLS: ['/assets/project_screenshots/2d-game-engine-screenshot-1.png', '/assets/project_screenshots/2d-game-engine-screenshot-2.png'],
        githubUrl: "https://github.com/ktramm10/Computer-Science-Captstone-Project",
    },
    {
        id: "course-website",
        name: "Course Website",
        description: "Full stack web app that I can use to distribute my BJJ System to my students and to others around the world.",
        techStack: [
            "React",
            "Next.js",
            "Stripe Integration",
            "Server Side Secure Authorization",
            "Password Hashing and Storage (argon2)",
            "TypeScript + JavaScript",
        ],
        imgURLS: ['/assets/project_screenshots/course-website-screenshot-1.png', '/assets/project_screenshots/course-website-screenshot-2.png'],
        githubUrl: "https://github.com/ktramm10/Project-Systematic-Skills",
    }
]
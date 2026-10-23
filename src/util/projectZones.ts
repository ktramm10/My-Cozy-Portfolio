import { getPixelPositionOfTile } from "./IsometricUtils";
import { TILE_HEIGHT, TILE_WIDTH } from "./Constants";

export interface ProjectZone {
    id: string;
    name: string;
    description: string;
    githubUrl: string;

    x: number;
    y: number;
    width: number;
    height: number;
}

export const projectZones: ProjectZone[] = [
    {
        id: "game-engine",
        name: "2D Game Engine",
        description: "Simple 2D game engine using SFML with integrated AI features for prototype small scale 2D games.",
        githubUrl: "https://github.com/ktramm10/Computer-Science-Captstone-Project",
        x: getPixelPositionOfTile(0,0).x,
        y: getPixelPositionOfTile(0,0).y,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
    },
    {
        id: "course-website",
        name: "Course Website",
        description: "Full stack web app that I can use to distribute my BJJ System to my students and to others around the world.",
        githubUrl: "https://github.com/ktramm10/Project-Systematic-Skills",
        x: getPixelPositionOfTile(9, 9).x,
        y: getPixelPositionOfTile(9, 9).y,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
    }
]
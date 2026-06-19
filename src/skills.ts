export type Skill = 
    | "javascript"
    | "typescript"
    | "c"
    | "cpp"
    | "csharp"
    | "lua"
    | "python"
    | "go"
    | "linux"

export const skillLabels: Record<Skill, string> = {
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "c": "C",
    "cpp": "C++",
    "csharp": "C#",
    "lua": "Lua",
    "python": "Python",
    "go": "Go",
    "linux": "Linux"
} as const;
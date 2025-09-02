import { TaskPriority, TaskCategory } from "./enums/tasksEnums";

declare global {
  // Extend the built-in CreepMemory interface
  interface CreepMemory {
    role?: "harvester" | "upgrader" | "builder" | "mover"; // Role of the creep
    targetId?: string; // ID of the target (e.g., source or structure)
    working?: boolean; // Whether the creep is currently working (e.g., harvesting or upgrading)
    building?: boolean; // Whether the creep is currently building
  }

  interface Memory {
    buildTasks: Task[]
  }



  interface Task {
    id: string;
    type: TaskCategory;
    targetId: Id<any>;
    structureType?: any;
    position?: any;
    assignedCreepNames?: string[];
    tickCreated: number;
    priority: TaskPriority;
  }

}
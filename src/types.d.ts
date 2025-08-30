// Extend the built-in CreepMemory interface
interface CreepMemory {
  role?: "harvester" | "upgrader" | "builder"; // Role of the creep
  targetId?: string; // ID of the target (e.g., source or structure)
  working?: boolean; // Whether the creep is currently working (e.g., harvesting or upgrading)
  building?: boolean; // Whether the creep is currently building
}

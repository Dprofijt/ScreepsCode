import { MAXHEALTHWALLSANDRAMPARTS } from "../config";
import { TaskCategory, TaskPriority } from "../enums/tasksEnums";

export function createTasks() {
  //because i only have 1 room
  var room = Game.rooms["W46S3"]
  if (!Memory.buildTasks) {
    Memory.buildTasks = []
  }

  var constructions = room.find(FIND_CONSTRUCTION_SITES);
  var halfDecayedStructures = room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.hits < (structure.hitsMax - (structure.hitsMax / 4))
  });

  constructions.forEach(construction => {
    var task: Task = createTask(TaskCategory.CONSTRUCTION, construction.id, TaskPriority.Medium)

    if (!Memory.buildTasks.some(t => t.targetId === task.targetId)) {
      console.log("adding task" + task.id + "with priority:" + task.priority)
      Memory.buildTasks.push(task)
    }
  });
  halfDecayedStructures.forEach(structure => {
    var quartpercentage = (structure.hitsMax / 4)
    let priority;
    if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) { //|| structure.structureType === STRUCTURE_RAMPART
      if (structure.hits <= MAXHEALTHWALLSANDRAMPARTS) {
        priority = TaskPriority.Medium
      } else {
        priority = TaskPriority.Low
      }
    } else if (structure.hits > structure.hitsMax - (quartpercentage * 2)) {
      priority = TaskPriority.Low

    } else if (structure.hits <= structure.hitsMax - (quartpercentage * 2) && structure.hits > structure.hitsMax - (quartpercentage * 3)) {
      priority = TaskPriority.Medium

    } else {
      priority = TaskPriority.High
    }
    var task: Task = createTask(TaskCategory.REPAIR, structure.id, priority, structure.structureType, structure.pos)

    const existing = Memory.buildTasks.find(t => t.targetId === task.targetId);
    if (!existing) {
      console.log("adding task" + task.id + "with priority:" + task.priority)
      Memory.buildTasks.push(task);
    } else if (priority != existing.priority) {
      // task exists but priority is not the same → change it
      existing.priority = priority;
    }
  });
  // hoog naar laag || laag naar hoog
  Memory.buildTasks.sort((a, b) => b.priority - a.priority || a.tickCreated - b.tickCreated)
}

export function rebalanceTasks() {
  if (!Memory.buildTasks) return;

  const tasks = Memory.buildTasks;

  const builders = Object.values(Game.creeps).filter(c => c.memory.role === "builder");

  for (const creep of builders) {
    const currentTask = Memory.buildTasks.find(task => task.assignedCreepNames.includes(creep.name))
    if (!currentTask) {
      let unassignedTask = tasks.find(task => !task.assignedCreepNames || task.assignedCreepNames.length === 0);
      // console.log("unassigned task")
      if (!unassignedTask) {
        unassignedTask = tasks
          .sort((a, b) => b.priority - a.priority)
          .find(task => task.assignedCreepNames && task.assignedCreepNames.length > 0)
      }

      if (unassignedTask) {
        unassignedTask.assignedCreepNames = unassignedTask.assignedCreepNames ?? [];
        if (!unassignedTask.assignedCreepNames.includes(creep.name)) {
          unassignedTask.assignedCreepNames.push(creep.name);
        }
        creep.memory.targetId = unassignedTask.targetId;
        console.log(`${creep.name} assigned to unassigned task ${unassignedTask.type} for structure ${unassignedTask.structureType} (priority: ${unassignedTask.priority})`);
        continue;
      }
    }

    const highestTask = tasks.find(task => {
      task.assignedCreepNames = task.assignedCreepNames ?? [];
      const assignedCount = task.assignedCreepNames.length;
      return task !== currentTask && (task.priority > (currentTask?.priority ?? 0) || assignedCount === 0);
    });

    if (!highestTask || !currentTask) continue;
    if (currentTask.priority >= TaskPriority.High) continue;
    if (!(highestTask.priority > currentTask.priority)) continue;

    // remove creep from old task
    currentTask.assignedCreepNames = currentTask.assignedCreepNames.filter(name => name !== creep.name);

    // assign to new task
    highestTask.assignedCreepNames.push(creep.name);
    creep.memory.targetId = highestTask.targetId;
    console.log("changing creep task from " + currentTask.structureType + "with priority:" + currentTask.priority + "to => " + highestTask.structureType + "with priority: " + highestTask.priority)

  }
}



function createTask(type: TaskCategory, targetId: Id<any>, priority: TaskPriority, structureType?: string, pos?: RoomPosition) {

  var task: Task = {
    id: `${Game.time}-${Math.random().toString(36).substr(2, 5)}`,
    type: type,
    targetId: targetId,
    structureType: structureType,
    position: pos,
    tickCreated: Game.time,
    assignedCreepNames: [],
    priority: priority
  }

  return task;
}



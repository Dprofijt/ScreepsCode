import { roleHarvester } from "./creeps/role.harvester";
import { roleUpgrader } from "./creeps/role.upgrader";
import { roleBuilder } from "./creeps/role.builder";
import { creepCreater } from "./creeps/createCreeps";
import { roleMover } from "./creeps/role.mover";
import { buildingTower } from "./buildings/buildingTower";
import { createTasks, rebalanceTasks } from "./utils/tasks";
import { TaskCategory, TaskPriority } from "./enums/tasksEnums";

export class Main {
    public loop() {

        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log("Clearing non-existing creep memory:", name);
                Memory.buildTasks?.forEach(task => {
                    if (task.assignedCreepNames?.includes(name)) {
                        task.assignedCreepNames = task.assignedCreepNames.filter(n => n !== name);
                    }
                });
            }
        }
        Memory.buildTasks = Memory.buildTasks?.filter(task => {
            switch (task.type) {
                case TaskCategory.REPAIR: {
                    const structure = Game.getObjectById<Structure>(task.targetId!);
                    return structure && structure.hits < (structure.hitsMax - structure.hitsMax / 10); // keep if still damaged
                }
                case TaskCategory.CONSTRUCTION: {
                    const site = Game.getObjectById<ConstructionSite>(task.targetId!);
                    return site !== null; // keep if still exists
                }
                default:
                    return true; // keep unknown task types
            }
        });


        createTasks()

        rebalanceTasks();

        creepCreater.run();
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role === "harvester") {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === "upgrader") {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role === "builder") {
                roleBuilder.run(creep);
            }
            if (creep.memory.role === "mover") {
                roleMover.run(creep);
            }
        }
        const room = Game.spawns["Spawn1"].room
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: (s): s is StructureTower => s.structureType === STRUCTURE_TOWER
        });
        for (const tower of towers) {
            buildingTower.run(tower)
        }
    }
}

const main = new Main()
export const loop = main.loop();

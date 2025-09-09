import { roleHarvester } from "./creeps/role.harvester";
import { roleUpgrader } from "./creeps/role.upgrader";
import { roleBuilder } from "./creeps/role.builder";
import { creepCreater } from "./creeps/createCreeps";
import { roleMover } from "./creeps/role.mover";
import { buildingTower } from "./buildings/buildingTower";
import { createTasks, rebalanceTasks } from "./utils/builderTasks";
import { TaskCategory, TaskPriority } from "./enums/tasksEnums";
import { RoleEnum } from "./enums/roleEnums";
import { roleCloseCombat } from "./creeps/role.closeCombat";
import { roleRangeCombat } from "./creeps/role.rangeCombat";
import { roleHealer } from "./creeps/role.healer";
import { roleScout } from "./creeps/role.scout";

export class Main {
    public loop() {

        clearMemory();
        // Memory.buildTasks.forEach(task => {
        //     console.log(task.id)
        //     task.assignedCreepNames?.forEach(name =>
        //         console.log(name)
        //     )
        // })

        //Builders:
        createTasks()
        rebalanceTasks();

        creepCreater.run();
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            // similar to all hail danny but then in 10 characters
            // creep.say("Hail Danny")
            switch (creep.memory.role) {
                case RoleEnum.HARVESTER:
                    roleHarvester.run(creep);
                    break;
                case RoleEnum.UPGRADER:
                    roleUpgrader.run(creep);
                    break;
                case RoleEnum.BUILDER:
                    roleBuilder.run(creep);
                    break;
                case RoleEnum.MOVER:
                    roleMover.run(creep);
                    break;
                case RoleEnum.CLOSECOMBAT:
                    roleCloseCombat.run(creep);
                    break;
                case RoleEnum.RANGECOMBAT:
                    roleRangeCombat.run(creep);
                    break;
                case RoleEnum.HEALER:
                    roleHealer.run(creep);
                    break;
                case RoleEnum.SCOUT:
                    roleScout.run(creep, "W46S4");
                    break;
                default:
                    console.log(creep.memory.role)
                    console.log(`Creep ${creep.name} had no or unknown role, set to harvester`);
            }

        }
        const room = Game.spawns["Spawn1"].room
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: (s): s is StructureTower => s.structureType === STRUCTURE_TOWER
        });
        for (const tower of towers) {
            buildingTower.run(tower)
        }
        if (Game.cpu.bucket >= 9500) {
            Game.cpu.generatePixel();
        }
    }
}

const main = new Main()
export const loop = main.loop();


function clearMemory() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log("Clearing non-existing creep memory:", name);
            Memory.buildTasks.forEach(task => {
                if (task.assignedCreepNames.includes(name)) {
                    task.assignedCreepNames = task.assignedCreepNames.filter(n => n !== name);
                }
            });
        }
    }
    Memory.buildTasks = Memory.buildTasks.filter(task => {
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
}
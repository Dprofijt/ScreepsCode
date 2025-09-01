import { roleHarvester } from "./creeps/role.harvester";
import { roleUpgrader } from "./creeps/role.upgrader";
import { roleBuilder } from "./creeps/role.builder";
import { creepCreater } from "./creeps/createCreeps";
import { roleMover } from "./creeps/role.mover";
import { buildingTower } from "./buildings/buildingTower";

export class Main {
    public loop() {

        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log("Clearing non-existing creep memory:", name);
            }
        }

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

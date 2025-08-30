import { roleHarvester } from "./role.harvester";
import { roleUpgrader } from "./role.upgrader";
import { roleBuilder } from "./role.builder";
import { creepCreater } from "./createCreeps";

export class Main {
    public loop(){

        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log("Clearing non-existing creep memory:", name);
            }
        }

        creepCreater.run();
        // console.log('Creeps: ' + Object.keys(Game.creeps).length);
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            // console.log('Creep ' + name + ' Role: ' + creep.memory.role);
            if (creep.memory.role === "harvester") {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === "upgrader") {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role === "builder") {
                roleBuilder.run(creep);
            }
        }
    } 
}

const main = new Main()
export const loop = main.loop();

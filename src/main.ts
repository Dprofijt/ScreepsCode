import { roleHarvester } from "./role.harvester";
import { roleUpgrader } from "./role.upgrader";
import { creepCreater } from "./createCreeps";

export class Main {
    public loop(){
        creepCreater.run();

        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role === "harvester") {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === "upgrader") {
                roleUpgrader.run(creep);
            }
        }
    } 
}

const main = new Main()
export const loop = main.loop();

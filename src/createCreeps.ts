
export const creepCreater = {
    run(){
        var harvesters = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === "harvester"
        );        
        var upgraders = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === "upgrader"
        );
        // console.log('Harvesters: ' + harvesters.length);

        if(harvesters.length < 1) {
            Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time, { memory: { role: 'harvester' } });
        }


        if(upgraders.length < 1) {
            Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + Game.time, { memory: { role: 'upgrader' } });
        }
    }
}

export const creepCreater = {
    run(){
        var harvesters = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === "harvester"
        );        
        var upgraders = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === "upgrader"
        );

        var builders = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === "builder"
        );
        // console.log('Harvesters: ' + harvesters.length);

        if(harvesters.length < 2) {
            var energySource1Harvesters = harvesters.filter(
                (creep) => creep.memory.targetId === 'source1'
            );
            var energySource2Harvesters = harvesters.filter(
                (creep) => creep.memory.targetId === 'source2'
            );
            
            if(energySource1Harvesters.length <= energySource2Harvesters.length) {
                Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time, { memory: { role: 'harvester', targetId: 'source1' } });
            } else {
                Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'Harvester' + Game.time, { memory: { role: 'harvester', targetId: 'source2' } });
            }

        }


        if(upgraders.length < 1) {
            Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + Game.time, { memory: { role: 'upgrader' } });
        }
        if(builders.length < 1) {
            Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], 'Builder' + Game.time, { memory: { role: 'builder' } });
        }
    }
}
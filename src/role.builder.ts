export const roleBuilder = {
    run(creep: Creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.memory.targetId = undefined; 
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            var halfDecayedStructures = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < (structure.hitsMax / 2)
            });
            if (halfDecayedStructures.length) {
                if (creep.repair(halfDecayedStructures[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(halfDecayedStructures[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // targets.sort((a, b) => a.hits - b.hits); // Prioritize most damaged structures
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            }
        }
        else {
            var spawn = Game.spawns["Spawn1"];
            if (spawn.store[RESOURCE_ENERGY] >= 300 && creep.memory.targetId !== 'source1') {
                creep.memory.targetId = 'spawn';
                if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                creep.memory.targetId = 'source1';
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};
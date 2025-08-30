export const roleHarvester = {
  run(creep: Creep) {

    


    if (creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES);
      const source1 = sources[0];
      const source2 = sources[1];

      if(creep.memory.targetId === 'source1') {
        if (sources.length > 0 && creep.harvest(source1) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source1, { visualizePathStyle: { stroke: '#ffaa00' }, swampCost: 10 } );
        }
      } else if(creep.memory.targetId === 'source2') {
        if (sources.length > 1 && creep.harvest(source2) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source2, { visualizePathStyle: { stroke: '#ffaa00' }, swampCost: 10 } );
        }
      }
    } else {
      if (creep.transfer(Game.spawns["Spawn1"], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.spawns["Spawn1"], { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
};

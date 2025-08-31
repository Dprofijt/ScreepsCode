export const roleHarvester = {
  run(creep: Creep) {


    //TODO add logic to empty first and then harvest
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say('⚡ transfer');
    }
    if (creep.memory.working == undefined) {
      creep.memory.working = false;
    }

    if (creep.memory.working == false) {
      const sources = creep.room.find(FIND_SOURCES);
      const source1 = sources[0];
      const source2 = sources[1];

      if (creep.memory.targetId === 'source1') {
        if (sources.length > 0 && creep.harvest(source1) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source1, { visualizePathStyle: { stroke: '#ffaa00' }, swampCost: 10 });
        }
      } else if (creep.memory.targetId === 'source2') {
        if (sources.length > 1 && creep.harvest(source2) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source2, { visualizePathStyle: { stroke: '#ffaa00' }, swampCost: 10 });
        }
      }
    } else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            structure.structureType === STRUCTURE_CONTAINER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if (creep.memory.targetId === 'source1') {
        if (creep.transfer(targets[1], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[1], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else if (creep.memory.targetId === 'source2') {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};

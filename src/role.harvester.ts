export const roleHarvester = {
  run(creep: Creep) {

    


    if (creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES);
      const source1 = sources[0];
      const source2 = sources[1];

      const resources = creep.room.find(FIND_DROPPED_RESOURCES);
        const tombstones = creep.room.find(FIND_TOMBSTONES);

      if (resources.length > 0) {
        const resource = resources[0]; // pick the first one
        if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
          creep.moveTo(resource, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      } else if (tombstones.length > 0) {
        const tombstone = tombstones[0];
        if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
      else {

        if(creep.memory.targetId === 'source1') {
          if (sources.length > 0 && creep.harvest(source1) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source1, { visualizePathStyle: { stroke: '#ffaa00' }, swampCost: 10 } );
          }
        } else if(creep.memory.targetId === 'source2') {
          if (sources.length > 1 && creep.harvest(source2) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source2, { visualizePathStyle: { stroke: '#ffaa00' }, swampCost: 10 } );
          }
        }
      }
    } else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_EXTENSION ||
                  structure.structureType === STRUCTURE_SPAWN) &&
                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });

      if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
};

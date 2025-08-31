export const roleUpgrader = {
  run(creep: Creep) {

    if (creep.memory.working === undefined) {
      creep.memory.working = false;
    }
    if (creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.working = false;
    } else if (creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
      creep.memory.targetId = undefined;
    }

    if (!creep.memory.working) {
      if (creep.memory.targetId === undefined) {
        const sources = creep.room.find(FIND_SOURCES);
        const spawn = Game.spawns["Spawn1"];
        var storages = creep.room.find(FIND_STRUCTURES, {
          filter: (structure): structure is StructureContainer => {
            return (
              structure.structureType === STRUCTURE_CONTAINER) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
          }
        });
        const storage = storages.sort(
          (a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY)
        )[0];
        creep.memory.targetId = storage.id;
      } else {
        const target = Game.getObjectById(creep.memory.targetId) as StructureContainer;


        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else {
          const sources = creep.room.find(FIND_SOURCES);

          if (sources.length > 0 && creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
          }
        }
      }
    } else if (creep.memory.working) {
      if (creep.upgradeController(creep.room.controller!) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller!, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
};

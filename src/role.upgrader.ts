export const roleUpgrader = {
  run(creep: Creep) {

    if(creep.memory.working === undefined) {
      creep.memory.working = false;
    }
    if(creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.working = false;
    } else if (creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
    }

    if (!creep.memory.working) {
      const sources = creep.room.find(FIND_SOURCES);
      const spawn = Game.spawns["Spawn1"];
      // if (sources.length > 0 && creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      //   creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      // }
      if(spawn.store[RESOURCE_ENERGY] > 300) {
        if (creep.withdraw(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      } else {
        if (sources.length > 0 && creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    } else if(creep.memory.working) {
      if (creep.upgradeController(creep.room.controller!) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller!, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
};

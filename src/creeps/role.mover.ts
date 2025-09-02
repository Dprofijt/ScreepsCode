import { clearTargetIdIfStorageIsEmpty, findFilledResourceStorage } from "../utils/findTarget";

export const roleMover = {
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
      if (creep.memory.targetId === undefined) {
        const sources = creep.room.find(FIND_SOURCES);

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
        } else {
          findFilledResourceStorage(creep)

        }
      } else {
        const target = Game.getObjectById(creep.memory.targetId) as StructureContainer;
        clearTargetIdIfStorageIsEmpty(creep);
        if (target) {
          if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
          }
          if (target.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.targetId = undefined;
          }
        } else {
          creep.memory.targetId = undefined;
        }
      }
    }
    else {

      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      })
      var target = creep.pos.findClosestByPath(targets);
      if (!target) return;
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
      }

    }


    // else {
    //   var targets = creep.room.find(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //       return (structure.structureType === STRUCTURE_EXTENSION ||
    //               structure.structureType === STRUCTURE_SPAWN) &&
    //              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    //     }
    //   });

    //   if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    //     creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
    //   }
    // }
  }
};

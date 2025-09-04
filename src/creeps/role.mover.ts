import { clearTargetIdIfStorageIsEmpty, findFilledResourceStorage } from "../utils/findTarget";

export const roleMover = {
  run(creep: Creep) {
    console.log("mover running")

    //TODO add logic to empty first and then harvest
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say('🔄 rearm');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say('⚡ moving');
    }
    if (creep.memory.working == undefined) {
      creep.memory.working = false;
    }

    if (creep.memory.working == false) {
      if (creep.memory.targetId === undefined) {

        const resources = creep.room.find(FIND_DROPPED_RESOURCES);
        const tombstones = creep.room.find(FIND_TOMBSTONES).filter(t => t.store[RESOURCE_ENERGY] > 0);

        if (resources.length > 0) {
          const resource = resources[0]; // pick the first one
          if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(resource, { visualizePathStyle: { stroke: '#f3fc7cff' } });
          }
          creep.memory.targetId = resource.id;
          creep.say("resource found")
        } else if (tombstones.length > 0) {
          const tombstone = tombstones[0];
          if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#f3fc7cff' } });
          }
          creep.memory.targetId = tombstone.id;
          creep.say("tombstone found")
        } else {
          findFilledResourceStorage(creep)
          creep.say("container found")

        }
      } else {
        console.log("has target id " + creep.memory.targetId)
        const target = Game.getObjectById(creep.memory.targetId);
        clearTargetIdIfStorageIsEmpty(creep);
        if (target instanceof StructureContainer) {
          if (target) {
            if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
              creep.moveTo(target, { visualizePathStyle: { stroke: '#f3fc7cff' } });
            }
            if (target.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
              creep.memory.targetId = undefined;
            }
          } else {
            creep.memory.targetId = undefined;
          }
        } else if (target instanceof Resource) {
          if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#f3fc7cff' } });
          }
        } else if (target instanceof Tombstone) {
          if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#f3fc7cff' } });
          }
        }
      }
    }
    else {
      transferEnergyToStructuresInRoom(creep);


    }
  }
};


function transferEnergyToStructuresInRoom(creep: Creep) {
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
    creep.moveTo(target, { visualizePathStyle: { stroke: '#52a9e2ff' } });
  }
}

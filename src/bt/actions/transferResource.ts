import { Status } from "../core";

export const setTargetIdForExtensionOrSpawnOrTower = (creep: Creep): Status => {
  const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: (s) =>
      (s.structureType === STRUCTURE_EXTENSION ||
        s.structureType === STRUCTURE_SPAWN ||
        s.structureType === STRUCTURE_TOWER) &&
      s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  });
  if (target) {
    creep.memory.targetId = target.id;
    return 'SUCCESS';
  }
  return 'FAILURE';
};

export const setTargetIdForStorage = (creep: Creep): Status => {
  const resourceType = getFirstCarriedResource(creep);
  if (!resourceType) return 'FAILURE';

  const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (s): s is StructureStorage =>
      s.structureType === STRUCTURE_STORAGE &&
      s.store.getFreeCapacity(resourceType) >= creep.store[resourceType]
  });

  if (target) {
    creep.memory.targetId = target.id;
    return 'SUCCESS';
  }
  return 'FAILURE';
};


export const transferToTarget = (creep: Creep): Status => {
  if (!creep.memory.targetId) return 'FAILURE';
  const target = Game.getObjectById(creep.memory.targetId) as AnyStoreStructure | null;
  if (!target) {
    creep.memory.targetId = undefined;
    return 'FAILURE';
  }

  const resourceType = getFirstCarriedResource(creep);
  if (!resourceType) {
    creep.memory.targetId = undefined;
    return 'SUCCESS'; // creep is empty
  }

  if (target.store.getFreeCapacity(resourceType) === 0) {
    creep.memory.targetId = undefined;
    return 'FAILURE';
  }

  const result = creep.transfer(target, resourceType);
  if (result === ERR_NOT_IN_RANGE) {
    creep.moveTo(target);
    return 'RUNNING';
  } else if (result === OK) {
    if (creep.store[resourceType] === 0) {
      creep.memory.targetId = undefined; // resource delivered
    }
    return 'SUCCESS';
  }

  return 'FAILURE';
};



function getFirstCarriedResource(creep: Creep): ResourceConstant | null {
  for (const resourceType in creep.store) {
    if (creep.store[resourceType as ResourceConstant]! > 0) {
      return resourceType as ResourceConstant;
    }
  }
  return null;
}

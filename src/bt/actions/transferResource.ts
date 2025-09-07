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

export const transferEnergyToTarget = (creep: Creep): Status => {
  if (!creep.memory.targetId) return 'FAILURE';
  const target = Game.getObjectById(creep.memory.targetId) as StructureExtension | StructureSpawn | StructureTower;
  if (!target) {
    creep.memory.targetId = undefined;
    return 'FAILURE';
  }
  if (creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.targetId = undefined;
    return 'SUCCESS'
  }
  if (target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
    creep.memory.targetId = undefined
    return 'FAILURE'
  }
  if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: '#52a9e2ff' } })
    return 'RUNNING'
  }
  return 'FAILURE';
}



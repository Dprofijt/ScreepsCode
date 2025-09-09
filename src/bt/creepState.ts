export interface CreepState {
  isEmpty: boolean;
  isFull: boolean;
  hasResourceId: boolean;
  hasTargetId: boolean;
  lowHP: boolean;
  isUnderAttack: boolean;
}

export function buildState(creep: Creep): CreepState {
  return {
    isEmpty: creep.store[RESOURCE_ENERGY] === 0,
    isFull: creep.store.getFreeCapacity() === 0,
    hasResourceId: creep.memory.resourceId !== undefined,
    hasTargetId: creep.memory.targetId !== undefined,
    lowHP: creep.hits <= creep.hitsMax * 0.25,
    isUnderAttack: creep.memory.lastHits !== undefined && creep.hits < creep.memory.lastHits,
  };
}
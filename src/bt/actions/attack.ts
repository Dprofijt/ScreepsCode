import { Status } from '../core';

/**
 * Attack the closest hostile creep.
 */
export const attackClosestEnemy = (creep: Creep): Status => {
  const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (!target) return 'FAILURE';

  if (creep.attack(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
  }

  return 'SUCCESS';
};

/**
 * Move toward the closest hostile creep (without attacking).
 */
export const chaseClosestEnemy = (creep: Creep): Status => {
  const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (!target) return 'FAILURE';

  creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
  return 'SUCCESS';
};

import { Status } from '../core';
import { moveTo } from './move';

/**
 * Heal self if injured
 */
export const healSelf = (creep: Creep): Status => {
  if (creep.hits < creep.hitsMax) {
    creep.heal(creep);
    return 'SUCCESS';
  }
  return 'FAILURE';
};

/**
 * Heal the closest injured ally
 */
export const healClosestAlly = (creep: Creep): Status => {
  const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: c => c.hits < c.hitsMax
  });
  if (!target) return 'FAILURE';

  if (creep.heal(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
  }

  return 'SUCCESS';
};

/**
 * Heal self if no enemies nearby
 */
export const selfHealIfSafe = (creep: Creep, safeRange = 3): Status => {
  const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (enemy && creep.pos.getRangeTo(enemy) <= safeRange) return 'FAILURE';
  return healSelf(creep);
};


/**
 * Heal a specific creep (could be self or ally)
 */
export const healTarget = (creep: Creep, target: Creep): Status => {
  if (!target || target.hits === target.hitsMax) return 'FAILURE';
  if (creep.heal(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
  }
  return 'SUCCESS';
};

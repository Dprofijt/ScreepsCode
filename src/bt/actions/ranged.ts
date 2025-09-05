import { Status } from '../core';

/**
 * Attack the closest enemy with rangedAttack.
 */
export const rangedAttackClosestEnemy = (creep: Creep): Status => {
  const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (!target) return 'FAILURE';

  if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
    return 'RUNNING';
  }

  return 'SUCCESS';
};

/**
 * Kite away from enemies if too close.
 * @param safeRange - distance to keep from enemies
 */
export const kite = (safeRange: number = 3) => (creep: Creep): Status => {
  const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
  if (hostiles.length === 0) return 'FAILURE';

  const closest = creep.pos.findClosestByRange(hostiles);
  if (!closest) return 'FAILURE';

  // If already safe, do nothing
  if (creep.pos.getRangeTo(closest) >= safeRange) {
    return 'FAILURE';
  }

  // Otherwise, flee using PathFinder
  const goals = hostiles.map(h => ({ pos: h.pos, range: safeRange }));
  const result = PathFinder.search(creep.pos, goals, {
    flee: true,
    plainCost: 2,
    swampCost: 5,
    maxRooms: 1
  });

  if (result.path.length > 0) {
    creep.move(creep.pos.getDirectionTo(result.path[0]));
    return 'RUNNING';
  }

  return 'FAILURE';
};

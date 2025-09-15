import { Status } from '../core';

/**
 * Move creep to a target position or flag.
 */
export const moveTo = (creep: Creep, target: RoomPosition | Flag): Status => {
  if (!target) return 'FAILURE';
  const code = creep.moveTo(target/*, { visualizePathStyle: { stroke: '#ffffff' } }*/);
  return code === ERR_NO_PATH ? 'FAILURE' : 'SUCCESS';
};

/**
 * Move to rally point (specific flag)
 */
export const moveToRally = (creep: Creep): Status => {
  const flag = Game.flags['RALLY'];
  if (!flag) return 'FAILURE';
  return moveTo(creep, flag);
};

export const moveToIdleSpot = (creep: Creep): Status => {
  const flag = Game.flags['IdleSpot'];
  if (!flag) return 'FAILURE';
  return moveTo(creep, flag);
}

/**
 * Retreat away from hostiles using PathFinder.flee.
 * @param creep The creep to retreat
 * @param range How far away from hostiles to try and stay
 */
export const retreat = (range: number) => (creep: Creep): Status => {
  const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
  if (hostiles.length === 0) return 'FAILURE';

  const goals = hostiles.map(c => ({ pos: c.pos, range }));
  const result = PathFinder.search(
    creep.pos,
    goals,
    {
      flee: true,
      plainCost: 2,
      swampCost: 5,
      maxRooms: 1
    }
  );

  if (result.path.length > 0) {
    creep.move(creep.pos.getDirectionTo(result.path[0]));
    return 'RUNNING';
  }

  return 'FAILURE';
};
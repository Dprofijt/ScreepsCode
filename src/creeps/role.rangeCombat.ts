export const roleRangeCombat = {
  run(creep: Creep) {
    const hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
    if (hostileCreeps.length > 0) {
      const target = creep.pos.findClosestByPath(hostileCreeps);
      if (target) {
        if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        }
        creep.say('🏹 attack');
      }
    } else {
      const flag = Game.flags.IdleSpot;
      if (flag) creep.moveTo(flag.pos, { visualizePathStyle: { stroke: '#ffffff' } });
      creep.say('🛡️ idle');
    }
  }
};
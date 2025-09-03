export const roleHealer = {
  run(creep: Creep) {
    const injuredCreeps = creep.room.find(FIND_MY_CREEPS, {
      filter: (c) => c.hits < c.hitsMax
    });
    if (injuredCreeps.length > 0) {
      const target = creep.pos.findClosestByPath(injuredCreeps);
      if (target) {
        if (creep.heal(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
        }
        creep.say('💉 heal')
      } else {
        const flag = Game.flags.IdleSpot;
        if (flag) creep.moveTo(flag.pos, { visualizePathStyle: { stroke: '#ffffff' } });
        creep.say('🛡️ idle');
      }
    } else {
      const flag = Game.flags.IdleSpot;
      if (flag) creep.moveTo(flag.pos, { visualizePathStyle: { stroke: '#ffffff' } });
      creep.say('🛡️ idle');
    }
  }
};
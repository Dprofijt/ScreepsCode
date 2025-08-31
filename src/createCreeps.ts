
export const creepCreater = {
  run() {
    var harvesters = Object.values(Game.creeps).filter(
      (creep) => creep.memory.role === "harvester"
    );
    var upgraders = Object.values(Game.creeps).filter(
      (creep) => creep.memory.role === "upgrader"
    );

    var builders = Object.values(Game.creeps).filter(
      (creep) => creep.memory.role === "builder"
    );

    var movers = Object.values(Game.creeps).filter(
      (creep) => creep.memory.role === "mover"
    );
    // console.log('Harvesters: ' + harvesters.length);

    if (harvesters.length < 4) {
      var energySource1Harvesters = harvesters.filter(
        (creep) => creep.memory.targetId === 'source1'
      );
      var energySource2Harvesters = harvesters.filter(
        (creep) => creep.memory.targetId === 'source2'
      );

      if (energySource1Harvesters.length <= (energySource2Harvesters.length - 1)) {
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], 'Harvester' + Game.time, { memory: { role: 'harvester', targetId: 'source1' } });
      } else {
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], 'Harvester' + Game.time, { memory: { role: 'harvester', targetId: 'source2' }, directions: [BOTTOM_RIGHT] });
      }

    }

    if (movers.length < 2) {
      {
        Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, CARRY, MOVE], 'Mover' + Game.time, { memory: { role: 'mover' } });
      }
    }
    if (movers.length >= 2 && harvesters.length >= 4) {
      if (upgraders.length < 1) {
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], 'Upgrader' + Game.time, { memory: { role: 'upgrader' } });
      }
      if (builders.length < 2) {
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], 'Builder' + Game.time, { memory: { role: 'builder' } });
      }
    }
  }
}
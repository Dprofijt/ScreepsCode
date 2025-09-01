import { MAXBUILDERS, MAXHARVESTERS, MAXMOVERS, MAXUPGRADERS } from "../config";

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

    if (harvesters.length < MAXHARVESTERS) {
      var energySource1Harvesters = harvesters.filter(
        (creep) => creep.memory.targetId === 'source1'
      );
      var energySource2Harvesters = harvesters.filter(
        (creep) => creep.memory.targetId === 'source2'
      );

      if (energySource1Harvesters.length < 3) {
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'Harvester' + Game.time, { memory: { role: 'harvester', targetId: 'source1' } });

      } else {
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'Harvester' + Game.time, { memory: { role: 'harvester', targetId: 'source2' }, directions: [BOTTOM_RIGHT] });
      }
    }

    if (movers.length < MAXMOVERS) {
      {
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'Mover' + Game.time, { memory: { role: 'mover' } });
      }
    }
    if (movers.length >= MAXMOVERS && harvesters.length >= MAXHARVESTERS) {
      if (upgraders.length < MAXUPGRADERS) {
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Upgrader' + Game.time, { memory: { role: 'upgrader' } });
      }
      if (builders.length < MAXBUILDERS) {
        Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Builder' + Game.time, { memory: { role: 'builder' } });
      }
    }
  }
}
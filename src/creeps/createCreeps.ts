import { MAXBUILDERS, MAXCLOSECOMBATS, MAXHARVESTERS, MAXHEALERS, MAXMOVERS, MAXRANGEDCOMBATS, MAXUPGRADERS } from "../config";
import { RoleEnum } from "../enums/roleEnums";

export const creepCreater = {
  run() {
    createDefaultCreeps();

    createCombatCreeps();
  }
}

function createCombatCreeps() {

  //if enemies are present, spawn combat creeps
  // This is a simple example; you might want to implement more complex logic
  const hostiles = Game.rooms['W46S3'].find(FIND_HOSTILE_CREEPS);
  if (hostiles.length === 0) {
    return;
  }

  var closeCombats = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === RoleEnum.CLOSECOMBAT
  );
  var rangeCombats = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === RoleEnum.RANGECOMBAT
  );
  var healers = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === RoleEnum.HEALER
  );
  if (closeCombats.length < MAXCLOSECOMBATS) {
    Game.spawns["Spawn1"].spawnCreep([TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], 'CloseCombat' + Game.time, { memory: { role: RoleEnum.CLOSECOMBAT } });
  } else if (rangeCombats.length < MAXRANGEDCOMBATS) {
    Game.spawns["Spawn1"].spawnCreep([TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE], 'RangeCombat' + Game.time, { memory: { role: RoleEnum.RANGECOMBAT } });
  } else if (healers.length < MAXHEALERS) {
    Game.spawns["Spawn1"].spawnCreep([TOUGH, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE], 'Healer' + Game.time, { memory: { role: RoleEnum.HEALER } });
  }
}

function createDefaultCreeps() {
  var harvesters = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === RoleEnum.HARVESTER
  );
  var upgraders = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === RoleEnum.UPGRADER
  );

  var builders = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === RoleEnum.BUILDER
  );

  var movers = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === RoleEnum.MOVER
  );

  if (harvesters.length < MAXHARVESTERS) {
    var energySource1Harvesters = harvesters.filter(
      (creep) => creep.memory.targetId === 'source1'
    );
    var energySource2Harvesters = harvesters.filter(
      (creep) => creep.memory.targetId === 'source2'
    );

    if (energySource1Harvesters.length < 1) {
      Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Harvester' + Game.time, { memory: { role: RoleEnum.HARVESTER, targetId: 'source1' } });

    } else {
      Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'Harvester' + Game.time, { memory: { role: RoleEnum.HARVESTER, targetId: 'source2' }, directions: [BOTTOM_RIGHT] });
    }
  }
  createBackupCreeps(harvesters, "harvester")

  if (movers.length < MAXMOVERS) {
    {
      Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Mover' + Game.time, { memory: { role: RoleEnum.MOVER } });
    }
  }
  createBackupCreeps(movers, "mover")
  if (movers.length >= MAXMOVERS && harvesters.length >= MAXHARVESTERS) {
    if (upgraders.length < MAXUPGRADERS) {
      Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Upgrader' + Game.time, { memory: { role: RoleEnum.UPGRADER } });
    }
    if (builders.length < MAXBUILDERS) {
      Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Builder' + Game.time, { memory: { role: RoleEnum.BUILDER } });
    }
  }
}

function createBackupCreeps(creeps: Creep[], role: string) {
  if (creeps.length === 0 && role === "harvester") {
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time, { memory: { role: RoleEnum.HARVESTER, targetId: 'source2' } });
  }
  if (creeps.length === 0 && role === "mover") {
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], 'Mover' + Game.time, { memory: { role: RoleEnum.MOVER } });
  }

}
import { MAXHEALTHWALLSANDRAMPARTS } from "../config";

export const buildingTower = {
  run(tower: StructureTower) {
    // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //   filter: (structure) => (structure.hits < structure.hitsMax - (structure.hitsMax / 3)
    //     && structure.structureType === STRUCTURE_RAMPART)
    // });
    // var closestDamagedStructures = tower.room.find(FIND_STRUCTURES, {
    //   filter: (structure) => (structure.hits < MAXHEALTHWALLSANDRAMPARTS
    //     && structure.structureType === STRUCTURE_RAMPART)
    // }).sort((a, b) => a.hits - b.hits);

    // // hoog naar laag || laag naar hoog
    // // Memory.buildTasks.sort((a, b) => b.priority - a.priority || a.tickCreated - b.tickCreated)
    // if (closestDamagedStructures) {

    //   tower.repair(closestDamagedStructures[0]);
    // }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }
}
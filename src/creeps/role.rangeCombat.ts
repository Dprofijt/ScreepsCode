import { rangedBT } from "../bt/trees/rangedBT";

export const roleRangeCombat = {
  run(creep: Creep) {

    rangedBT(creep);
    creep.memory.lastHits = creep.hits;
  }
};
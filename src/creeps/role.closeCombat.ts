import { meleeBT } from "../bt/trees/meleeBT";

export const roleCloseCombat = {
  run(creep: Creep) {
    meleeBT(creep);

    // Save current hits for next tick
    creep.memory.lastHits = creep.hits;
  }
};


// src/bt/core.ts
export type Status = 'SUCCESS' | 'FAILURE' | 'RUNNING';
export type Node = (creep: Creep) => Status;

/**
 * Sequence: run children in order. If one returns RUNNING or FAILURE,
 * return that; only return SUCCESS if all children returned SUCCESS.
 */
export const Sequence = (...nodes: Node[]): Node => {
  return (creep: Creep) => {
    for (const n of nodes) {
      const s = n(creep);
      if (s !== 'SUCCESS') return s;
    }
    return 'SUCCESS';
  };
};

/**
 * Selector: try children in order. Return the first child that isn't FAILURE.
 * If all children fail, return FAILURE.
 */
export const Selector = (...nodes: Node[]): Node => {
  return (creep: Creep) => {
    for (const n of nodes) {
      const s = n(creep);
      if (s !== 'FAILURE') return s;
    }
    return 'FAILURE';
  };
};

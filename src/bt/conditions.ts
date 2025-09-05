// src/bt/conditions.ts
import { Node } from './core';

export const isFull: Node = (creep) =>
  creep.store.getFreeCapacity() === 0 ? 'SUCCESS' : 'FAILURE';

export const isEmpty: Node = (creep) =>
  creep.store.getFreeCapacity() !== 0 ? 'SUCCESS' : 'FAILURE';

export const lowHP: Node = (creep) =>
  creep.hits <= creep.hitsMax * 0.25 ? 'SUCCESS' : 'FAILURE';

export const isUnderAttack: Node = (creep) =>
  creep.memory.lastHits !== undefined && creep.hits < creep.memory.lastHits
    ? 'SUCCESS'
    : 'FAILURE';

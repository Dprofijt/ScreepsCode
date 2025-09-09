// src/bt/conditions.ts
import { Node } from './core';
import { CreepState } from './creepState';

export const isFull: Node = (creep) =>
  creep.store.getFreeCapacity() === 0 ? 'SUCCESS' : 'FAILURE';

export const isNotFull: Node = (creep) =>
  creep.store.getFreeCapacity() > 0 ? 'SUCCESS' : 'FAILURE';

export const isEmpty: Node = (creep, state?: CreepState) =>
  (state ? state.isEmpty : creep.store[RESOURCE_ENERGY] === 0)
    ? "SUCCESS"
    : "FAILURE";

export const isNotEmpty: Node = (creep) =>
  creep.store[RESOURCE_ENERGY] > 0 ? 'SUCCESS' : 'FAILURE';

export const hasNoResourceId: Node = (creep) =>
  creep.memory.resourceId === undefined ? 'SUCCESS' : 'FAILURE';

export const hasResourceId: Node = (creep) =>
  creep.memory.resourceId !== undefined ? 'SUCCESS' : 'FAILURE';

export const hasTargetId: Node = (creep) =>
  creep.memory.targetId !== undefined ? 'SUCCESS' : 'FAILURE';

export const hasNoTargetId: Node = (creep) =>
  creep.memory.targetId === undefined ? 'SUCCESS' : 'FAILURE';

export const lowHP: Node = (creep) =>
  creep.hits <= creep.hitsMax * 0.25 ? 'SUCCESS' : 'FAILURE';

export const isUnderAttack: Node = (creep) =>
  creep.memory.lastHits !== undefined && creep.hits < creep.memory.lastHits
    ? 'SUCCESS'
    : 'FAILURE';

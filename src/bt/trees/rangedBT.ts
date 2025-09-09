import { Selector, Sequence, Node } from '../core';
import { rangedAttackClosestEnemy, kite } from '../actions/ranged';
import { moveToRally, retreat } from '../actions/move';
import { healSelf } from '../actions/heal';
import { lowHP, isUnderAttack } from '../conditions';

/**
 * Ranged Fighter BT
 * Priority:
 * 1. Retreat hard if under attack and low HP
 * 2. Kite away from enemies if too close
 * 3. Attack nearest enemy
 * 4. Heal self if hurt
 * 5. Move to rally point as fallback
 */
export const rangedBT: Node = Selector(
  Sequence(
    lowHP,
    isUnderAttack,
    retreat(6) // keep big distance if under pressure
  ),
  kite(3),                 // kite if enemies <3 range
  rangedAttackClosestEnemy, // attack
  healSelf,
  moveToRally
);

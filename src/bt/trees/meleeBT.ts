import { Selector, Sequence, Node } from '../core';
import { attackClosestEnemy, chaseClosestEnemy } from '../actions/attack';
import { healSelf } from '../actions/heal';
import { moveToRally, retreat } from '../actions/move';
import { lowHP, isUnderAttack } from '../conditions';

/**
 * Melee Fighter BT
 * Priority:
 * 1. Retreat if HP ≤ 25% and under attack
 * 2. Attack the closest enemy
 * 3. Chase an enemy if not in range
 * 4. Heal self if injured (if tough+heal mixed creep)
 * 5. Move to rally as fallback
 */
export const meleeBT: Node = Selector(
  Sequence(
    lowHP,
    isUnderAttack,
    retreat(5)
  ),
  attackClosestEnemy,
  chaseClosestEnemy,
  healSelf,
  moveToRally
);

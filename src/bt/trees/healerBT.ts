import { Selector, Sequence, Node } from '../core';
import { healClosestAlly, selfHealIfSafe, healSelf } from '../actions/heal';
import { moveToRally, retreat } from '../actions/move';
import { lowHP, isUnderAttack } from '../conditions';

export const healerBT: Node = Selector(
  Sequence(
    lowHP,
    isUnderAttack,
    retreat(5) // wrap extra parameter
  ),
  healClosestAlly,
  (creep) => selfHealIfSafe(creep, 3), // wrap extra parameter
  healSelf,
  moveToRally
);

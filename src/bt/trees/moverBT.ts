import { Selector, Sequence, Node } from '../core';
import { isEmpty, hasNoResourceId, hasResourceId, hasTargetId, isNotEmpty, hasNoTargetId, isNotFull } from '../conditions';
import { pickupEnergyFromContainer, pickupEnergyFromTombstone, pickupResource, setPickupResourceIdFromContainer, setPickupResourceIdFromDroppedResources, setPickupResourceIdFromTombstone } from '../actions/pickupResource';
import { setTargetIdForExtensionOrSpawnOrTower, setTargetIdForStorage, transferEnergyToTarget } from '../actions/transferResource';
import { consoleLogTest } from '../actions/debug';
import { clearResourceIdIfSet, clearTargetIdIfSet } from '../actions/utils';


export const moverBT: Node = Selector(
  //TODO  getting resources not working good
  Sequence(
    hasNoResourceId,
    isEmpty,
    Selector(
      // setPickupResourceIdFromDroppedResources,
      setPickupResourceIdFromTombstone,
      setPickupResourceIdFromContainer
    ),
    clearTargetIdIfSet,
    Selector(
      pickupResource,
      pickupEnergyFromTombstone,
      pickupEnergyFromContainer
    ),
  ),
  Sequence(
    hasResourceId,
    isEmpty,
    Selector(
      pickupResource,
      pickupEnergyFromTombstone,
      pickupEnergyFromContainer
    ),
  ),

  Sequence(
    isNotEmpty,
    hasNoTargetId,
    setTargetIdForExtensionOrSpawnOrTower,
    clearResourceIdIfSet,
    transferEnergyToTarget
  ),
  Sequence(
    isNotEmpty,
    hasTargetId,
    transferEnergyToTarget
  ),

  // Sequence(
  //   isNotEmpty,
  //   hasNoTargetId,
  //   hasNoResourceId,
  //   setTargetIdForStorage,
  //   transferEnergyToTarget
  // )

);


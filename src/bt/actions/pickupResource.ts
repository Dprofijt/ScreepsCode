import { Status } from "../core";

export const setPickupResourceIdFromDroppedResources = (creep: Creep): Status => {
  const droppedResources = creep.room.find(FIND_DROPPED_RESOURCES)

  if (droppedResources.length > 0) {
    const droppedResource = creep.pos.findClosestByPath(droppedResources) as Resource
    creep.memory.resourceId = droppedResource.id;
    return 'SUCCESS';
  }
  return 'FAILURE';
}

export const clearPickupResourceId = (creep: Creep): Status => {
  creep.memory.resourceId = undefined;
  return 'SUCCESS';
}

export const pickupResource = (creep: Creep): Status => {
  if (!creep.memory.resourceId) return 'FAILURE';
  const resource = Game.getObjectById(creep.memory.resourceId) as Resource;
  if (!resource) {
    creep.memory.resourceId = undefined;
    return 'FAILURE';
  }
  if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
    creep.moveTo(resource/*/*, { visualizePathStyle: { stroke: '#f3fc7cff' } } */);
    return 'RUNNING';
  }
  return 'FAILURE'
}

export const setPickupResourceIdFromTombstone = (creep: Creep): Status => {
  const tombstones = creep.room.find(FIND_TOMBSTONES, {
    filter: (s): s is Tombstone =>
      s.store[RESOURCE_ENERGY] > 0
  });

  if (tombstones.length > 0) {
    const tombstone = creep.pos.findClosestByPath(tombstones) as Tombstone
    creep.memory.resourceId = tombstones[0].id;
    return 'SUCCESS';
  }
  return 'FAILURE';
}

export const pickupEnergyFromTombstone = (creep: Creep): Status => {
  if (!creep.memory.resourceId) return 'FAILURE';
  const tombstone = Game.getObjectById(creep.memory.resourceId) as Tombstone;
  if (!tombstone || tombstone.store[RESOURCE_ENERGY] === 0) {
    creep.memory.resourceId = undefined;
    return 'FAILURE';
  }
  if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(tombstone/*/*, { visualizePathStyle: { stroke: '#f3fc7cff' } } */);
    return 'RUNNING';
  }
  if (tombstone.store[RESOURCE_ENERGY] === 0) {
    creep.memory.resourceId = undefined;
    return 'FAILURE'
  } else {
    creep.memory.resourceId = undefined;
    return 'FAILURE';
  }
}

export const setPickupResourceIdFromContainer = (creep: Creep): Status => {
  const containers = creep.room.find(FIND_STRUCTURES, {
    filter: (s): s is StructureContainer => (
      s.structureType === STRUCTURE_CONTAINER
      || s.structureType === STRUCTURE_STORAGE)
      && s.store[RESOURCE_ENERGY] > 0
  }).sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);
  if (containers.length > 0) {
    const closest = creep.pos.findClosestByPath(containers) as StructureContainer | StructureStorage;
    creep.memory.resourceId = closest.id;
    return 'SUCCESS';
  } else {
    const storage = creep.room.find(FIND_STRUCTURES, {
      filter: (s): s is StructureStorage => (
        s.structureType === STRUCTURE_STORAGE)
        && s.store[RESOURCE_ENERGY] > 0
    })[0]
    if (storage) {
      creep.memory.resourceId = storage.id;
      return 'SUCCESS';
    }
    return 'FAILURE'
  }
}

export const pickupEnergyFromContainer = (creep: Creep): Status => {
  if (!creep.memory.resourceId) return 'FAILURE';
  const container = Game.getObjectById(creep.memory.resourceId) as StructureContainer | StructureStorage;
  if (!container || container.store[RESOURCE_ENERGY] === 0) {
    creep.memory.resourceId = undefined;
    return 'FAILURE';
  }
  if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(container/*/*, { visualizePathStyle: { stroke: '#f3fc7cff' } } */);
    return 'RUNNING';
  }
  if (container.store[RESOURCE_ENERGY] === 0) {
    creep.memory.resourceId = undefined;
    return 'SUCCESS'
  }
  return 'FAILURE';
}


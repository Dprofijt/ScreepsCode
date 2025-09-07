export function findFilledResourceStorage(creep: Creep): void {
  var storages = creep.room.find(FIND_STRUCTURES, {
    filter: (structure): structure is StructureContainer => {
      return (
        structure.structureType === STRUCTURE_CONTAINER) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  if (storages.length > 0) {
    var target = undefined;
    if (creep.memory.role == "mover") {
      target = undefined;
    } else {
      target = creep.pos.findClosestByPath(storages, {
        filter: (structure): structure is StructureContainer => {
          return (
            structure.structureType === STRUCTURE_CONTAINER) &&
            structure.store[RESOURCE_ENERGY] >= 500;
        }
      }) as StructureContainer
    }
    if (target == undefined) {
      target = storages.sort(
        (a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY)
      )[0];
    }
    // pick the fullest container
    if (creep.memory.role == "builder") {
      creep.memory.resourceId = target.id;
    } else {
      creep.memory.targetId = target.id;
    }
    if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: '#f3fc7cff' } });
    }
  }
}

export function clearTargetIdIfStorageIsEmpty(creep: Creep) {
  var storage;
  if (creep.memory.role == "builder") {
    storage = Game.getObjectById<StructureContainer>(creep.memory.resourceId as Id<StructureContainer>);
  } else {
    storage = Game.getObjectById<StructureContainer>(creep.memory.targetId as Id<StructureContainer>);
  }
  if (storage instanceof ConstructionSite) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.targetId = undefined
      creep.memory.resourceId = undefined
    }
    return;
  }
  if (storage instanceof Resource) {
    creep.memory.targetId = undefined
    creep.memory.resourceId = undefined
    return;
  }
  if (storage instanceof Tombstone) {
    if (storage.store[RESOURCE_ENERGY] === 0) {
      creep.memory.targetId = undefined
      creep.memory.resourceId = undefined
    }
    return;
  }
  if (storage && storage?.store[RESOURCE_ENERGY] === 0) {
    if (creep.memory.role == "builder") {
      creep.memory.resourceId = undefined;
    } else {
      creep.memory.targetId = undefined;
    }
  }
  if (!storage) {
    if (creep.memory.role == "builder") {
      creep.memory.resourceId = undefined;
    } else {
      creep.memory.targetId = undefined;
    }
  }
}

export function findStorageToStoreResource(creep: Creep) {
  var targets = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType === STRUCTURE_CONTAINER
        || structure.structureType === STRUCTURE_STORAGE)
        && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store[RESOURCE_ENERGY];
    }
  });
  const target = creep.pos.findClosestByPath(targets) as StructureContainer

  if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: '#dcdf2fff' } });
  }
}
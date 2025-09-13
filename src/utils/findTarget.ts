export function findFilledResourceStorage(creep: Creep): void {
  var storages = creep.room.find(FIND_STRUCTURES, {
    filter: (structure): structure is (StructureContainer | StructureStorage) => {
      return (
        structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  if (storages.length > 0) {
    var target = undefined;
    if (creep.memory.role == "mover") {
      target = undefined;
    } else {
      target = creep.pos.findClosestByPath(storages, {
        filter: (structure): structure is (StructureContainer | StructureStorage) => {
          return (
            structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
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
      creep.moveTo(target/*/*, { visualizePathStyle: { stroke: '#f3fc7cff' } } */);
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
      if (creep.memory.role != "builder") {
        creep.memory.targetId = undefined
      } else {
        creep.memory.resourceId = undefined
      }
    }
    return;
  }
  if (storage instanceof Resource) {
    if (creep.memory.role != "builder") {
      creep.memory.targetId = undefined
    } else {
      creep.memory.resourceId = undefined
    }
    return;
  }
  if (storage instanceof Tombstone) {
    if (storage.store[RESOURCE_ENERGY] === 0) {
      if (creep.memory.role != "builder") {
        creep.memory.targetId = undefined
      } else {
        creep.memory.resourceId = undefined
      }
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
  for (const resourceType in creep.store) {
    if (creep.store[resourceType as ResourceConstant] > 0) {
      let targets: (StructureContainer | StructureStorage | StructureTerminal)[] = [];

      if (resourceType === RESOURCE_ENERGY) {
        // Energy only goes to Storage or Containers
        targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) =>
            (structure.structureType === STRUCTURE_CONTAINER ||
              structure.structureType === STRUCTURE_STORAGE) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }) as (StructureContainer | StructureStorage)[];
      } else {
        // Non-energy (minerals, compounds, etc.) can also go into Terminals
        targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) =>
            (structure.structureType === STRUCTURE_CONTAINER ||
              structure.structureType === STRUCTURE_STORAGE ||
              structure.structureType === STRUCTURE_TERMINAL) &&
            structure.store.getFreeCapacity(resourceType as ResourceConstant) > 0
        }) as (StructureContainer | StructureStorage | StructureTerminal)[];
      }
      if (targets.length > 0) {
        const target = creep.pos.findClosestByPath(targets) as StructureContainer | StructureStorage | StructureTerminal;
        if (creep.transfer(target, resourceType as ResourceConstant) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target/*, { visualizePathStyle: { stroke: '#dcdf2fff' } }*/);
        }
        return; // Only handle one resource type per tick
      }
    }
  }
}
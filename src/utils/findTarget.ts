export function findFilledResourceStorage(creep: Creep) {

  var storages = creep.room.find(FIND_STRUCTURES, {
    filter: (structure): structure is StructureContainer => {
      return (
        structure.structureType === STRUCTURE_CONTAINER) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 0;
    }
  });
  console.log(storages)
  if (storages.length > 0) {

    var target = creep.pos.findClosestByPath(storages, {
      filter: (structure): structure is StructureContainer => {
        return (
          structure.structureType === STRUCTURE_CONTAINER) &&
          structure.store[RESOURCE_ENERGY] >= 500;
      }
    }) as StructureContainer
    if (target == undefined) {
      target = storages.sort(
        (a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY)
      )[0];
    }
    creep.say("target" + target.id)
    // pick the fullest container

    creep.memory.targetId = target.id;

    if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  }
}

export function clearTargetIdIfStorageIsEmpty(creep: Creep) {
  const storage = Game.getObjectById<StructureContainer>(creep.memory.targetId as Id<StructureContainer>);
  if (storage instanceof ConstructionSite) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.targetId = undefined
    }
    return;
  }
  if (storage && storage.store[RESOURCE_ENERGY] === 0) {
    creep.memory.targetId = undefined
  }
}

export function findStorageToStoreResource(creep: Creep) {
  var targets = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType === STRUCTURE_CONTAINER) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  const target = creep.pos.findClosestByPath(targets) as StructureContainer

  if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
  }
}
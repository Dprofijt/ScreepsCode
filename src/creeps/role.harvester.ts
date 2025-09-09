import { findStorageToStoreResource } from "../utils/findTarget";

export const roleHarvester = {
  run(creep: Creep) {


    //TODO add logic to empty first and then harvest
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say('⚡ transfer');
    }
    if (creep.memory.working == undefined) {
      creep.memory.working = false;
    }

    if (creep.memory.working == false) {
      if (creep.memory.targetId === 'source1' || creep.memory.targetId === 'source2') {
        const sources = creep.room.find(FIND_SOURCES);
        const source1 = sources[0];
        const source2 = sources[1];

        if (creep.memory.targetId === 'source1') {
          if (sources.length > 0 && creep.harvest(source1) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source1/*, { visualizePathStyle: { stroke: '#f3fc7cff' }*/, { swampCost: 30, plainCost: 1 });
          }
        } else if (creep.memory.targetId === 'source2') {
          if (sources.length > 1 && creep.harvest(source2) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source2/*, { visualizePathStyle: { stroke: '#f3fc7cff' }*/, { swampCost: 30 });
          }
        }
      } else if (creep.memory.targetId === 'source3') {

        const neighborRoom = "W47S3"; // hardcoded neighbor room name
        const targetPos = new RoomPosition(25, 25, neighborRoom); // roughly center of the room

        if (creep.room.name !== neighborRoom) {
          // Move to center of neighbor room
          creep.moveTo(targetPos/*/*, { visualizePathStyle: { stroke: '#f3fc7cff' } } */);
        } else {
          // In neighbor room, harvest first source
          const neighborSources = creep.room.find(FIND_SOURCES);
          if (neighborSources.length > 0) {
            const source = neighborSources[0];
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
              creep.moveTo(source/*/*, { visualizePathStyle: { stroke: '#f3fc7cff' } } */);
            }
          }
        }
      }
    } else {
      if (creep.room.name !== 'W46S3') {
        const targetPos = new RoomPosition(25, 25, 'W46S3'); // roughly center of the room
        creep.moveTo(targetPos/*/*, { visualizePathStyle: { stroke: '#f3fc7cff' } } */);
      }
      findStorageToStoreResource(creep);
    }
  }
};


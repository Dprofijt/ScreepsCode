export const roleBuilder = {
	run(creep: Creep) {

		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			creep.memory.building = true;
			creep.memory.targetId = undefined;
			creep.say('🚧 build');
		}

		if (creep.memory.building) {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			var halfDecayedStructures = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => structure.hits < (structure.hitsMax / 2)
			});
			if (halfDecayedStructures.length) {
				if (creep.repair(halfDecayedStructures[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(halfDecayedStructures[0], { visualizePathStyle: { stroke: '#ffffff' } });
				}
			} else {
				// targets.sort((a, b) => a.hits - b.hits); // Prioritize most damaged structures
				if (targets.length) {
					if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
					}
				}
			}
		}
		else {
			if (creep.memory.targetId === undefined) {
				var storages = creep.room.find(FIND_STRUCTURES, {
					filter: (structure): structure is StructureContainer => {
						return (
							structure.structureType === STRUCTURE_CONTAINER) &&
							structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 0;
					}
				});
				if (storages.length > 0) {
					// pick the fullest container
					const storage = storages.sort(
						(a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY)
					)[0];
					creep.memory.targetId = storage.id;

					if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
						creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
					}
				}
			} else {
				const target = Game.getObjectById(creep.memory.targetId) as StructureContainer;

				if (target) {
					if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
						creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
					}
					if (target.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
						creep.memory.targetId = undefined;
					}
				} else {
					creep.memory.targetId = undefined;
				}
			}
		}
	}
};
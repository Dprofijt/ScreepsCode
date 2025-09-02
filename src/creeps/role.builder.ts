import { clearTargetIdIfStorageIsEmpty, findFilledResourceStorage } from "../utils/findTarget";

export const roleBuilder = {
	run(creep: Creep) {
		setStatus(creep)

		if (creep.memory.building) {

			if (!creep.memory.targetId) {
				const task = Memory.buildTasks?.find(task => !task.assignedCreepNames)

				if (!task) {
					creep.say("Build idle");
					return;
				}

				task.assignedCreepNames?.push(creep.name)
				creep.memory.targetId = task.targetId
			} else {
				if (creep.memory.targetId) {
					const target = Game.getObjectById<Structure | ConstructionSite>(creep.memory.targetId as Id<Structure | ConstructionSite>);

					if (target instanceof ConstructionSite) {
						if (creep.build(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
						}
						if (target.progress == target.progressTotal) {
							creep.memory.targetId = undefined;
						}
					} else if (target instanceof Structure) {
						if (creep.repair(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
						}
						if (target.hits == target.hitsMax) {
							creep.memory.targetId = undefined;
						}
					} else {
						creep.memory.targetId = undefined;
					}
				}
			}
		}
		else {
			if (creep.memory.targetId) {
				const target = Game.getObjectById(creep.memory.targetId) as StructureContainer;
				clearTargetIdIfStorageIsEmpty(creep);
				if (target) {
					if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
						creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
					}
				}
			} else {
				findFilledResourceStorage(creep);
			}
		}
	}
};

function setStatus(creep: Creep) {
	if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
		creep.memory.targetId = undefined;
		creep.memory.building = false;
		creep.say('🔄 rearm');
	}
	if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
		creep.memory.building = true;
		creep.memory.targetId = undefined;
		creep.say('🚧 build');
	}
}
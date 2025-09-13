import { MAXHEALTHWALLSANDRAMPARTS } from "../config";
import { TaskPriority } from "../enums/tasksEnums";
import { clearTargetIdIfStorageIsEmpty, findFilledResourceStorage } from "../utils/findTarget";

export const roleBuilder = {
	run(creep: Creep) {
		setStatus(creep)

		if (creep.memory.building) {

			if (!creep.memory.targetId) {
				creep.say("Build idle");
				const flag = Game.flags.IdleSpot;
				if (flag) creep.moveTo(flag.pos/*, { visualizePathStyle: { stroke: '#ffffffff' } }*/);
			} else {
				if (creep.memory.targetId) {
					const target = Game.getObjectById<Structure | ConstructionSite>(creep.memory.targetId as Id<Structure | ConstructionSite>);

					if (target instanceof ConstructionSite) {
						if (creep.build(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target/*, { visualizePathStyle: { stroke: '#ff8800ff' } }*/);
						}
						if (target.progress == target.progressTotal) {
							creep.memory.targetId = undefined;
						}
					} else if (target instanceof Structure) {
						if (creep.repair(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target/*, { visualizePathStyle: { stroke: '#ff8800ff' } }*/);
						}
						if (target.hits == target.hitsMax) {
							creep.memory.targetId = undefined;
						}
						// if (target.hits >= MAXHEALTHWALLSANDRAMPARTS) {
						// 	console.log("643we")
						// 	var test = Game.getObjectById(target.id) as Structure
						// 	if (test.structureType === STRUCTURE_RAMPART || STRUCTURE_WALL) {
						// 		console.log(test.structureType + test.pos)
						// 		creep.memory.targetId = undefined;
						// 		console.log("TEST3")
						// 		var task = Memory.buildTasks.find(task => task.targetId === test.id)
						// 		if (task) {
						// 			console.log("TEST")
						// 			task.priority = TaskPriority.Low
						// 			task.assignedCreepNames = task.assignedCreepNames.filter(name => name != creep.name)
						// 		}
						// 	}
						// }
					} else {
						console.log("TEST5")
						creep.memory.targetId = undefined;
					}
				}
			}
		}
		else {
			if (creep.memory.resourceId) {
				const target = Game.getObjectById(creep.memory.resourceId) as StructureContainer;
				clearTargetIdIfStorageIsEmpty(creep);
				if (target) {
					if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
						creep.moveTo(target/*/*, { visualizePathStyle: { stroke: '#f3fc7cff' } } */);
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
		creep.memory.resourceId = undefined;
		creep.memory.building = false;
		creep.say('🔄 rearm');
	}
	if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
		creep.memory.building = true;
		creep.memory.resourceId = undefined;
		creep.say('🚧 build');
	}
}
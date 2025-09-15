import { Status } from "../core"

export const clearTargetIdIfSet = (creep: Creep): Status => {
  if (creep.memory.targetId) {
    delete creep.memory.targetId
  }
  return 'SUCCESS'
}

export const clearResourceIdIfSet = (creep: Creep): Status => {
  if (creep.memory.resourceId) {
    delete creep.memory.resourceId
  }
  return 'SUCCESS'
}


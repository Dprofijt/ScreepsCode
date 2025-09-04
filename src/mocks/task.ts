export const TaskCategory = { CONSTRUCTION: 'construction', REPAIR: 'repair' };
export const TaskPriority = { Low: 1, Medium: 2, High: 3 };

export const createTask = jest.fn((category: string, targetId: string, priority: number, type?: string, pos?: RoomPosition) => ({
  id: `task-${Math.random()}`,
  category,
  targetId,
  priority,
  type,
  pos,
  tickCreated: global.Game.time,
}));

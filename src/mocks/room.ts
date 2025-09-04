
export function createMockRoom(containers: StructureContainer[]): Room {
  const room: Partial<Room> = {
    find: (type: FindConstant, opts?: any) => {
      if (type === FIND_STRUCTURES) {
        if (opts?.filter) {
          return containers.filter(opts.filter);
        }
        return containers;
      }
      return [];
    },
  };
  return room as Room;
}

export function createMockPosition(): RoomPosition {
  return {
    x: 10,
    y: 10,
    roomName: "W1N1",
    findClosestByPath: (targets: StructureContainer[], opts?: any) => {
      const filtered = opts?.filter ? targets.filter(opts.filter) : targets;
      return filtered[0]; // dumb closest
    },
  } as unknown as RoomPosition;
}

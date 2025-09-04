let nextId = 1;

export function createMockCreep(
  role: string,
  room: Room,
  pos: RoomPosition
): Creep {
  const id = `creep-${nextId++}`;
  return {
    id,
    name: id,
    memory: { role } as any,
    room,
    pos,
    withdraw: jest.fn().mockReturnValue(ERR_NOT_IN_RANGE),
    moveTo: jest.fn().mockReturnValue(OK),
  } as unknown as Creep;
}
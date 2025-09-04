let nextId = 1;

export function createMockConstruction(): ConstructionSite {
  const id = `construction-${nextId++}`;
  return {
    id,
    structureType: 'spawn',
    pos: { x: 0, y: 0 } as RoomPosition,
  } as unknown as ConstructionSite;
}

export function createMockStructure(hits: number, hitsMax: number, type = STRUCTURE_WALL): Structure {
  const id = `structure-${nextId++}`;
  return {
    id,
    hits,
    hitsMax,
    structureType: type,
    pos: { x: 0, y: 0 } as RoomPosition,
  } as unknown as Structure;
}

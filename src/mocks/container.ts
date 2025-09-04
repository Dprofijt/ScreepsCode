

let nextId = 1;

export function createMockContainer(energy: number, capacity: number): StructureContainer {
  const id = `container-${nextId++}`;
  return {
    id,
    structureType: STRUCTURE_CONTAINER,
    store: {
      [RESOURCE_ENERGY]: energy,
      getCapacity: () => capacity,
      getFreeCapacity: () => capacity - energy,
      getUsedCapacity: () => energy,
    } as unknown as StoreDefinition,
  } as unknown as StructureContainer;
}

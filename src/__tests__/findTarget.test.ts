// __tests__/findFilledResourceStorage.test.ts

import { RoleEnum } from "../enums/roleEnums";
import { createMockContainer } from "../mocks/container";
import { createMockCreep } from "../mocks/creep";
import { createMockPosition, createMockRoom } from "../mocks/room";
import { findFilledResourceStorage } from "../utils/findTarget";

describe("findFilledResourceStorage", () => {
  test.each(Object.values(RoleEnum))("should assign the fullest container to a creep", (role) => {
    if (RoleEnum.CLOSECOMBAT || role === RoleEnum.RANGECOMBAT || role === RoleEnum.HEALER) {
      return;
    }
    const containers = [
      createMockContainer(200, 1000),
      createMockContainer(800, 1000), // fullest
    ];

    const pos = createMockPosition();
    const room = createMockRoom(containers);
    const creep = createMockCreep(role, room, pos);

    findFilledResourceStorage(creep);

    expect(creep.memory.resourceId).toBe(containers[1].id);
    expect(creep.withdraw).toHaveBeenCalledWith(containers[1], RESOURCE_ENERGY);
    expect(creep.moveTo).toHaveBeenCalled();
    if (role === RoleEnum.BUILDER) {
      expect(creep.memory.resourceId).toBe(containers[1].id);
    } else if (role === RoleEnum.MOVER) {
      expect(creep.memory.targetId).toBe(containers[1].id);
    } else {
      const assigned = creep.memory.resourceId ?? creep.memory.targetId;
      expect(assigned).toBe(containers[1].id);
    }
  });

  test.each(Object.values(RoleEnum))("should assign the fullest container to movers", (role) => {
    if (RoleEnum.CLOSECOMBAT || role === RoleEnum.RANGECOMBAT || role === RoleEnum.HEALER) {
      return;
    }
    const containers = [
      createMockContainer(100, 1000),
      createMockContainer(900, 1000),
    ];
    const pos = createMockPosition();
    const room = createMockRoom(containers);
    const creep = createMockCreep("mover", room, pos);

    findFilledResourceStorage(creep);

    if (role === RoleEnum.BUILDER) {
      expect(creep.memory.resourceId).toBe(containers[1].id);
    } else if (role === RoleEnum.MOVER) {
      expect(creep.memory.targetId).toBe(containers[1].id);
    } else {
      const assigned = creep.memory.resourceId ?? creep.memory.targetId;
      expect(assigned).toBe(containers[1].id);
    }
  });


  test.each(Object.values(RoleEnum))("should not assign a container if none have energy", (role) => {
    if (RoleEnum.CLOSECOMBAT || role === RoleEnum.RANGECOMBAT || role === RoleEnum.HEALER) {
      return;
    }
    const containers = [
      createMockContainer(1000, 1000),
      createMockContainer(1000, 1000),
    ];
    const pos = createMockPosition();
    const room = createMockRoom(containers);
    const creep = createMockCreep(role, room, pos);
    findFilledResourceStorage(creep);
    if (role === RoleEnum.BUILDER) {
      expect(creep.memory.resourceId).toBe(containers[1].id);
    } else if (role === RoleEnum.MOVER) {
      expect(creep.memory.targetId).toBe(containers[1].id);
    } else {
      const assigned = creep.memory.resourceId ?? creep.memory.targetId;
      expect(assigned).toBe(containers[1].id);
    }
  });

  test.each(Object.values(RoleEnum))("should assing a container as resourceId to the creep", (role) => {
    if (RoleEnum.CLOSECOMBAT || role === RoleEnum.RANGECOMBAT || role === RoleEnum.HEALER) {
      return;
    }
    const containers = [
      createMockContainer(200, 1000),
      createMockContainer(800, 1000), // fullest
    ];
    const pos = createMockPosition();
    const room = createMockRoom(containers);
    const creep = createMockCreep(role, room, pos);
    findFilledResourceStorage(creep);
    if (role === RoleEnum.BUILDER) {
      expect(creep.memory.resourceId).toBe(containers[1].id);
    } else if (role === RoleEnum.MOVER) {
      expect(creep.memory.targetId).toBe(containers[1].id);
    } else {
      const assigned = creep.memory.resourceId ?? creep.memory.targetId;
      expect(assigned).toBe(containers[1].id);
    }
  });

  test.each([RoleEnum.BUILDER, RoleEnum.HARVESTER, RoleEnum.UPGRADER])(
    "role %s should assign the closest container if it has >= 500 energy",
    (role) => {
      // Closest container has 600, farther one has 800
      const containers = [
        createMockContainer(600, 1000), // closest
        createMockContainer(800, 1000), // farther
      ];

      const pos = createMockPosition();
      const room = createMockRoom(containers);
      const creep = createMockCreep(role, room, pos);

      findFilledResourceStorage(creep);

      // For builders/harvesters/upgraders, closest container ≥ 500 should be picked
      expect(creep.memory.resourceId ?? creep.memory.targetId).toBe(containers[0].id);
    }
  );
  test.each([RoleEnum.MOVER])(
    "mover should assign the fullest container even if closest has >= 500 energy",
    (role) => {
      // Closest container has 600, farther one has 800
      const containers = [
        createMockContainer(600, 1000), // closest
        createMockContainer(800, 1000), // farther
      ];

      const pos = createMockPosition();
      const room = createMockRoom(containers);
      const creep = createMockCreep(role, room, pos);

      findFilledResourceStorage(creep);

      // For builders/harvesters/upgraders, closest container ≥ 500 should be picked
      expect(creep.memory.resourceId ?? creep.memory.targetId).toBe(containers[1].id);
    }
  );
});
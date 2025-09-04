export const roleScout = {
  run(creep: Creep, targetRoom: string) {
    console.log("scout running")
    if (creep) {
      if (creep.pos.roomName !== targetRoom) {
        creep.moveTo(new RoomPosition(25, 25, targetRoom));
      } else {
        // optionally explore edges for sources
        creep.moveTo(new RoomPosition(5, 5, targetRoom));
      }
    }
  }
};
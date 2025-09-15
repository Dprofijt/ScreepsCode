import { healerBT } from "../bt/trees/healerBT";

export const roleHealer = {
  run(creep: Creep) {
    // creep.say('HAIL DANNY!');
    //goToRoomPF(creep, "W45S3", 11, 27);
    //visitFriend(creep, 'W45S3', 11, 27)
    healerBT(creep);

    // Save current hits for next tick
    creep.memory.lastHits = creep.hits;
  }
};


// simpleFriendVisit.ts
export function visitFriend(creep: Creep, targetRoom: string, x: number, y: number) {
  const dest = new RoomPosition(x, y, targetRoom);

  // debug visual of destination
  new RoomVisual(dest.roomName)
    .text('DEST', dest.x, dest.y - 0.5, { align: 'center' });

  // debug visual of current creep position
  new RoomVisual(creep.room.name)
    .circle(creep.pos.x, creep.pos.y)
    .text(creep.name, creep.pos.x, creep.pos.y - 0.5, { align: 'center' });

  // basic moveTo with some options
  const code = creep.moveTo(dest, {
    visualizePathStyle: { stroke: '#00ff00' },
    reusePath: 5,
    range: 1, // stop one tile from the target
  });

  // optional log for debugging
  if (code !== OK && code !== ERR_TIRED) {
    console.log(`[visitFriend] ${creep.name} moveTo returned ${code}`);
  }
}



//BELOW A WHOLE PATHFIND CLASS
// role.healer.ts
// Robust multi-room pathing with debug visuals and micro-step fallback.
// Call goToRoomPF(creep, targetRoom, x, y) every tick for the creep.

// ---- Memory types ----
declare global {
  interface CreepMemory {
    _path?: string;
    _dest?: [number, number, string]; // [x, y, roomName]
    _stuckTicks?: number;
    _lastPos?: string;
  }
}

// ---- config ----
const DEBUG_VISUALS = true;
const STUCK_TICKS_TO_REPLAN = 4;
const MAX_PLAN_ROOMS = 16;

// ---- helpers ----
function sameDest(a?: [number, number, string], b?: RoomPosition): boolean {
  if (!a || !b) return false;
  return a[0] === b.x && a[1] === b.y && a[2] === b.roomName;
}

/** Nudge destination if it's a wall (search radius up to 3) */
function ensureWalkable(pos: RoomPosition): RoomPosition {
  const terrain = Game.map.getRoomTerrain(pos.roomName);
  if (terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL) return pos;

  for (let r = 1; r <= 3; r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        const x = pos.x + dx;
        const y = pos.y + dy;
        if (x < 0 || x > 49 || y < 0 || y > 49) continue;
        if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
          return new RoomPosition(x, y, pos.roomName);
        }
      }
    }
  }
  return pos;
}

/** Convert RoomPosition[] into PathStep[] relative to `from`. Stops if non-adjacent step found. */
function positionsToPathSteps(from: RoomPosition, path: RoomPosition[]): PathStep[] {
  const steps: PathStep[] = [];
  let lastPos = from;

  for (const pos of path) {
    const dx = pos.x - lastPos.x;
    const dy = pos.y - lastPos.y;

    let direction: DirectionConstant;
    if (dx === 0 && dy === -1) direction = TOP;
    else if (dx === 1 && dy === -1) direction = TOP_RIGHT;
    else if (dx === 1 && dy === 0) direction = RIGHT;
    else if (dx === 1 && dy === 1) direction = BOTTOM_RIGHT;
    else if (dx === 0 && dy === 1) direction = BOTTOM;
    else if (dx === -1 && dy === 1) direction = BOTTOM_LEFT;
    else if (dx === -1 && dy === 0) direction = LEFT;
    else if (dx === -1 && dy === -1) direction = TOP_LEFT;
    else break; // non-adjacent; stop building steps

    // include x,y for TypeScript defs expecting them
    steps.push({
      dx,
      dy,
      direction,
      x: lastPos.x,
      y: lastPos.y,
    });

    lastPos = pos;
  }

  return steps;
}

/** Use PathFinder to compute a full path (RoomPosition[]). Can cross unseen rooms. */
function computeFullPath(creep: Creep, dest: RoomPosition): RoomPosition[] {
  const result = PathFinder.search(
    creep.pos,
    { pos: dest, range: 1 },
    {
      plainCost: 2,
      swampCost: 10,
      roomCallback: (roomName) => {
        const cm = new PathFinder.CostMatrix();
        const room = Game.rooms[roomName];
        if (!room) return cm; // unseen rooms allowed (treated as open)

        for (const s of room.find(FIND_STRUCTURES)) {
          if (s.structureType === STRUCTURE_ROAD) cm.set(s.pos.x, s.pos.y, 1);
          else if (
            s.structureType !== STRUCTURE_CONTAINER &&
            (s.structureType !== STRUCTURE_RAMPART || !(s as StructureRampart).my)
          ) {
            cm.set(s.pos.x, s.pos.y, 0xff);
          }
        }
        return cm;
      },
      maxRooms: MAX_PLAN_ROOMS,
    }
  );

  return result.path;
}

/** Find a nearby interior tile (avoid edges) as a fallback. */
function findNearbyInterior(creep: Creep, maxRadius = 4): RoomPosition | null {
  const terrain = Game.map.getRoomTerrain(creep.room.name);
  for (let r = 1; r <= maxRadius; r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        const x = creep.pos.x + dx;
        const y = creep.pos.y + dy;
        if (x < 1 || x > 48 || y < 1 || y > 48) continue;
        if (terrain.get(x, y) === TERRAIN_MASK_WALL) continue;
        // also avoid static blocking structures if we have vision
        if (Game.rooms[creep.room.name]) {
          const structs = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, x, y) as Structure[];
          let blocked = false;
          for (const s of structs) {
            if (s.structureType === STRUCTURE_ROAD) continue;
            if (s.structureType === STRUCTURE_CONTAINER) continue;
            if (s.structureType === STRUCTURE_RAMPART && (s as StructureRampart).my) continue;
            blocked = true; break;
          }
          if (blocked) continue;
        }
        return new RoomPosition(x, y, creep.room.name);
      }
    }
  }
  return null;
}

/** Check if a tile in current room is blocked (wall/structure/creep). */
function isTileBlockedInRoom(room: Room, x: number, y: number): { blocked: boolean; reason?: string } {
  const terrain = Game.map.getRoomTerrain(room.name);
  if (terrain.get(x, y) === TERRAIN_MASK_WALL) return { blocked: true, reason: 'terrain_wall' };

  if (Game.rooms[room.name]) {
    const structs = Game.rooms[room.name].lookForAt(LOOK_STRUCTURES, x, y) as Structure[];
    for (const s of structs) {
      if (s.structureType === STRUCTURE_ROAD) continue;
      if (s.structureType === STRUCTURE_CONTAINER) continue;
      if (s.structureType === STRUCTURE_RAMPART && (s as StructureRampart).my) continue;
      return { blocked: true, reason: `structure:${s.structureType}` };
    }
    const creeps = Game.rooms[room.name].lookForAt(LOOK_CREEPS, x, y) as Creep[];
    if (creeps.length > 0) return { blocked: true, reason: 'creep' };
  }

  return { blocked: false };
}

/** Small visual helper for blocked tile marker. */
function drawBlockedMarker(roomName: string, x: number, y: number, reason?: string) {
  if (!DEBUG_VISUALS) return;
  const rv = new RoomVisual(roomName);
  rv.line(x - 0.35, y - 0.35, x + 0.35, y + 0.35, { width: 0.08, color: '#f00' });
  rv.line(x - 0.35, y + 0.35, x + 0.35, y - 0.35, { width: 0.08, color: '#f00' });
  if (reason) rv.text(reason, x, y - 0.7, { align: 'center' });
}

/** Draw debug visuals: full planned path (where visible) and the chunk (green). */
function drawDebugVisuals(creep: Creep, fullPath: RoomPosition[], chunk: RoomPosition[], dest: RoomPosition) {
  if (!DEBUG_VISUALS) return;

  // full planned path (grey) - only draw for rooms we have vision for
  for (let i = 0; i < fullPath.length; i++) {
    const p = fullPath[i];
    if (!Game.rooms[p.roomName]) continue;
    const rv = new RoomVisual(p.roomName);
    // use default circle styling (avoid specifying CircleStyle properties that differ between typings)
    rv.circle(p.x, p.y);
    if (i % 5 === 0) rv.text(String(i), p.x, p.y - 0.35, { align: 'center' });
  }

  // chunk positions (green) in current room
  for (let i = 0; i < chunk.length; i++) {
    const p = chunk[i];
    if (p.roomName !== creep.room.name) continue;
    const rv = new RoomVisual(creep.room.name);
    // default circle; use text to mark start
    rv.circle(p.x, p.y);
    if (i === 0) rv.text('start', p.x, p.y - 0.35, { align: 'center' });
  }

  // show destination text in creep's room if dest not visible
  if (Game.rooms[dest.roomName]) {
    const rv = new RoomVisual(dest.roomName);
    rv.line(dest.x - 0.35, dest.y - 0.35, dest.x + 0.35, dest.y + 0.35, { width: 0.06, color: '#fff' });
    rv.line(dest.x - 0.35, dest.y + 0.35, dest.x + 0.35, dest.y - 0.35, { width: 0.06, color: '#fff' });
    rv.text('DEST', dest.x, dest.y - 0.55, { align: 'center' });
  } else {
    new RoomVisual(creep.room.name).text(`dest:${dest.roomName}(${dest.x},${dest.y})`, creep.pos.x, Math.max(0, creep.pos.y - 1), { align: 'center' });
  }

  // show stuck counter above creep
  new RoomVisual(creep.room.name).text(`st:${creep.memory._stuckTicks || 0}`, creep.pos.x, Math.max(0, creep.pos.y - 0.7), { align: 'center' });
}

// ---- main API ----
/**
 * Move creep to (x,y) in targetRoom. Works across unseen rooms by path-chunking.
 * Call this every tick for the creep.
 */
export function goToRoomPF(creep: Creep, targetRoom: string, x: number, y: number): void {
  if (!creep || !creep.pos) return;

  const rawDest = new RoomPosition(x, y, targetRoom);
  const dest = ensureWalkable(rawDest);

  // if destination changed, clear path so we replan
  if (!creep.memory._dest || !sameDest(creep.memory._dest, dest)) {
    delete creep.memory._path;
    creep.memory._dest = [dest.x, dest.y, dest.roomName];
  }

  // stuck detection bookkeeping
  const lastPosKey = `${creep.pos.x},${creep.pos.y},${creep.pos.roomName}`;
  if (creep.memory._lastPos === lastPosKey) creep.memory._stuckTicks = (creep.memory._stuckTicks || 0) + 1;
  else creep.memory._stuckTicks = 0;
  creep.memory._lastPos = lastPosKey;

  // compute full path (RoomPosition[])
  let fullPath: RoomPosition[] = [];
  try {
    fullPath = computeFullPath(creep, dest);
  } catch (e) {
    console.log(`[goToRoomPF] ${creep.name} PathFinder failed: ${e}`);
    delete creep.memory._path;
    return;
  }

  // if in destination room and path empty, fallback to moveTo
  if (fullPath.length === 0 && creep.room.name === dest.roomName) {
    creep.moveTo(dest);
    return;
  }

  // find index of first step that leaves current room
  const firstOtherRoomIndex = fullPath.findIndex((p) => p.roomName !== creep.room.name);

  // build chunkPositions to follow this tick (only positions inside current room)
  let chunkPositions: RoomPosition[] = [];
  if (firstOtherRoomIndex === -1) {
    chunkPositions = fullPath.slice();
  } else if (firstOtherRoomIndex === 0) {
    // PF immediately wants to step out. avoid stepping into unseen room:
    const interior = findNearbyInterior(creep, 4);
    if (interior) {
      const short = PathFinder.search(creep.pos, { pos: interior, range: 0 }, {
        plainCost: 2,
        swampCost: 10,
        roomCallback: () => new PathFinder.CostMatrix(),
        maxRooms: 1,
      }).path;
      chunkPositions = short;
    } else {
      delete creep.memory._path;
      return;
    }
  } else {
    chunkPositions = fullPath.slice(0, firstOtherRoomIndex);
  }

  if (!chunkPositions || chunkPositions.length === 0) {
    delete creep.memory._path;
    return;
  }

  // draw visuals
  drawDebugVisuals(creep, fullPath, chunkPositions, dest);

  // ensure the first chunk position is inside current room (defensive)
  const nextPos = chunkPositions[0];
  if (nextPos.roomName !== creep.room.name) {
    console.log(`[goToRoomPF] ${creep.name} first chunk pos not in current room; clearing path.`);
    delete creep.memory._path;
    return;
  }

  // check blocked state of next tile
  const blocked = isTileBlockedInRoom(creep.room, nextPos.x, nextPos.y);
  if (blocked.blocked) {
    drawBlockedMarker(creep.room.name, nextPos.x, nextPos.y, blocked.reason);
    console.log(`[goToRoomPF] ${creep.name} next tile blocked: ${nextPos.x},${nextPos.y} reason=${blocked.reason}`);

    // if static blockage, try interior fallback
    if (blocked.reason === 'terrain_wall' || (blocked.reason && blocked.reason.startsWith('structure'))) {
      const interior = findNearbyInterior(creep, 4);
      if (interior) {
        const short = PathFinder.search(creep.pos, { pos: interior, range: 0 }, {
          plainCost: 2,
          swampCost: 10,
          roomCallback: () => new PathFinder.CostMatrix(),
          maxRooms: 1,
        }).path;
        if (short && short.length > 0) {
          const stepsShort = positionsToPathSteps(creep.pos, short);
          try {
            creep.memory._path = Room.serializePath(stepsShort);
          } catch (e) {
            delete creep.memory._path;
            return;
          }
          const codeShort = creep.moveByPath(creep.memory._path);
          console.log(`[goToRoomPF] ${creep.name} interior fallback moveByPath -> ${codeShort}`);
          if (codeShort !== OK) delete creep.memory._path;
          return;
        }
      }
      delete creep.memory._path;
      return;
    }

    // if blocked by another creep, try single-step micro-move
    if (blocked.reason === 'creep') {
      const dir = creep.pos.getDirectionTo(new RoomPosition(nextPos.x, nextPos.y, creep.room.name));
      if (dir) {
        const direct = creep.move(dir);
        console.log(`[goToRoomPF] ${creep.name} direct micro-move -> ${direct} (dir=${dir})`);
        if (direct === OK) {
          delete creep.memory._path;
          creep.memory._stuckTicks = 0;
          return;
        }
      }
      delete creep.memory._path;
      return;
    }
  }

  // Build steps for the chunk relative to current position
  const steps = positionsToPathSteps(creep.pos, chunkPositions);
  if (!steps || steps.length === 0) {
    delete creep.memory._path;
    return;
  }

  // serialize chunk and store in memory
  try {
    creep.memory._path = Room.serializePath(steps);
  } catch (e) {
    console.log(`[goToRoomPF] ${creep.name} serializePath failed: ${e}`);
    delete creep.memory._path;
    return;
  }

  // Attempt to follow the chunk and immediately verify movement actually happened.
  const prevX = creep.pos.x;
  const prevY = creep.pos.y;
  const prevRoom = creep.pos.roomName;

  const code = creep.moveByPath(creep.memory._path);
  console.log(`[goToRoomPF] ${creep.name} moveByPath -> code=${code}, chunkLen=${chunkPositions.length}, next=${nextPos.x},${nextPos.y}`);

  // If moveByPath returned an error, try micro-fallback (existing logic)
  if (code !== OK) {
    drawBlockedMarker(creep.room.name, nextPos.x, nextPos.y, `mvFail:${code}`);

    // try a direct single-step move as a last resort
    const dir = creep.pos.getDirectionTo(new RoomPosition(nextPos.x, nextPos.y, creep.room.name));
    if (dir) {
      const direct = creep.move(dir);
      console.log(`[goToRoomPF] ${creep.name} direct fallback move -> ${direct} (dir=${dir})`);
      if (direct === OK) {
        // moved successfully by single step
        delete creep.memory._path;
        creep.memory._stuckTicks = 0;
        return;
      }
    }

    // otherwise clear path so we replan next tick
    delete creep.memory._path;
    return;
  }

  // If moveByPath returned OK, check whether the creep's position actually changed.
  const moved = creep.pos.x !== prevX || creep.pos.y !== prevY || creep.pos.roomName !== prevRoom;
  if (moved) {
    // real movement happened this tick
    creep.memory._stuckTicks = 0;
    delete creep.memory._path; // optional: let next tick recompute chunk
    return;
  }

  // moveByPath returned OK but creep is still on the same tile -> try direct micro-step now
  console.log(`[goToRoomPF] ${creep.name} moveByPath returned OK but didn't move; attempting micro-step to ${nextPos.x},${nextPos.y}`);

  const dir = creep.pos.getDirectionTo(new RoomPosition(nextPos.x, nextPos.y, creep.room.name));
  if (dir) {
    const direct = creep.move(dir);
    console.log(`[goToRoomPF] ${creep.name} micro-step result -> ${direct} (dir=${dir})`);
    if (direct === OK) {
      // succeeded via micro-move
      delete creep.memory._path;
      creep.memory._stuckTicks = 0;
      return;
    } else {
      // failed micro-move — mark and clear so we replan next tick
      drawBlockedMarker(creep.room.name, nextPos.x, nextPos.y, `microFail:${direct}`);
      delete creep.memory._path;
      return;
    }
  }

  // if we couldn't compute a direction, clear path and replan
  delete creep.memory._path;

}

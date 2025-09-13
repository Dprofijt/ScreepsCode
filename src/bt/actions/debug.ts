import { Status } from "../core";

export const consoleLogTest = (creep: Creep): Status => {
  console.log("werkt dit now?" + Game.time);
  return "SUCCESS"
}
import Phase from "@rbxts/planck/out/Phase";
import { start } from "shared/utils/jecs/start";

import change from "shared/utils/jecs/systems/change";

import SpawnOre from "./systems/gameplay/ore/spawn-ore";
import loadCommands from "./systems/commands/loadCommands";
import updateDayNight from "./systems/gameplay/environment/updateDayNight";
import updateFireplace from "./systems/gameplay/environment/updateFireplace";
import loadData from "./systems/player/data/loadData";
import savePlayerData from "./systems/player/data/savePlayerData";
import updateData from "./systems/player/data/updateData";
import loadCharacter from "./systems/player/loadCharacter";
import updateBody from "./systems/player/updateBody";
import replication from "./systems/replication";
import updateHunger from "./systems/stats/hunger";
import UpdateThirst from "./systems/stats/thirst";
import UpdateWalkSpeed from "./systems/player/updateWalkspeed";

start([
	// player
	{ system: updateBody },
	{ system: loadCharacter },
	{ system: loadData },
	{ system: savePlayerData },
	{ system: updateData },

	// stats
	{ system: updateHunger },
	{ system: UpdateThirst },
	{ system: UpdateWalkSpeed },

	// environment
	{ system: updateDayNight },
	{ system: SpawnOre },
	{ phase: Phase.PostStartup, system: updateFireplace },

	// commands
	{ system: loadCommands },

	// component replication
	{ system: replication },
	change,
]);

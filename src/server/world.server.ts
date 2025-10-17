import { start } from "shared/utils/jecs/start";
import change from "shared/utils/jecs/systems/change";
import replication from "./systems/replication";
import updateBody from "./systems/player/updateBody";
import loadCharacter from "./systems/player/loadCharacter";
import loadData from "./systems/player/data/loadData";
import savePlayerData from "./systems/player/data/savePlayerData";
import updateData from "./systems/player/data/updateData";
import loadCommands from "./systems/commands/loadCommands";
import updateHunger from "./systems/stats/hunger";
import updateDayNight from "./systems/gameplay/environment/updateDayNight";

start([
    // player
    { system: updateBody },
    { system: loadCharacter },
    { system: loadData },
    { system: savePlayerData },
    { system: updateData },

    // stats
    { system: updateHunger },

    // gameplay
    { system: updateDayNight },

    // commands
    { system: loadCommands },

    // component replication
    { system: replication },
    change
])
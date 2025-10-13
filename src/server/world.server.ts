import { start } from "shared/utils/jecs/start";
import change from "shared/utils/jecs/systems/change";
import replication from "./systems/replication";
import updateBody from "./systems/player/updateBody";
import loadCharacter from "./systems/player/loadCharacter";
import loadData from "./systems/player/data/loadData";
import savePlayerData from "./systems/player/data/savePlayerData";
import updateData from "./systems/player/data/updateData";

start([
    // player
    { system: updateBody },
    { system: loadCharacter },
    { system: loadData },
    { system: savePlayerData },
    { system: updateData },

    // component replication
    { system: replication },
    change
])
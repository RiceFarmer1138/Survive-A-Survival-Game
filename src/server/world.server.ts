import { start } from "shared/utils/jecs/start";
import change from "shared/utils/jecs/systems/change";
import replication from "./systems/replication";
import updateBody from "./systems/body/updateBody";
import loadCharacter from "./systems/body/loadCharacter";
import loadData from "./systems/data/loadData";
import savePlayerData from "./systems/data/savePlayerData";
import updateData from "./systems/data/updateData";

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
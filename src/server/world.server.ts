import { start } from "shared/utils/jecs/start";
import change from "shared/utils/jecs/systems/change";
import replication from "./systems/replication";
import updateBody from "./systems/body/updateBody";
import loadCharacter from "./systems/body/loadCharacter";
import loadData from "./systems/data/loadData";
import savePlayerData from "./systems/data/savePlayerData";
import updateData from "./systems/data/updateData";
import assignPlot from "./systems/plot/assignPlot";
import updatePlot from "./systems/plot/updatePlot";
import updateSnowPlow from "./systems/snow-plow/updateSnowPlow";
import updateFuel from "./systems/snow-plow/updateFuel";
import snowPartsShop from "./systems/snow-plow/snowPartsShop";

start([
    // player
    { system: updateBody },
    { system: loadCharacter },
    { system: loadData },
    { system: savePlayerData },
    { system: updateData },

    // plots
    { system: assignPlot },
    { system: updatePlot },

    // snow lows
    { system: updateSnowPlow },
    { system: updateFuel },
    { system: snowPartsShop },

    // component replication
    { system: replication },
    change
])
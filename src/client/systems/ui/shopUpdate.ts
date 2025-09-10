import { Entity, World } from "@rbxts/jecs";
import { LocalCharacter } from "client/constants";
import { routes } from "shared/network";
import paths from "shared/paths";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Plot } from "shared/utils/jecs/components";
import { useChange } from "shared/utils/jecs/plugins/hooks/use-change";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";
import { useThrottle } from "shared/utils/jecs/plugins/hooks/use-throttle";
import pageStates from "shared/utils/ui/state";

const MAX_DISTANCE_TO_NPC = 15
let timeTillRestock = 0;

/**
 * `shopUpdate`
 * A system that toggle/untoggle whether the player is near
 */
export default (world: World) => {
    const serverEntity = LocalCharacter.GetAttribute("ServerId") as Entity
    const clientEntity = serverEntity && getEntity.replicatedFromServerEntity(serverEntity)
    const plotComp = clientEntity && world.get(clientEntity, Plot)

    useRoute("updatePartsShop", (parts) => {
        pageStates.restockedParts(parts)
    })

    useRoute("updateRestockTime", (restockTime) => {
        timeTillRestock = restockTime
    })

    if (useThrottle(.1)) pageStates.restockTime(math.max(0, timeTillRestock - os.time()))
    if (useThrottle(.1) && serverEntity && clientEntity && plotComp) {
        const { plot } = plotComp
        const shopNpc = plot.ShopNPC
        const shopNpcPrompt = shopNpc.FindFirstChild("OpenShop") as ProximityPrompt

        useMemo(() => {
            if (shopNpcPrompt) {
                shopNpcPrompt.Triggered.Connect(() => {
            pageStates.openPage("Shop")
        })
            }
        }, [shopNpcPrompt])
    }
}
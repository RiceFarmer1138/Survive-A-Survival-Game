import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { useEvent } from "shared/utils/jecs/plugins/hooks/use-event";
import { getPlayerData } from "./extra/playerData";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";

/**
 * `savePlayerData`
 * A system for saving player data
 */
export default function savePlayerData(world: World) {
	for (const [player] of useEvent(Players.PlayerRemoving)) {
		const playerData = getPlayerData(player);
		const entity = getEntity.fromInstance(player);
		if (playerData && entity) playerData.close();
	}
};
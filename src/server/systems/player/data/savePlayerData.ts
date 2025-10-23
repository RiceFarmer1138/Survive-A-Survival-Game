import type { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";

import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { useEvent } from "shared/utils/jecs/plugins/hooks/use-event";

import { getPlayerData } from "./extra/playerData";

/** `savePlayerData` A system for saving player data. */
export default function SavePlayerData(world: World) {
	for (const [player] of useEvent(Players.PlayerRemoving)) {
		const playerData = getPlayerData(player);
		const entity = getEntity.fromInstance(player);
		if (playerData && entity) {
			playerData.close();
		}
	}
}

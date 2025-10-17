import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";
import { loadPlayerData, setPlayerData } from "./extra/playerData";
import { createCollection } from "@rbxts/lapis";
import defaultData, { PlayerData, playerDataValidation as validate } from "shared/data/defaultData";
import Log from "@rbxts/log";

/**
 * `loadData`
 * A system for loading players' data
 */
export default function loadData(world: World) {
	Players.GetPlayers().forEach((player) => {
		if (!player.GetAttribute("DataLoaded")) {
			player.SetAttribute("DataLoaded", true);

			task.spawn(() => loadPlayerData(player).then((data) => 
				Log.Info(
					`	Succcessfully loaded pdata for ${player.GetFullName()}
						\n Inventory: ${data && data.read().inventoryData.join(", ")}`
				)
			));
		}
	});
}
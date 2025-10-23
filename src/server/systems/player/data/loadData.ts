import type { World } from "@rbxts/jecs";
import Log from "@rbxts/log";
import { Players } from "@rbxts/services";

import { loadPlayerData } from "./extra/playerData";

/** `loadData` A system for loading players' data. */
export default function LoadData(world: World) {
	for (const player of Players.GetPlayers()) {
		if (!player.GetAttribute("DataLoaded")) {
			player.SetAttribute("DataLoaded", true);

			task.spawn(async () => {
				return loadPlayerData(player).then((data) => {
					Log.Info(
						`	Succcessfully loaded pdata for ${player.GetFullName()}
						\n Inventory: ${data && data.read().inventoryData.join(", ")}`,
					);
				});
			});
		}
	}
}

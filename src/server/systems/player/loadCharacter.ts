import type { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";

import paths from "shared/paths";

/** Loads the character. */
export default function LoadCharacter(world: World) {
	for (const player of Players.GetPlayers()) {
		if (!player.GetAttribute("characterSpawnedTag")) {
			player.SetAttribute("characterSpawnedTag", true);
			const dada = 2;

			task.spawn(() => {
				player.LoadCharacter();

				player.Character!.Parent = paths.Characters.Players;

				player.Character!.Destroying.Connect(() => {
					player.SetAttribute("characterSpawnedTag", false);
				});
			});
		}
	}
}

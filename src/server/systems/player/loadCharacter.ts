import { Entity, World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import paths from "shared/paths";

// loads the character
export default function loadCharacter(world: World) {
	Players.GetPlayers().forEach((player) => {
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
	});
};
import { Entity, World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import paths from "shared/paths";
import { getCharacterParts } from "shared/utils/functions/characterFunctions";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { Body, ModelDebugger, Player } from "shared/utils/jecs/components";

export default function updateBody(world: World) {
	const playerModels = paths.Characters.Players.GetChildren() as Array<Model>;
	playerModels.forEach((model) => {
		const player = Players.GetPlayerFromCharacter(model);

		if (player && !model.GetAttribute("ServerId")) {
			const [humanoid, rootPart, head, animator, rootAttachment] = getCharacterParts(model as Model);
			if (model && humanoid && rootPart && animator && rootAttachment && head) {
				const entity = (player.GetAttribute("ServerId") as Entity) || world.entity();

				world.set(entity, Body, {
					head,
					model,
					humanoid,
					rootPart,
					animator,
					rootAttachment,
				});

				addComponent(entity, Player, player);
				addComponent(entity, ModelDebugger, model);

				player.SetAttribute("ServerId", entity);
				model.SetAttribute("ServerId", entity);
			}
		}
	});
};
import { pair, World } from "@rbxts/jecs";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Body, Data, Occupant, Own, Player, Plot, SnowPlow, TargetEntity, world } from "shared/utils/jecs/components";

const playersWithoutSnowPlow = world
	.query(Data, Plot)
	.with(Player, Body, pair(TargetEntity, Plot))
	.without(pair(Occupant, SnowPlow))
	.cached();

/**
 * `updateSnowPlow`
 * A system for creating for creating snowplow for players
 */
export default (world: World) => {
	// spawning the snow plow if the player doesnt have
	for (const [playerEntity, playerData, plotComp] of playersWithoutSnowPlow)
		createEntity.createSnowPlow(playerEntity, playerData, plotComp);
};

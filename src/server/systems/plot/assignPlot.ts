import { Entity, pair, Wildcard, World } from "@rbxts/jecs";
import Object from "@rbxts/object-utils";
import { equalsDeep } from "@rbxts/sift/out/Dictionary";
import { ComponentDataFromEntity, createEntity, setEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Body, ClaimedBy, Data, Own, Player, Plot, TargetEntity, world } from "shared/utils/jecs/components";

// all the entities that dont have a plot yet and their data already loaded
const playersWithoutPlot = world.query(Body).with(Data, Player).without(pair(TargetEntity, Plot)).cached();
const plotsArchetype = world.query(Plot).without(pair(ClaimedBy, Wildcard)).cached().archetypes();

function getPlot(playerClaimEntity: Entity) {
    const RNG = new Random()
    const spawns = new Map<ComponentDataFromEntity<typeof Plot>, Entity>();
	for (const { records, columns, entities } of plotsArchetype) {
		const spawnIndex = records[Plot - 1];
		const spawnList = columns[spawnIndex - 1] as ComponentDataFromEntity<typeof Plot>[];
		spawnList.forEach((spawn) => {
			spawns.set(spawn, spawnList.findIndex((v) => equalsDeep(v, spawn)) as Entity);
		});
	}

	const randomSpawn = Object.keys(spawns)[RNG.NextInteger(1, spawns.size())];
	return [spawns.get(randomSpawn), randomSpawn] as [Entity, ComponentDataFromEntity<typeof Plot>];
}

/**
 * `assignPlot`
 * A system for loading player's plot
 */
export default (world: World) => {
	for (const [entity, { model }] of playersWithoutPlot) {
        const [plotEntity, plotComp] = getPlot(entity);
        if (plotEntity && plotComp) {
            setEntity.claimPlot(entity, model, plotEntity, plotComp)
        }
	}
};

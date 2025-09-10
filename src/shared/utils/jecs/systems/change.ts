import { Delete, Entity, Name, OnAdd, OnRemove, OnSet, Pair, pair, Wildcard, World } from "@rbxts/jecs";
import { Phase, Scheduler } from "@rbxts/planck";
import { SystemTable } from "@rbxts/planck/out/types";


import {
	Added,
	addedQuery,
	Append,
	Changed,
	changedQuery,
	Removed,
	removedQuery,
	TargetEntity,
	world,
} from "shared/utils/jecs/components";
import { useHookState } from "../plugins/topo";
import { useMemo } from "../plugins/hooks/use-memo";

// components
const previousValue = new Map<Pair<unknown, unknown>, unknown>();

// one time
for (const [comp, name] of world.query(Name)) {
	if (
		name.find("jecs.").size() > 0 ||
		name === "Added" ||
		name === "Removed" ||
		name === "Changed" ||
		name === "Append"
	)
		continue;

	removedQuery.add(comp);
	addedQuery.add(comp);
	changedQuery.add(comp);
}

// function to create a change save
function createChangeSave(world: World, target: Entity, comp: Entity, oldValue?: unknown, newValue?: unknown) {
	// appends the entity into the world
	world.set(world.entity(), Append, () => {
		const entityChanged = world.entity();
		const appendEntity2 = world.entity();

		// applies the changed component to the entity
		world.set(entityChanged, TargetEntity, target);
		world.set(entityChanged, Changed(comp), { old: oldValue, new: newValue });

		// when it comes back full circle: Removed changed entity so it doesn't show twice
		world.set(appendEntity2, Append, () => world.delete(entityChanged));
	});
}

// for change
export default {
	phase: Phase.First,
	system: (world) => {
		// disconnects all the components
		for (const [comp] of world.query(OnAdd)) world.remove(comp, OnAdd);
		for (const [comp] of world.query(OnRemove)) world.remove(comp, OnRemove);
		for (const [comp] of world.query(OnSet)) world.remove(comp, OnSet);

		// for all added query
		addedQuery.forEach((comp) => {
			world.set(comp, OnAdd, (entity) => {
				const pairing = pair(entity, comp);

				// appends the entity into the world
				world.set(world.entity(), Append, () => {
					const entityAdded = world.entity();
					const value = world.get(entity, comp);
					const appendEntity2 = world.entity();

					// applies the added component to the entity && updates the previous value
					world.set(entityAdded, TargetEntity, entity);
					world.set(entityAdded, Added(comp), value);
					if (value === undefined) createChangeSave(world, entity, comp, undefined, value);
					previousValue.set(pairing, value); // takes a second for the value to show up

					// when it comes back full circle: Removed added entity so it doesn't show twice
					world.set(appendEntity2, Append, () => world.delete(entityAdded));
				});
			});
		});

		// for all changed query
		changedQuery.forEach((comp) => {
			world.set(comp, OnSet, (entity, newValue) => {
				const pairing = pair(entity, comp);
				const oldValue = previousValue.get(pairing);

				// sets the new value
				previousValue.set(pairing, newValue);

				// calls it
				createChangeSave(world, entity, comp, oldValue, newValue);
			});
		});

		// for all removed query
		removedQuery.forEach((comp) => {
			world.set(comp, OnRemove, (entity) => {
				const pairing = pair(entity, comp);
				const oldValue = world.get(entity, comp);

				// destroys the previous value
				previousValue.delete(pairing);

				// appends the entity into the world
				world.set(world.entity(), Append, () => {
					const entityRemoved = world.entity();
					const appendEntity2 = world.entity();

					// applies the removed component to the entity
					world.set(entityRemoved, Removed(comp), oldValue);
					world.set(entityRemoved, TargetEntity, entity);
					createChangeSave(world, entity, comp, oldValue);

					// when it comes back full circle: Removed removed entity so it doesn't show twice
					world.set(appendEntity2, Append, () => world.delete(entityRemoved));
				});
			});
		});

		// clears removed added and changed
		// print(removedQuery.size(), addedQuery.size(), changedQuery.size())
		removedQuery.clear();
		addedQuery.clear();
		changedQuery.clear();

		// when appends are removed
		for (const [appendedEntity, callback] of world.query(Append)) {
			world.delete(appendedEntity);
			callback();
		}
	},
} as SystemTable<[World]>;
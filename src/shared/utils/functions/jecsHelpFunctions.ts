import type { Entity, Pair } from "@rbxts/jecs";
import { pair } from "@rbxts/jecs";
import Object, { deepCopy } from "@rbxts/object-utils";

import type { PlayerData } from "shared/data/defaultData";
import * as c from "shared/utils/jecs/components";
import type { componentsToReplicate } from "shared/utils/jecs/components";
import {
	ReplicatedComponent,
	TakeFromThirst,
	TargetReplication,
	UpdateData,
	UpdateInventory,
	world,
} from "shared/utils/jecs/components";

export type ComponentValue<C> = C extends Entity<infer T> ? T : C extends Pair<infer _, infer O> ? O : never;
export type ComponentDataFromEntity<E> = E extends Entity<infer T> ? T : never;
export type AllComponentNames = {
	[K in keyof typeof c]: (typeof c)[K] extends Entity ? K : never;
}[keyof typeof c];

export type MappedComponents = { [K in AllComponentNames]: (typeof c)[K] };
export const MappedComponents: MappedComponents = c as MappedComponents;
export const MappedComponentsSwitched = Object.entries(MappedComponents)
	.map(([k, v]) => [v, k] as const)
	.reduce<Record<string, string>>((accumulator, [k, v]) => {
		accumulator[k] = v;
		return accumulator;
	}, {}) as ReturnType<<CompName extends AllComponentNames>() => Record<MappedComponents[CompName], CompName>>;

export const checkEntity = {};

export const getEntity = {
	fromInstance: (instance: Instance) => {
		const entity = instance.GetAttribute("ServerId") as Entity;

		// if entity exists then return it
		return entity !== undefined && world.contains(entity) ? entity : undefined;
	},

	replicatedFromServerEntity: (serverEntity: Entity) =>
		world.query(pair(serverEntity, ReplicatedComponent)).iter()()[0],
};

export const setEntity = {
	addTargetForReplication: (
		targetEntity: Entity,
		player: Array<Player> | Player,
		component: (typeof componentsToReplicate)[keyof typeof componentsToReplicate],
	) => {
		const targetReplication = world.get(targetEntity, TargetReplication) || { [component]: [] };
		const oldTargets = targetReplication[component] || [];

		// adds the targets to the table
		if (typeIs(player, "Instance")) {
			oldTargets.push(player);
		} else {
			player.forEach((player) => oldTargets.push(player));
		}

		// remove any duplicates
		oldTargets.filter((v, index, a) => a.indexOf(v) === index);

		// sets tje targets in thje target replication
		world.set(targetEntity, TargetReplication, { ...targetReplication, [component]: oldTargets });
	},

	takeFromThirstBar: (bodyEntity: Entity, data: { amount: number } | { percentile: number }) => {
		addComponent(world.entity(), TakeFromThirst, {
			bodyEntity,
			...data,
		});
	},
};

export const createEntity = {
	replicated: (serverEntity: Entity) => {
		const replicatedEntity = world.entity();

		// adds relationship
		world.set(replicatedEntity, pair(serverEntity, ReplicatedComponent), serverEntity);
		world.set(replicatedEntity, ReplicatedComponent, serverEntity);

		// returns it
		return replicatedEntity;
	},

	updateData: (updateFunction: (oldData: PlayerData) => PlayerData, bodyEntity: Entity) => {
		const updateEntity = world.entity();
		world.set(updateEntity, UpdateData, { bodyEntity, updateFunction });
		return updateEntity;
	},

	updateInventory: (updateFunction: (oldInventory: Inventory) => Inventory, bodyEntity: Entity) => {
		const updateEntity = world.entity();
		world.set(updateEntity, UpdateInventory, { bodyEntity, updateFunction });
		return updateEntity;
	},
};

export const jecsDefaultProps = {} satisfies {
	[componentName in AllComponentNames]?: ComponentValue<MappedComponents[componentName]>;
};

type DefaultProps = typeof jecsDefaultProps;
type DefaultPropertyKeys = keyof DefaultProps;

export function addComponent<P extends undefined>(entity: Entity, component: Entity<P>): void;

export function addComponent<P, O>(entity: Entity, component: Pair<P, O>, value: P): void;

export function addComponent<N extends DefaultPropertyKeys, D extends MappedComponents[N]>(
	entity: Entity,
	component: D,
): void;

/** 2. Three-arg only for non-defaulted components. */
export function addComponent<N extends Exclude<AllComponentNames, DefaultPropertyKeys>, D extends MappedComponents[N]>(
	entity: Entity,
	component: D,
	value: ComponentValue<D>,
): void;

/** 3. Three-arg override for defaulted components. */
export function addComponent<N extends DefaultPropertyKeys, D extends Entity>(
	entity: Entity,
	component: D,
	value: ComponentValue<D>,
): void;

/** Implementation. */
export function addComponent<N extends AllComponentNames, D extends MappedComponents[N]>(
	entity: Entity,
	component: D,
	value?: ComponentValue<D>,
): void {
	// Determine the component data to use
	const defaultTable = jecsDefaultProps[MappedComponentsSwitched[component] as DefaultPropertyKeys] as
		| ComponentValue<MappedComponents[N]>
		| undefined;
	const clonedTable = typeIs(defaultTable, "table") && deepCopy(defaultTable);
	const componentInfo = (
		value !== undefined
			? value
			: clonedTable || jecsDefaultProps[MappedComponentsSwitched[component] as DefaultPropertyKeys]
	) as ComponentValue<MappedComponents[N]>;

	// Add the component to the entity
	world.set(entity, component as never, componentInfo as never);
}

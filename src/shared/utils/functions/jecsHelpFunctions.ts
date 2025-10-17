import { Entity, pair, Pair } from "@rbxts/jecs";
import Object, { deepCopy } from "@rbxts/object-utils";
import { RunService, Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { DocumentData, PlayerData } from "shared/data/defaultData";
import paths from "shared/paths";
import * as c from "shared/utils/jecs/components";
import {
	world,
	UpdateData,
	UpdateInventory,
	Cooldown,
	Body,
	DestroyAfterCounting,
	componentsToReplicate,
	Data,
	ReplicatedComponent,
	ModelDebugger,
	TargetEntity,
	TargetReplication,
} from "shared/utils/jecs/components";
import { rayParamsFilter } from "./rayFunctions";

export type ComponentValue<C> = C extends Entity<infer T> ? T : C extends Pair<infer _, infer O> ? O : never;
export type ComponentDataFromEntity<E> = E extends Entity<infer T> ? T : never;
export type AllComponentNames = {
	[K in keyof typeof c]: (typeof c)[K] extends Entity<unknown> ? K : never;
}[keyof typeof c];

export type MappedComponents = { [K in AllComponentNames]: (typeof c)[K] };
export const MappedComponents: MappedComponents = c as MappedComponents;
export const MappedComponentsSwitched = Object.entries(MappedComponents)
	.map(([k, v]) => [v, k] as const)
	.reduce(
		(acc, [k, v]) => {
			acc[k] = v;
			return acc;
		},
		{} as Record<string, string>,
	) as ReturnType<<CompName extends AllComponentNames>() => { [K in MappedComponents[CompName]]: CompName }>;

export const checkEntity = {};

export const getEntity = {
	replicatedFromServerEntity: (serverEntity: Entity) =>
		world.query(pair(serverEntity, ReplicatedComponent)).iter()()[0],

	fromInstance: (instance: Instance) => {
		const entity = <Entity>instance.GetAttribute("ServerId");

		// if entity exists then return it
		return entity !== undefined && world.contains(entity as Entity) ? entity : undefined;
	},

};

export const setEntity = {
	addTargetForReplication: (
		targetEntity: Entity,
		player: Player | Player[],
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
		oldTargets.filter((v, i, a) => a.indexOf(v) === i);

		// sets tje targets in thje target replication
		world.set(targetEntity, TargetReplication, { ...targetReplication, [component]: oldTargets });
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
		const updateEntity = world.entity()
		world.set(updateEntity, UpdateInventory, { bodyEntity, updateFunction });
		return updateEntity;
	},
};


export const jecsDefaultProps = {} satisfies {
	[componentName in AllComponentNames]?: ComponentValue<MappedComponents[componentName]>;
};
type DefaultProps = typeof jecsDefaultProps;
type DefaultPropKeys = keyof DefaultProps;

export function addComponent<P extends undefined>(entity: Entity, component: Entity<P>): void;

export function addComponent<P, O>(entity: Entity, component: Pair<P, O>, value: P): void;

export function addComponent<N extends DefaultPropKeys, D extends MappedComponents[N]>(
	entity: Entity,
	component: D,
): void;

// 2) Three-arg only for non-defaulted components
export function addComponent<N extends Exclude<AllComponentNames, DefaultPropKeys>, D extends MappedComponents[N]>(
	entity: Entity,
	component: D,
	value: ComponentValue<D>,
): void;

// 3) Three-arg override for defaulted components
export function addComponent<N extends DefaultPropKeys, D extends Entity>(
	entity: Entity,
	component: D,
	value: ComponentValue<D>,
): void;

// implementation
export function addComponent<N extends AllComponentNames, D extends MappedComponents[N]>(
	entity: Entity,
	component: D,
	value?: ComponentValue<D>,
): void {
	// Determine the component data to use
	const defaultTable = jecsDefaultProps[MappedComponentsSwitched[component] as DefaultPropKeys] as
		| ComponentValue<MappedComponents[N]>
		| undefined;
	const clonedTable = typeIs(defaultTable, "table") && deepCopy(defaultTable);
	const componentInfo = (
		value !== undefined
			? value
			: clonedTable || jecsDefaultProps[MappedComponentsSwitched[component] as DefaultPropKeys]
	) as ComponentValue<MappedComponents[N]>;

	// Add the component to the entity
	world.set(entity, component as never, componentInfo as never);
}

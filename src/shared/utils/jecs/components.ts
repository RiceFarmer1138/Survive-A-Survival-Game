import { HotReloader } from "@rbxts/hot-reloader";
import type { Entity, Pair } from "@rbxts/jecs";
import { Name, pair, World } from "@rbxts/jecs";
import { Scheduler } from "@rbxts/planck";
import { RunService } from "@rbxts/services";

import Builder from "shared/builders";
import type { PlayerData } from "shared/data/defaultData";

export const debugEnabled = RunService.IsStudio();
export const world = new World();
export const worldBuilder = new Builder(world);
export const hotReloader = new HotReloader();
export const systemQueue = new Scheduler(world);

world.set(Name, Name, "Name");
function component<T = undefined>(name: string, defaultValue?: T): Entity<T> {
	const theComponent = world.component<T>();

	// Create a new component with the given name
	world.set(theComponent, Name, name);
	if (defaultValue !== undefined) {
		world.set(theComponent, theComponent, defaultValue);
	}

	// returns it
	return theComponent;
}

export const Append = component<Callback>("Append");
export const ModelDebugger = component<BasePart | Model>("ModelDebugger");
export const TargetEntity = component<Entity>("TargetEntity");
// cspell:ignore Cooldown
export const Cooldown = component<number>("Cooldown");
export const DestroyAfterCounting = component("DestroyAfterCounting");
export const ReplicatedComponent = component<Entity>("ReplicatedComponent");
export const TargetReplication =
	component<Partial<Record<(typeof componentsToReplicate)[keyof typeof componentsToReplicate], Array<Player>>>>(
		"TargetReplication",
	);

const changedComponent = component<Changed<unknown>>("Changed");
const addedComponent = component<Entity>("Added");
const removedComponent = component<Entity>("Removed");

// for changes
interface Changed<T> {
	readonly new?: T;
	readonly old?: T;
}
export const [changedQuery, addedQuery, removedQuery] = [new Set<Entity>(), new Set<Entity>(), new Set<Entity>()];
export function Changed<T>(comp: Entity<T>): Pair<Changed<T>, T> {
	changedQuery.add(comp);
	Added(comp);
	Removed(comp);
	return pair<Changed<T>, T>(changedComponent as unknown as Entity<Changed<T>>, comp as unknown as Entity<T>);
}
export function Added<T>(comp: Entity<T>): Pair<undefined, T> {
	addedQuery.add(comp);
	return pair<undefined, T>(addedComponent as unknown as Entity<undefined>, comp as unknown as Entity<T>);
}
export function Removed<T>(comp: Entity<T>): Pair<undefined, T> {
	removedQuery.add(comp);
	return pair<undefined, T>(removedComponent as unknown as Entity<undefined>, comp as unknown as Entity<T>);
}

/** ********************** Player related components. */
// hunger for player
export const HungerBar = component<{
	hunger: number;
	/**
	 * How long it takes to deduct player's hunger could be affected by
	 * different mutations like poison or roles (baker, medic, etc).
	 */
	hungerRate: number;
	maxHunger: number;
}>("HungerBar");
// fflag for when the player runs out of hunger
export const Starved = component("Starved");

// thrist for sprinting / any kind of movement related
export const ThirstBar = component<{
	maxThirst: number;
	thirst: number;
	/**
	 * How long it takes to replenish player's thirst bar
	 * The higher the rate, the faster it fills up
	 */
	thirstRate: number;
}>("ThirstBar");
export const TakeFromThirst = component<{ bodyEntity: Entity, percentile: number } | { bodyEntity: Entity, amount: number }>("TakeFromThirst");

// player inventory
export const UpdateInventory = component<{
	bodyEntity: Entity;
	/** The function that returns the updated player inventory. */
	updateFunction: (oldInventory: Inventory) => Inventory;
}>("UpdateInventory");

export const WalkSpeed = component<{ walkSpeed: number }>("WalkSpeed")

// player data comp
export const Data = component<PlayerData>("Data");

// update data
export const UpdateData = component<{
	bodyEntity: Entity;
	updateAll?: true;
	updateFunction: (oldData: PlayerData) => PlayerData;
}>("UpdateData");

// player component
export const Player = component<Player>("Player");

// player body
export const Body = component<{
	animator: Animator;
	head: BasePart;
	humanoid: Humanoid;
	model: Model;
	rootAttachment: Attachment;
	rootPart: BasePart;
}>("Body");

/** ********************** Gameplay. */
// how far the players have made it to the days.
export const Day = component<{
	/** Days indicator. */
	day: number;
	indicator: "AM" | "PM";
}>("Day");

// ore component
export const Ore = component<{
	ore: Ore;
}>("Ore");

// components to replicate to the client
export const componentsToReplicate = { Body };

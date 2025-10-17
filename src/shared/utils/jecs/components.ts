import { HotReloader } from "@rbxts/hot-reloader";
import { Entity, Name, pair, World } from "@rbxts/jecs";
import { Scheduler } from "@rbxts/planck";
import { RunService } from "@rbxts/services";
import Builder from "shared/builders";
import { type PlayerData,  DocumentData } from "shared/data/defaultData";

export const debugEnabled = RunService.IsStudio()
export const world = new World();
export const worldBuilder = new Builder(world)
export const hotReloader = new HotReloader();
export const systemQueue = new Scheduler(world);
world.set(Name, Name, "Name");
const component = <T = undefined>(name: string, defaultValue?: T) => {
	const theComponent = world.component<T>();

	// Create a new component with the given name
	world.set(theComponent, Name, name);
	if (defaultValue) world.set(theComponent, theComponent, defaultValue);

	// returns it
	return theComponent;
};

export const Append = component<Callback>("Append");
export const ModelDebugger = component<Model | BasePart>("ModelDebugger");
export const TargetEntity = component<Entity>("TargetEntity");
export const Cooldown = component<number>("Cooldown");
export const DestroyAfterCounting = component("DestroyAfterCounting");
export const ReplicatedComponent = component<Entity>("ReplicatedComponent");
export const TargetReplication =
	component<{ [key in (typeof componentsToReplicate)[keyof typeof componentsToReplicate]]?: Player[] }>(
		"TargetReplication",
	);

const _changedComponent = component<Changed<unknown>>("Changed");
const _addedComponent = component<Entity>("Added");
const _removedComponent = component<Entity>("Removed");

// for changes
type Changed<T> = { readonly old?: T; readonly new?: T };
export const [changedQuery, addedQuery, removedQuery] = [new Set<Entity>(), new Set<Entity>(), new Set<Entity>()];
export const Changed = <T>(comp: Entity<T>) => {
	changedQuery.add(comp);
	Added(comp);
	Removed(comp);
	return pair<Changed<T>, T>(_changedComponent as unknown as Entity<Changed<T>>, comp as unknown as Entity<T>);
};
export const Added = <T>(comp: Entity<T>) => {
	addedQuery.add(comp);
	return pair<T, undefined>(_addedComponent as unknown as Entity<T>, comp as unknown as Entity<undefined>);
};
export const Removed = <T>(comp: Entity<T>) => {
	removedQuery.add(comp);
	return pair<T, undefined>(_removedComponent as unknown as Entity<T>, comp as unknown as Entity<undefined>);
};


/************************ Player ************************/

// hunger for player
export const HungerBar = component<{
	hunger: number;
	maxHunger: number
	/**
	 * how long it takes to deduct player's hunger
	 * could be affected by different mutations like poison
	 * or roles (baker, medic, etc)
	 */
	hungerRate: number;
}>("HungerBar");
// fflag for when the player runs out of hunger
export const Starved = component("Starved")

// player inventory
export const UpdateInventory = component<{
	// the function that returns the updated player inventory
	updateFunction: (oldInventory: Inventory) => Inventory;
	bodyEntity: Entity;
}>("UpdateInventory");

export const Inventory = component<Inventory>("Inventory");

// player data comp
export const Data = component<PlayerData>("Data");

// update data
export const UpdateData = component<{
	updateFunction: (oldData: PlayerData) => PlayerData;
	bodyEntity: Entity;
	updateAll?: true;
}>("UpdateData");

// player component
export const Player = component<Player>("Player");

// player body
export const Body = component<{
	model: Model;
	head: BasePart;
	humanoid: Humanoid;
	rootPart: BasePart;
	animator: Animator;
	rootAttachment: Attachment;
}>("Body");

/************************ Gameplay ************************/

// how far the players have made it to the days
export const Day = component<{
	// days indicator
	day: number;
	indicator: "AM" | "PM";
}>("Day");

// ore component
export const Ore = component<{
	ore: Ore
}>("Ore	")

// components to replicate to the client
export const componentsToReplicate = { Body };

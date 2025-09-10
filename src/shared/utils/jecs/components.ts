import { HotReloader } from "@rbxts/hot-reloader";
import { Entity, Name, pair, World } from "@rbxts/jecs";
import { Scheduler } from "@rbxts/planck";
import { RunService } from "@rbxts/services";
import { type PlayerData,  DocumentData } from "shared/data/defaultData";

export const debugEnabled = RunService.IsStudio()
export const world = new World();
export const systemQueue = new Scheduler(world);
export const hotReloader = new HotReloader();
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

// player inventory
export const UpdateInventory = component<{
	updateFunction: (oldInventory: Inventory) => Inventory;
	bodyEntity: Entity;
}>("UpdateData");
// export const Inventory = component<{ inventory: Inventory }>("Inventory")

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

/************************ Snow Plow ************************/

// snowplow component
export const SnowPlow = component<{}>("SnowPlow")

// snowplow's fuel
export const Fuel = component<{
	regenerationRate: number,
	current: number;
	max: number
}>("Fuel");
export const FuelRanOut = component("FuelRanOut")

/************************ Plot ************************/
export const Plot = component<{ plot: Plot }>("Plot")
export const ClaimedBy = component<Entity>("ClaimedBy")
export const Own = component<Entity>("Own")
export const Occupant = component<Entity>("Occupant")

export const componentsToReplicate = { Body, Fuel, Plot };
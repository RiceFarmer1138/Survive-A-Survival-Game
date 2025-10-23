import type { Entity, World } from "@rbxts/jecs";
import { createMotion } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";

import paths from "shared/paths";

import OreState from "./ore-state";

export default class OreBuilder {
	private readonly _entity: Entity;
	private readonly model: Model | undefined;
	private readonly world: World;

	private _name: Ore = "GoldOre";
	private _position: Vector3 = new Vector3(math.huge, math.huge, math.huge);
	private _tweenable = false;

	constructor(world: World) {
		this.world = world;
		this._entity = world.entity();
	}

	public Class(ore_name: Ore): this {
		assert(ore_name);
		this._name = ore_name;
		return this;
	}

	public Position(ore_position: Vector3): this {
		this._position = ore_position;
		return this;
	}

	public Build(): OreState {
		const oreModel = paths.Assets.Ores[this._name].Clone();
		oreModel.PivotTo(new CFrame(this._position));
		oreModel.Parent = paths.Map.Ores;
		return new OreState(this._entity, oreModel);
	}
}

import type { Entity, World } from "@rbxts/jecs";
import Signal from "@rbxts/signal";

import paths from "shared/paths";

import BreakableTreeState from "./breakable-tree-state";

interface IBreakableOnHit {
	hitEntitiy: Entity;
}

export default class BreakableTreeBuilder {
	private readonly entity: Entity;
	private readonly world: World;

	private health = 100;
	private position = new Vector3(0, 0, 0);

	public readonly onHitEvent = new Signal<(onHit: IBreakableOnHit) => void>();

	constructor(world: World) {
		this.world = world;
		this.entity = world.entity();
	}

	public Health(health: number): this {
		this.health = health;
		return this;
	}

	public Position(ore_position: Vector3): this {
		this.position = ore_position;
		return this;
	}

	public OnHit(funcToall: (onhitParameters: IBreakableOnHit) => void): this {
		this.onHitEvent.Connect(funcToall);
        return this
	}

	public Build(): BreakableTreeState {
		const treeModel = paths.Assets.Tree.Clone();
		treeModel.PivotTo(new CFrame(this.position));
		treeModel.Parent = paths.Map.Trees;
		return new BreakableTreeState(this.entity, treeModel);
	}
}

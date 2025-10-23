import type { Entity } from "@rbxts/jecs";

export default class OreState {
	private readonly entity: Entity;
	private readonly model: Model;

	constructor(entity: Entity, model: Model) {
		this.entity = entity;
		this.model = model;
	}

	public GetEntity(): Entity {
		return this.entity;
	}

	public GetModel(): Model {
		return this.model;
	}
}

import type { World } from "@rbxts/jecs";

import OreBuilder from "./ores/ore-builder";

export default class Builder {
	private readonly world: World;

	constructor(world: World) {
		this.world = world;
	}

	/**
	 * Create an item with specified (stacks, name, itemType, etc.).
	 *
	 * @memberof systemBuilder
	 * @public
	 */
	public Ore(): OreBuilder {
		return new OreBuilder(this.world);
	}

	public GetMaxOres(): number {
		return 30;
	}
}

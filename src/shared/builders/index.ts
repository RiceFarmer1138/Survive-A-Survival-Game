import { World } from "@rbxts/jecs";
import OreBuilder from "./environment/ores/oreBuilder";

export default class Builder {
    private world: World

    public constructor(world: World) {
        this.world = world;
    }

    /**
     * Create an item with specified (stacks, name, itemType, etc.)
     * 
     * @public
     * @memberof systemBuilder
     */
    public NewOre() {
        return new OreBuilder(this.world)
    }

    public GetMaxOres() {
        return 30
    }
}
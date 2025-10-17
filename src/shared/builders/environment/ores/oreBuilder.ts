import { Entity, World } from "@rbxts/jecs"
import Builder from "shared/builders";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { Ore } from "shared/utils/jecs/components";

export default class OreBuilder {
    private _name: Ore = "GoldOre"
    private _position: Vector3 = new Vector3(math.huge, math.huge, math.huge)
    private world: World

    public constructor(world: World) {
        this.world = world
    }

    public name(oreName: Ore) {
        assert(oreName)
        this._name = oreName;
        return this
    }

    public position(position: Vector3) {
        assert(position)
        this._position = position;
        return this
    }

    public build(): Entity {
        const oreEntity = this.world.entity()
        addComponent(oreEntity, Ore, {
            ore: this._name
        })
        return oreEntity
    }
}
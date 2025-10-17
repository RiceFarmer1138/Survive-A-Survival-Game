import { World } from "@rbxts/jecs";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { Body, Data, HungerBar, Player, Starved, systemQueue, world } from "shared/utils/jecs/components";

// querying over players that don't have a hunger bar after their character and data loaded
const playersWithoutHunger = world.query(Player).with(Body, Data).without(HungerBar).cached();
const hungerQuery = world.query(HungerBar).cached();

/**
 * `updateHunger`
 * A system for updating and replenishing players' hunger
 */
export default function updateHunger(world: World) {
    // the current queue's delta time
    const deltaTime = systemQueue.getDeltaTime()

    // updating the hunger by time
    for (const [hungerEntity, hungerBar] of hungerQuery) {
        const { hunger, maxHunger, hungerRate } = hungerBar
        const newHunger = math.max(hunger - ( hungerRate * deltaTime), 0);

        // marks the entity dead once their hunger drops to 0
        if (newHunger === 0) addComponent(hungerEntity, Starved)
        addComponent(hungerEntity, HungerBar, {
            ...hungerBar,
            hunger: newHunger
        })
    }

    // adds the hunger bar to players without it
    for (const [bodyEntity] of playersWithoutHunger) {
        addComponent(bodyEntity, HungerBar, { hunger: 175, maxHunger: 175, hungerRate: 0.6 });
    }
}
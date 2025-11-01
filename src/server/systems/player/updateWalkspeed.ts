import type { World } from "@rbxts/jecs";
import { Body, WalkSpeed } from "shared/utils/jecs/components";

export default function UpdateWalkSpeed(world: World): void {
    for (const [bodyEntity] of world.query(Body).without(WalkSpeed)) {
        world.set(bodyEntity, WalkSpeed, ({
            walkSpeed: 16,
        }))
    }

    for (const [bodyEntity, { humanoid }, { walkSpeed }] of world.query(Body, WalkSpeed)) {
        humanoid.WalkSpeed = walkSpeed
    }
}
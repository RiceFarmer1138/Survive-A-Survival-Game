import { Entity, pair, Wildcard, World } from "@rbxts/jecs";
import { addComponent, ComponentDataFromEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Body, Launching, Occupant, Seat, SnowPlow, systemQueue, TargetEntity, world } from "shared/utils/jecs/components";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";



function prepareForLaunch(seat: VehicleSeat, vehicleModel: Model, occupantEntity: Entity, occupantBody: ComponentDataFromEntity<typeof Body>) {
    seat.Sit(occupantBody.humanoid)
    addComponent(occupantEntity, Launching)
}

const vehiclesToUpdate = world.query(SnowPlow, Seat).cached()

/**
 * `launchSnowPlow`
 * A system for manually setting up snow plow vehicle upon launching
 */
export default (world: World) => {
    const delta = systemQueue.getDeltaTime()

    // listens when the player wants to launch their vehicle
    useRoute("launchVehicle", (_, player) => {
        const playerEntity = player && getEntity.fromInstance(player)
        const body = playerEntity && world.get(playerEntity, Body)
        const snowPlowOwned = playerEntity && getEntity.getSnowPlow(playerEntity)
        const snowPlowComp = snowPlowOwned && world.contains(snowPlowOwned) && world.get(snowPlowOwned, SnowPlow)
        const seat = snowPlowComp && world.get(snowPlowOwned, Seat)
        if (player && playerEntity && body && snowPlowOwned && snowPlowComp && snowPlowComp.snowPlowModel && seat) {
            const snowPlowModel = snowPlowComp.snowPlowModel
            prepareForLaunch(seat.seat, snowPlowModel, playerEntity, body)
            print(world.get(snowPlowOwned, SnowPlow, Seat, pair(TargetEntity, Wildcard)))
        }
    })

    for (const [snowPlowEntity, { snowPlowModel, vehicle }, { seat }] of vehiclesToUpdate) {
        const attachments = snowPlowEntity
        const output = vehicle.GetOutput(delta, { throttleFloat: seat.ThrottleFloat, steerFloat: -seat.SteerFloat })
        
        snowPlowModel.Platform.BL.Orientation = new Vector3(0, output.angle, -90)
        snowPlowModel.Platform.BR.Orientation = new Vector3(0, output.angle + 180, 90)

        snowPlowModel.Platform.Cylinders.FL.AngularVelocity = -output.angularVelocity
        snowPlowModel.Platform.Cylinders.FR.AngularVelocity = output.angularVelocity
        snowPlowModel.Platform.Cylinders.BL.AngularVelocity = -output.angularVelocity
        snowPlowModel.Platform.Cylinders.BR.AngularVelocity = output.angularVelocity

        snowPlowModel.Platform.Cylinders.GetChildren().forEach((cylindrical) => {
            if (cylindrical.IsA("CylindricalConstraint")) {
                cylindrical.MotorMaxAngularAcceleration = output.maxAngularAccceleration
                cylindrical.MotorMaxTorque = output.maxTorque
            }
        })
    }
}
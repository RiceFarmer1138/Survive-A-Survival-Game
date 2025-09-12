import { Entity } from "@rbxts/jecs";

interface VehicleConfigs {

}

// Vehicle class
class Vehicle {
    // throttle acceleration modifier
    private readonly throttleAcceleration = 0.5

    // how far the wheel rotate
    private readonly steeringAngle = 45

     // setting torque
    private readonly torque = 3350

    // how fast the wheels turn
    private turnSpeed = 2

    private throttleFloat = 0
    private throttle= 0
    private steerFloat = 0
    private steer = 0
    private engineRPM = 0
    private readonly gearRatio = [3.587, 2.022, 1.384, 1.00]
    private gear = 0

    constructor(readonly occupant: Entity, private readonly root: VehicleSeat, private readonly wheels: Model[]) {

    }

    public GetOutput(delta: number, configs: { steerFloat: number, throttleFloat: number }) {
        if (configs) {
            this.SetThrottleFloat(configs.throttleFloat)
            this.SetSteerFloat(configs.steerFloat)
        }

        this.UpdateThrottle(delta)
        this.UpdateSteering(delta)
        this.UpdateGear()
        this.UpdateEngineRPM()

        return {
            angularVelocity: this.GetAngularVelocity(),
            angle: this.steer,
            maxTorque: this.torque * this.GetThrottleInfluance(),
            maxAngularAccceleration: 10 * this.GetThrottleInfluance()
        }
    }

    public UpdateThrottle(delta: number) {
        this.throttle += (this.throttleFloat - this.throttle) * math.min((delta * this.throttleAcceleration), 1)
    }

    public UpdateSteering( delta: number) {
        const turnSpeed = this.GetTurnSpeed()
        
        this.steer += ((this.steerFloat * this.steeringAngle) - this.steer) * math.min((delta * turnSpeed), 1)
    }

    public GetVelocityState() {
        if (this.throttleFloat === 0) {
            return "Neutral"
        } else if (this.throttleFloat < 0 && this.GetMoveDirection() > 0)
            return "Breaking"
         else {
            return "Accelerating"
         }
    }
    

    public GetThrottleInfluance() {
        const state = this.GetVelocityState()

        if (state === "Breaking") {
            return this.throttle * -19
        } else if (state === "Neutral") {
            return this.throttle
        } else {
            return 1
        }
    }

    public GetTurnSpeed(): number {
        if (this.steerFloat === 0) {
            this.turnSpeed = 10
        }

        const turnSpeed = this.turnSpeed / math.clamp(math.abs(this.steer), 1, 2)

	    return turnSpeed
    }

    public GetAngularVelocity() {
        return this.torque * this.throttle
    }

    public SetThrottleFloat(throttleFloat: number) {
        this.throttleFloat = throttleFloat
    }

    public SetSteerFloat(steerFloat: number) {
        this.steerFloat = steerFloat
    }

    public GetThrottle(): number {
        return this.throttleFloat
    }

    private GetAverageRPM() {
        const leftRPM = this.rpgsToRPM(this.wheels[0].PrimaryPart!.AssemblyAngularVelocity.Magnitude)
        const rightRPM = this.rpgsToRPM(this.wheels[1].PrimaryPart!.AssemblyAngularVelocity.Magnitude)

        return (leftRPM + rightRPM) / 2
    }

    private rpgsToRPM(n: number) {
        return n * 9.5493 * 4
    }

    private GetMoveDirection( ) {
        const  direction = -(this.root.CFrame.Rotation.Inverse().mul(this.root.AssemblyLinearVelocity)).Z
	    const moveDir = math.abs(direction) <= 0.001 ? 0 : math.sign(direction)
	return moveDir
    }

    private UpdateEngineRPM() {
        this.engineRPM = this.GetAverageRPM() * this.gearRatio[this.gear]
    }

    private UpdateGear() {
        if (this.engineRPM >= 2000) {
            for (let i = 0; i < this.gearRatio.size(); i++) {
                if (this.GetAverageRPM() * this.gearRatio[i] < 2000) {
                    this.gear = i
                    break
                }
            }
        }

        if (this.engineRPM <= 500) {
            for (let i = 0; i < this.gearRatio.size(); i++) {
                if (this.GetAverageRPM() * this.gearRatio[i] > 500) {
                    this.gear = i
                    break
                }
            }
        }
    }
}

export default Vehicle

import { Workspace } from "@rbxts/services";

export class CreateVisualizer {
    private attachment1: Attachment;
    private attachment0: Attachment;
    private container: Attachment;
    private beam: Beam;

    constructor(parent?: Instance) {
        const beam = new Instance("Beam"); // Creating the beam instance
        const container = new Instance("Attachment")

        // Creating the first attachment
        this.attachment0 = new Instance("Attachment");
        this.attachment0.Parent = container;

        // Creating the second attachment
        this.attachment1 = new Instance("Attachment");
        this.attachment1.Parent = container;

        // sets up beam
        beam.Parent = container;
        beam.Attachment0 = this.attachment0;
        beam.Attachment1 = this.attachment1;
        beam.FaceCamera = true
        beam.Width0 = 0.1; // Set the width of the beam at the first attachment
        beam.Width1 = 0.1; // Set the width of the beam at the second attachment
        beam.Transparency = new NumberSequence(0); // Set the transparency of the beam
        beam.Color = new ColorSequence(Color3.fromRGB(255, 0, 0)); // Set the color of the beam
        beam.LightEmission = 1; // Set the light emission of the beam
        this.beam = beam;

        // Creating the folder that will hold the attachments
        container.Name = "RayVisualizer";
        container.Parent = parent || Workspace.Terrain; // Default to Workspace if no parent is provided
        this.container = container;
    }

    // to change color
    public SetColor(color: Color3) {
        this.beam.Color = new ColorSequence(color); // Set the color of the beam
        return this
    }

    // Overloaded MoveTo method
    public MoveTo(origin: Vector3, unitDirection: Vector3, length?: number): void;
    public MoveTo(startPoint: Vector3, endPoint: Vector3): void;
    public MoveTo(startPoint: Vector3, directionOrEndPoint: Vector3, length?: number): void {
        if (length !== undefined) {
            // If length is provided, calculate the end point using the direction and length
            const direction = directionOrEndPoint.Unit; // Normalize the direction
            const endPoint = startPoint.add(direction.mul(length)); // Default length logic
            this.attachment1.WorldPosition = endPoint;
            this.attachment0.WorldPosition = startPoint;
        } else {
            // Otherwise, use the second method with start and end points
            this.attachment1.WorldPosition = directionOrEndPoint;
            this.attachment0.WorldPosition = startPoint;
        }
    }

    // Destroy the visualizer (remove the part and attachments)
    public Destroy() {
        this.container.Destroy();
    }
}

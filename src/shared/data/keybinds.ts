import { RunService } from "@rbxts/services";
import { Actions, InputState } from "@rbxts/spark";

export const inputState = new InputState();
export const actions = new Actions(["place-part", "rotate-part"]);

actions.setRebuildBindings((bindings) => {
	bindings.bind("place-part", Enum.UserInputType.MouseButton1, Enum.KeyCode.ButtonR1);
	bindings.bind("rotate-part", Enum.KeyCode.R);
});

RunService.BindToRenderStep("Spark", Enum.RenderPriority.Input.Value, () => {
	actions.update(inputState);
	inputState.clear();
});

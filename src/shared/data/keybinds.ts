import { RunService } from "@rbxts/services";
import { Actions, InputState } from "@rbxts/spark";

export const inputState = new InputState();
export const actions = new Actions(["sprint"]);

actions.setRebuildBindings((bindings) => {
	bindings.bind("sprint", Enum.KeyCode.LeftShift);
});

RunService.BindToRenderStep("Spark", Enum.RenderPriority.Input.Value, () => {
	actions.update(inputState);
	inputState.clear();
});

import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/ui/ui-paths";
import useEffect from "../hooks/use-effect";
import pageStates from "shared/utils/ui/state";
import { StarterGui, UserInputService, Workspace } from "@rbxts/services";
import { routes } from "shared/network";
import { placeItem } from "shared/data/clientEvents";

const SELECTED_COLOR = Color3.fromRGB(22, 22, 22);
const UNSELECTED_COLOR = Color3.fromRGB(61, 61, 61);

export default (pagePaths: PagePaths) => {
	const trash = new Janitor();
	const hotbarFrame = pagePaths.Inventory;
	const placeFrame = pagePaths.PlaceMobile
	const hotbarTemplate = hotbarFrame.UIGridLayout.Template;

	StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

	trash.Add(
		useEffect((newTrash) => {
			const inventoryTools = pageStates.inventoryItems();
			const hotbarSelected = pageStates.hotbarSelected();
			const hotbarSelectedIndex = hotbarSelected && inventoryTools.findIndex((toCheck) => toCheck.ItemName === hotbarSelected.ItemName);
			print(hotbarSelectedIndex, hotbarSelected)

			hotbarFrame.GetChildren().forEach((frame) => frame.IsA("Frame") && frame.Destroy());

			for (let i = 0; i < 9; i++) {
				const item = inventoryTools[i];
				const template = newTrash.Add(hotbarTemplate.Clone());

				if (item) {
					template.LayoutOrder = -i;
					template.HotbarSlot.Count.Text = tostring(item.Amount);
					template.HotbarSlot.ItemName.Text = item.ItemName;
					template.Visible = true;
					if (i === hotbarSelectedIndex) template.HotbarSlot.BackgroundColor3 = SELECTED_COLOR;
					template.Parent = hotbarFrame;

					newTrash.Add(
						template.HotbarSlot.Button.Activated.Connect((inputObj) => {
							if (
								inputObj.UserInputType === Enum.UserInputType.MouseButton1 ||
								inputObj.UserInputType === Enum.UserInputType.Touch
							) {
								if (!hotbarSelected) {
									pageStates.hotbarSelected(item);

									// unequiping the same item
								} else if (hotbarSelected && hotbarSelected.ItemName === item.ItemName) {
									pageStates.hotbarSelected(undefined);
								} else if (hotbarSelected && hotbarSelected.ItemName !== item.ItemName) {
									pageStates.hotbarSelected(item);
								}
							}
						}),
					);
				}
			}
		}),
	);

	const keyCodes = [
		Enum.KeyCode.One,
		Enum.KeyCode.Two,
		Enum.KeyCode.Three,
		Enum.KeyCode.Four,
		Enum.KeyCode.Five,
		Enum.KeyCode.Six,
		Enum.KeyCode.Seven,
		Enum.KeyCode.Eight,
		Enum.KeyCode.Nine,
	];
	trash.Add(
		UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (gameProcessed || !input.KeyCode) return;
			const inventoryTools = pageStates.inventoryItems();
			const selected = pageStates.hotbarSelected();
			const index = keyCodes.findIndex((k) => k.Name === input.KeyCode.Name);
			const item = index !== -1 ? inventoryTools[index] : undefined;
			if (item) {
				// equipping a new item
				if (!selected) {
					pageStates.hotbarSelected(item);

					// unequiping the same item
				} else if (selected && selected.ItemName === item.ItemName) {
					pageStates.hotbarSelected(undefined);

					// switching item
				} else if (selected && selected.ItemName !== item.ItemName) {
					pageStates.hotbarSelected(item);
				}
			}
		}),
	);

	trash.Add(useEffect((newTrash) => {
		const hotbarSelected = pageStates.hotbarSelected()
		if (hotbarSelected && !UserInputService.KeyboardEnabled) {
			placeFrame.Visible = true
		} else placeFrame.Visible = false
	}))

	trash.Add(placeFrame.PlaceButton.Activated.Connect((inputObj) => {
		print("activated", inputObj.UserInputType)
		if (inputObj.UserInputType === Enum.UserInputType.Touch) {
			placeItem.Fire()
		}
	}))

	return trash;
};

import { observe } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { Entity, World } from "@rbxts/jecs";
import {
	ContextActionService,
	ReplicatedStorage,
	RunService,
	TweenService,
	UserInputService,
	Workspace,
} from "@rbxts/services";
import Signal from "@rbxts/signal";
import { Tracer } from "@rbxts/tracer";
import useEffect from "client/app/hooks/use-effect";
import hotbarsPage from "client/app/pages/hotbarsPage";
import { ClientCamera, LocalCharacter, LocalPlayer } from "client/constants";
import { placeItem } from "shared/data/clientEvents";
import { actions } from "shared/data/keybinds";
import { routes } from "shared/network";
import paths from "shared/paths";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { areItemsOverlapping } from "shared/utils/functions/placementFunctions";
import { RayParams, rayParamsFilter } from "shared/utils/functions/rayFunctions";
import { Plot } from "shared/utils/jecs/components";
import { useChange } from "shared/utils/jecs/plugins/hooks/use-change";
import { useEvent } from "shared/utils/jecs/plugins/hooks/use-event";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";
import { useThrottle } from "shared/utils/jecs/plugins/hooks/use-throttle";
import pageStates from "shared/utils/ui/state";

const mouse = LocalPlayer.GetMouse();
export const placeSignal = new Signal();
const trash = new Janitor();
let placementRotationY: number = 0;
let fakeModel: BasePart | undefined;
let highlight: Highlight | undefined;
let goalCFrame: CFrame | undefined;

const highlightTween = (passed: boolean | undefined) => {
	if (highlight) {
		trash
			.Add(
				TweenService.Create(highlight, new TweenInfo(0.3, Enum.EasingStyle.Cubic), {
					FillColor: passed === true ? new Color3(0, 1, 0.22) : new Color3(1, 0, 0),
					OutlineColor: passed === true ? new Color3(0, 0.5, 0) : new Color3(0.5, 0, 0),
				}),
			)
			.Play();
	}
};

/**
 * Snaps a CFrame to the nearest grid unit relative to a given origin CFrame.
 * The object's rotation is preserved, and the pivot point is snapped to the grid.
 *
 * @param originCFrame - The CFrame defining the grid's origin and orientation.
 * @param objectCFrame - The object's CFrame to be snapped.
 * @param gridSize - Size of one grid unit (default: 1)
 * @returns A new CFrame snapped to the grid, preserving rotation.
 */
export function getSnappedGridCFrame(originCFrame: CFrame, objectCFrame: CFrame, gridSize = 1): CFrame {
	// Convert object's world position into the local space of the grid
	const localPos = originCFrame.PointToObjectSpace(objectCFrame.Position);

	// Snap the local coordinates to the nearest grid step
	const snappedLocalX = math.floor(localPos.X / gridSize + 0.5) * gridSize;
	const snappedLocalY = math.floor(localPos.Y / gridSize + 0.5) * gridSize;
	const snappedLocalZ = math.floor(localPos.Z / gridSize + 0.5) * gridSize;

	const snappedLocalPos = new Vector3(snappedLocalX, snappedLocalY, snappedLocalZ);

	// Convert the snapped position back into world space
	const snappedWorldPos = originCFrame.PointToWorldSpace(snappedLocalPos);

	// Extract rotation from the original object's CFrame
	const [_, __, ___, R00, R01, R02, R10, R11, R12, R20, R21, R22] = objectCFrame.GetComponents();

	// Return a new CFrame with snapped position and original rotation
	return new CFrame(
		snappedWorldPos.X,
		snappedWorldPos.Y,
		snappedWorldPos.Z,
		R00,
		R01,
		R02,
		R10,
		R11,
		R12,
		R20,
		R21,
		R22,
	);
}

export function clampCFrameToBounds(
	objectCFrame: CFrame,
	objectSize: Vector3,
	boundsCFrame: CFrame,
	boundsSize: Vector3,
): CFrame {
	const localPos = boundsCFrame.PointToObjectSpace(objectCFrame.Position);

	const objectRight = objectCFrame.RightVector.Abs().mul(objectSize.X);
	const objectUp = objectCFrame.UpVector.Abs().mul(objectSize.Y);
	const objectLook = objectCFrame.LookVector.Abs().mul(objectSize.Z);
	const rotatedSize = objectRight.add(objectUp).add(objectLook);
	const objectHalf = rotatedSize.div(2);
	const boundsHalf = boundsSize.div(2);

	const minX = -boundsHalf.X + objectHalf.X;
	const maxX = boundsHalf.X - objectHalf.X;

	const minZ = -boundsHalf.Z + objectHalf.Z;
	const maxZ = boundsHalf.Z - objectHalf.Z;

	const clampedX = minX > maxX ? 0 : math.clamp(localPos.X, minX, maxX);
	const clampedY = localPos.Y;
	const clampedZ = minZ > maxZ ? 0 : math.clamp(localPos.Z, minZ, maxZ);

	const clampedLocalPos = new Vector3(clampedX, clampedY, clampedZ);
	const clampedWorldPos = boundsCFrame.PointToWorldSpace(clampedLocalPos);

	const [_, __, ___, R00, R01, R02, R10, R11, R12, R20, R21, R22] = objectCFrame.GetComponents();
	return new CFrame(
		clampedWorldPos.X,
		clampedWorldPos.Y,
		clampedWorldPos.Z,
		R00,
		R01,
		R02,
		R10,
		R11,
		R12,
		R20,
		R21,
		R22,
	);
}

/**
 * `inventoryUpdate`
 * A system that handles placement for vehicle parts
 */
export default (world: World) => {
	const serverEntity = LocalCharacter.GetAttribute("ServerId") as Entity;
	const clientEntity = serverEntity && getEntity.replicatedFromServerEntity(serverEntity);
	const plotComp = clientEntity && world.get(clientEntity, Plot);
	const hotbarSelected = pageStates.hotbarSelected();
	const inventoryItems = pageStates.inventoryItems();
	const itemSelected = inventoryItems.findIndex(
		(toCheck) => hotbarSelected && toCheck.ItemName === hotbarSelected.ItemName,
	);
	const realItem = inventoryItems[itemSelected];
	const rotatePart = actions.pressed("rotate-part");
	const mouseLocation = UserInputService.GetMouseLocation();

	useRoute("updateInventory", (inventory) => {
		pageStates.inventoryItems(inventory);
	});

	if (useChange([hotbarSelected, plotComp, realItem])) {
		if (!realItem) {
			pageStates.hotbarSelected(undefined);
		}

		if (hotbarSelected && plotComp) {
			function createTool(toolName: string) {
				LocalCharacter.FindFirstChildOfClass("Tool")?.Destroy();
				const tool = trash.Add(paths.Assets.Tools[toolName as TowVehicleTool].Clone());
				(tool.FindFirstChild("Handle") as BasePart).PivotTo((LocalCharacter.FindFirstChild("RightHand") as BasePart).GetPivot())
				tool.Parent = LocalCharacter;
			}

			function makeHighlight(parent: Instance) {
				// sets up highlight
				highlight = trash.Add(new Instance("Highlight"));
				highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
				highlight.Name = "Highlight";
				highlight.Adornee = parent;
				highlight.FillColor = new Color3(0, 1, 0.22);
				highlight.OutlineColor = new Color3(0, 0.5, 0);
				highlight.FillTransparency = 0.5;
				highlight.OutlineTransparency = 0;
				highlight.Parent = parent;
			}

			fakeModel?.Destroy();
			const plotFloor = plotComp.plot.Base.SnowPlowerSpawn;
			fakeModel = hotbarSelected && trash.Add(paths.Assets.SnowPlow.Parts[hotbarSelected.ItemName].Clone());
			fakeModel.GetDescendants().forEach((descendant) => {
				if (descendant.IsA("BasePart")) {
					descendant.CanCollide = false;
					descendant.CollisionGroup = "NoCollision";
				}
			});
			fakeModel.PivotTo(plotFloor.GetPivot().mul(CFrame.Angles(0, math.rad(placementRotationY), 0)));
			fakeModel.Parent = paths.Map;

			makeHighlight(fakeModel);
			createTool(fakeModel.Name);
		} else if (realItem === undefined || realItem.Amount <= 1) {
			fakeModel?.Destroy();
			LocalCharacter.FindFirstChildOfClass("Tool")?.Destroy();
		}
	}

	for (const [inputObj, gamePc] of useEvent(UserInputService.InputBegan)) {
		if (
			!gamePc &&
			inputObj.UserInputType === Enum.UserInputType.MouseButton1 &&
			goalCFrame &&
			plotComp &&
			plotComp.plot &&
			fakeModel &&
			hotbarSelected &&
			!areItemsOverlapping(paths.Map.Placement.GetChildren() as TowVehiclePartModel[], fakeModel, goalCFrame, fakeModel.Size.div(2))
		) {
			const orientation = goalCFrame.ToOrientation();
			const rotation = CFrame.Angles(0, math.rad(placementRotationY), 0);
			routes.placePart.send({
				vehiclePart: hotbarSelected,
				vehicleLocation: { position: goalCFrame.Position, orientation, rotation },
			});
		}
	}

	if (useThrottle(0.01) && ClientCamera && fakeModel && plotComp && plotComp.plot && realItem) {
		const plotFloor = plotComp.plot.Base;
		const platformDirection = plotFloor.GetPivot().LookVector;
		const viewportRay = ClientCamera.ViewportPointToRay(mouseLocation.X, mouseLocation.Y);
		const hitResult = Tracer.ray(
			UserInputService.KeyboardEnabled ? viewportRay.Origin : ClientCamera.CFrame.Position,
			UserInputService.KeyboardEnabled ? viewportRay.Direction : ClientCamera.CFrame.LookVector,
			1000,
		)
			.useRaycastParams(rayParamsFilter([plotFloor, paths.Map.Placement], Enum.RaycastFilterType.Include))
			.run();
		const hitObj = hitResult.hit?.IsDescendantOf(plotComp.plot) ? plotFloor : hitResult.hit;
		const hitSize = hitObj && hitObj.Size;
		const hitCF = hitObj && hitObj.CFrame;
		const fullSize = fakeModel.Size
		const halfSize = fullSize.div(2);

		if (hitObj && hitSize && hitCF) {
			const localHitPos = hitCF.PointToObjectSpace(hitResult.position);
			const worldPos = hitCF.PointToWorldSpace(localHitPos);
			const goalPos = new Vector3(worldPos.X, hitCF.Position.Y, worldPos.Z);
			const testCFrame = CFrame.lookAlong(goalPos, platformDirection, Vector3.yAxis);
			const finalCFrame = clampCFrameToBounds(
				testCFrame,
				fullSize,
				plotFloor.CFrame,
				plotFloor.Size.add(Vector3.yAxis.mul(1000)),
			);
			const modelPivot = fakeModel.GetPivot();
			const normal = hitResult.normal;
			const isWheel = fakeModel.Name.find("Wheel")[0] === undefined
			let slideCF: CFrame | undefined;
			let targetY: number | undefined;
			let chosenCframe: CFrame | undefined;

			if (hitObj.IsDescendantOf(plotComp.plot)) {
				// plain movement
				targetY = hitCF.Position.Y + hitSize.Y / 2;
				const snappedXZ = getSnappedGridCFrame(
					plotFloor.CFrame,
					slideCF !== undefined ? slideCF : finalCFrame,
					!fakeModel.Name.find("Block") || !fakeModel.Name.find("Seat")
						? 1 + math.max(halfSize.X - math.floor(fullSize.X), halfSize.Z - math.floor(fullSize.Z))
						: 1,
				);
				const finalY = slideCF ? slideCF.Position.Y : targetY!;
				chosenCframe = slideCF ? slideCF : new CFrame(snappedXZ.X, finalY + halfSize.Y, snappedXZ.Z);

				// side placement
			} else if (normal.Y === 0) {
				const finalCF = (hitObj as BasePart).Position.add(normal.mul(fullSize));
				const snappedCF = getSnappedGridCFrame(plotFloor.CFrame, new CFrame(finalCF), 1);
				const rotationCFrame = CFrame.lookAlong(Vector3.zero, normal.mul(-1), Vector3.yAxis);
				chosenCframe = new CFrame(snappedCF.X, finalCF.Y, snappedCF.Z);
				chosenCframe = clampCFrameToBounds(
					chosenCframe,
					fullSize,
					plotFloor.CFrame,
					plotFloor.Size.add(Vector3.yAxis.mul(1000)),
				);
			} else {
				// stacking
				const hitTopY = hitCF.Position.Y + hitSize.Y / 2;
				targetY = hitTopY;
				const snappedXZ = getSnappedGridCFrame(
					plotFloor.CFrame,
					slideCF !== undefined ? slideCF : finalCFrame,
					!fakeModel.Name.find("Block") || !fakeModel.Name.find("Seat")
						? 1 + math.max(halfSize.X - math.floor(fullSize.X), halfSize.Z - math.floor(fullSize.Z))
						: 1,
				);
				const finalY = slideCF ? slideCF.Position.Y : targetY!;
				chosenCframe = slideCF ? slideCF : new CFrame(snappedXZ.X, finalY + halfSize.Y, snappedXZ.Z);
			}

			if (chosenCframe) {
				chosenCframe =
					fakeModel.Name.find("Block")[0] === undefined || fakeModel.Name.find("Wheel")[0] === undefined
						? chosenCframe.mul(CFrame.Angles(0, math.rad(placementRotationY), 0))
						: chosenCframe;
				fakeModel.PivotTo(chosenCframe);
				goalCFrame = chosenCframe;

				highlightTween(
					areItemsOverlapping(
						paths.Map.Placement.GetChildren() as TowVehiclePartModel[],
						fakeModel,
						chosenCframe,
						halfSize
					)
						? false
						: true,
				);
			}
		}
	}
	// rotating

	useMemo(() => {
		print(hotbarSelected);
		if (hotbarSelected) {
			ContextActionService.BindAction(
				"Rotate",
				(_, state, inputObj) => {
					print("rotating test");
					if (state === Enum.UserInputState.Begin) {
						if (
							fakeModel?.Name.find("Block")[0] === undefined &&
							goalCFrame &&
							plotComp &&
							plotComp.plot &&
							hotbarSelected
						) {
							placementRotationY = placementRotationY >= 360 ? 0 : placementRotationY + 90;
						}
					}
				},
				true,
				Enum.KeyCode.R,
			);
			ContextActionService.SetPosition("Rotate", UDim2.fromScale(0.79, 0.2));
			ContextActionService.SetTitle("Rotate", "Rotate");
			placeItem.Connect(() => {
				print("received")
				if (goalCFrame &&
			plotComp &&
			plotComp.plot &&
			fakeModel &&
			hotbarSelected &&
			!areItemsOverlapping(paths.Map.Placement.GetChildren() as TowVehiclePartModel[], fakeModel, goalCFrame, fakeModel.Size.div(2))) {
				const orientation = goalCFrame.ToOrientation();
			const rotation = CFrame.Angles(0, math.rad(placementRotationY), 0);
			routes.placePart.send({
				vehiclePart: hotbarSelected,
				vehicleLocation: { position: goalCFrame.Position, orientation, rotation },
			});
			}
			})
		} else ContextActionService.UnbindAction("Rotate");
		ContextActionService;
	}, [hotbarSelected]);

	
};
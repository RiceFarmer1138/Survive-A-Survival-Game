import jabby from "@rbxts/jabby";
import type { Entity, World } from "@rbxts/jecs";
import PlankJabbyPlugin from "@rbxts/planck-jabby";
import type { SystemFn, SystemTable } from "@rbxts/planck/out/types";
import { ContextActionService, Players, RunService } from "@rbxts/services";

import { routes } from "shared/network";

import { hotReloader, ModelDebugger, systemQueue, world } from "./components";
import { PlanckHooksPlugin } from "./plugins";
import { setupLogger } from "./setupLogger";

const IS_SERVER_CONTEXT = RunService.IsServer();

export function getInstanceByName(fullName: string): Instance | undefined {
	const pathParts = fullName.split(".");

	let currentInstance: Instance | undefined = game;

	for (const partName of pathParts) {
		if (currentInstance) {
			const child = currentInstance.FindFirstChild(partName) as Instance

			if (child) {
				currentInstance = child;
			}
		}
	}

	return currentInstance;
}

function transformPath(inputPath: string): string {
	const [findResult] = inputPath.find("PlayerScripts.");
	const startIndex = findResult !== undefined && findResult !== -1 ? findResult + "PlayerScripts.".size() - 1 : 0;
	const endIndexOfP1 = inputPath.size();
	const newString = inputPath.sub(startIndex, endIndexOfP1);

	return `StarterPlayer.StarterPlayerScripts${newString}`;
}

function hotReload(systems: Array<SystemTable<[World]>>) {
	for (const systemStruct of systems) {
		const systemModule = getInstanceByName(debug.info(systemStruct.system, "s")[0]);
		// if system mod descendant of players
		if (systemModule) {
			if (systemModule.IsDescendantOf(Players)) {
				let systemToRemove: SystemFn<[World]> | SystemTable<[World]>;
				const scriptToWatch = getInstanceByName(transformPath(debug.info(systemStruct.system, "s")[0]));
				let oldSystem: Instance;

				// for reloading the system
				hotReloader.listen(
					scriptToWatch as ModuleScript,
					(newSystemModule) => {
						if (!newSystemModule.IsA("ModuleScript")) {
							return;
						}

						const theSystem = (
							require(newSystemModule) as { default: SystemFn<[World]> | SystemTable<[World]> }
						).default;
						const toInput = !typeIs(theSystem, "function")
							? theSystem
							: {
									...systemStruct,
									system: theSystem,
								};

						// adds the system
						systemQueue.addSystem(toInput);
						systemToRemove = toInput;
						if (oldSystem) {
							routes.getReplicatedComponents.send();
						}
						// systemQueue.addSystem(systemStruct.system,
						// systemStruct.phase || Phase.Update)
					},
					(oldSystemModule) => {
						if (!oldSystemModule.IsA("ModuleScript")) {
							return;
						}

						// removes the system
						systemQueue.removeSystem(systemToRemove);
						oldSystem = oldSystemModule;
					},
				);
			} else {
				let systemToRemove: SystemFn<[World]> | SystemTable<[World]>;

				// for reloading the system
				hotReloader.listen(
					systemModule as ModuleScript,
					(newSystemModule) => {
						if (!newSystemModule.IsA("ModuleScript")) {
							return;
						}

						const theSystem = (
							require(newSystemModule) as { default: SystemFn<[World]> | SystemTable<[World]> }
						).default;
						const toInput = !typeIs(theSystem, "function")
							? theSystem
							: {
									...systemStruct,
									system: theSystem,
								};

						// adds the system
						systemQueue.addSystem(toInput);
						systemToRemove = toInput;
					},
					(oldSystemModule) => {
						if (!oldSystemModule.IsA("ModuleScript")) {
							return;
						}

						systemQueue.removeSystem(systemToRemove);
					},
				);
			}
		}
	}
}

export function start(systems: Array<SystemTable<[World]>>) {
	jabby.register({
		applet: jabby.applets.world,
		configuration: {
			get_entity_from_part: (part) => {
				for (const [entity, model] of world.query(ModelDebugger)) {
					if (part.IsDescendantOf(model) || part === model) {
						return [entity, (model.IsA("Model") && model.PrimaryPart) || part] as LuaTuple<[Entity, Part]>;
					}
				}

				return [undefined, part] as unknown as LuaTuple<[Entity, Part]>;
			},
			world,
		},
		name: `World ${IS_SERVER_CONTEXT ? "Server" : "Client"}`,
	});

	jabby.set_check_function((player) => {
		return true;
		// TODO: make this only for admins
	});

	systemQueue.addPlugin(new PlankJabbyPlugin()).addPlugin(new PlanckHooksPlugin());
	hotReload(systems);
	setupLogger();

	if (IS_SERVER_CONTEXT) {
		jabby.broadcast_server();
	} else {
		const player_ui = Players.LocalPlayer.WaitForChild("PlayerGui");
		const jabby_client = jabby.obtain_client();
		ContextActionService.BindAction(
			"Open Jabby Home",
			(actionName: string, state: Enum.UserInputState) => {
				if (state !== Enum.UserInputState.Begin) {
					return;
				}

				jabby_client.spawn_app(jabby_client.apps.home);
			},
			false,
			Enum.KeyCode.F4,
		);
	}

	return debug;
}

import type Phase from "@rbxts/planck/out/Phase";
import type Scheduler from "@rbxts/planck/out/Scheduler";
import type { Plugin, SystemFn } from "@rbxts/planck/out/types";

import { start } from "./topo";

interface ModuleInfo {
	nameToSystem: Map<string, SystemFn<Array<unknown>>>;
	systemToName: Map<SystemFn<Array<unknown>>, string>;
}
type Cleanup<T> = (state: T) => boolean;
interface HookStorage<T> {
	cleanup?: Cleanup<T>;
	states: Map<string, T>;
}
export class PlanckHooksPlugin implements Plugin {
	private readonly phaseData = new Map<
		Phase,
		{
			currentTime: number;
			deltaTime: number;
			lastTime: number;
		}
	>();
	private readonly systemData = new Map<
		SystemFn<Array<unknown>>,
		{
			data: Record<string, HookStorage<unknown>>;
			deltaTime: number;
			logs: Array<unknown>;
			system: SystemFn<Array<unknown>>;
		}
	>();

	build(schedular: Scheduler<Array<unknown>>): void {
		for (const phase of schedular._orderedPhases) {
			this.setupPhase(phase);
		}

		schedular._addHook(schedular.Hooks.PhaseBegan, (phase) => {
			this.updatePhase(phase);
		});
		schedular._addHook(schedular.Hooks.SystemAdd, (info) => {
			const SystemInfo = info.system;
			const { system } = SystemInfo;
			this.systemData.set(system, { data: {}, deltaTime: 0, logs: [], system });
		});
		schedular._addHook(schedular.Hooks.SystemRemove, (info) => {
			const SystemInfo = info.system;
			const { system } = SystemInfo;
			this.systemData.delete(system);
		});
		schedular._addHook(schedular.Hooks.SystemReplace, (info) => {
			const oldSystemInfo = info.old;
			const newSystemInfo = info.new;
			const oldSystem = oldSystemInfo.system;
			const newSystem = newSystemInfo.system;
			const data = this.systemData.get(oldSystem);
			assert(data !== undefined, "System data not found");
			this.systemData.delete(oldSystem);
			this.systemData.set(newSystem, data);
		});
		schedular._addHook(schedular.Hooks.OuterSystemCall, (info) => {
			const { system } = info.system;
			const { phase } = info.system;
			const { nextFn } = info;
			const phaseData = this.phaseData.get(phase);
			assert(phaseData !== undefined, "Phase data not found"); // Should never happen
			const data = this.systemData.get(system);
			if (!data) {
				return () => {};
			}

			assert(data !== undefined, "System data not found"); // Should never happen
			data.deltaTime = phaseData.deltaTime;
			return () => {
				start(data.data, data, () => {
					nextFn();
				});
			};
		});
	}

	private setupPhase(phase: Phase): void {
		this.phaseData.set(phase, {
			currentTime: os.clock(),
			deltaTime: 0,
			lastTime: os.clock(),
		});
	}

	private updatePhase(phase: Phase): void {
		let data = this.phaseData.get(phase);
		if (data === undefined) {
			this.setupPhase(phase);
			data = this.phaseData.get(phase)!;
		}

		data.deltaTime = data.currentTime - data.lastTime;
		data.lastTime = data.currentTime;
		data.currentTime = os.clock();
	}
}

import { useHookState } from "../topo";
import { useChange } from "./use-change";

interface Storage {
	dependencies?: unknown[];
	cleanup?: () => boolean;
}

export function useEffect(
	effect: (() => void) | (() => () => boolean),
	dependencies: unknown[],
	discriminator: unknown,
): void {
	const storage = useHookState<Storage>(discriminator, (state) => {
		const value = state.cleanup?.();
		return value === undefined ? false : value;
	});

	if (!dependencies || useChange(dependencies, storage)) {
		storage.dependencies = dependencies;
		const cleanup = effect();
		if (cleanup) {
			storage.cleanup = cleanup;
		}
	}
}
import { useHookState } from "../topo";
import { useChange } from "./use-change";

interface Storage {
	cleanup?: () => boolean;
	dependencies?: Array<unknown>;
}

export function useEffect(
	effect: (() => () => boolean) | (() => void),
	dependencies: Array<unknown>,
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

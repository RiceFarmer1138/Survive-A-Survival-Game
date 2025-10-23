import { equals } from "@rbxts/phantom/src/Array";

import { useHookState } from "../topo";

interface storage {
	dependencies?: ReadonlyArray<unknown>;
}

export function useChange(dependencies: ReadonlyArray<unknown>, discriminator?: unknown): boolean {
	const storage = useHookState<storage>(discriminator);
	const previous = storage.dependencies;
	storage.dependencies = dependencies;
	return !equals(previous, dependencies);
}

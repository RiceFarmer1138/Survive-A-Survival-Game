import paths from "shared/paths";

export function rayParamsFilter(included: Array<Instance>, filter: Enum.RaycastFilterType) {
	const rayParameters = new RaycastParams();
	rayParameters.FilterType = filter;
	rayParameters.FilterDescendantsInstances = included;

	return rayParameters;
}

export const RayParams = {
	Include: {
		Map: rayParamsFilter(paths.Map ? [paths.Map] : [], Enum.RaycastFilterType.Include),
	},
};

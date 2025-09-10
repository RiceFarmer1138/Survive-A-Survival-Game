import paths from "shared/paths";

export function rayParamsFilter(included: Instance[], filter: Enum.RaycastFilterType) {
	const rayParams = new RaycastParams();
	rayParams.FilterType = filter;
	rayParams.FilterDescendantsInstances = included;

	return rayParams;
}

export const RayParams = {
	Include: {
		Map: rayParamsFilter(paths.Map ? [paths.Map] : [], Enum.RaycastFilterType.Include),
	},
};
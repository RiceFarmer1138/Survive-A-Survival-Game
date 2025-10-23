import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";

function useEffect(callback: (trash: Janitor) => void) {
	return effect(() => {
		const newTrash = new Janitor();
		callback(newTrash);
		return () => {
			newTrash.Destroy?.();
		};
	});
}

export default useEffect;

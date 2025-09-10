import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";


export default (callback: (trash: Janitor) => void) => {
    return effect(() => {
        const newTrash = new Janitor();
        callback(newTrash);
        return () => newTrash.Destroy?.();
    })
}
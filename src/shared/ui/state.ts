import { type Atom, atom } from "@rbxts/charm";

export const State = {
	day: atom(1),
	hungerState: atom({ statAmount: 100, statMaxAmount: 100 }) as Atom<{ statAmount: number, statMaxAmount: number }>,
	thirstState:  atom({ statAmount: 100, statMaxAmount: 100 }) as Atom<{ statAmount: number, statMaxAmount: number }>,
	uiScale: atom(1.25),
};

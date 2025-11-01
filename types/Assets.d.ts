type Assets = Folder & {
	Ore: Folder & {
		GoldOre: Model & {};
		IronOre: Model & {};
	};
	Tree: Model & {}
	UI: Folder & {
		GameUI: ScreenGui & {};
	};
};

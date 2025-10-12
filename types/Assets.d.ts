type Assets = Folder & {
	SnowPlow: Folder & {
		Parts: Folder & {
			["All-Terrain Wheels"]: BasePart & {};
			["Black Hole Engine"]: BasePart & {};
			["Fuel Canister"]: BasePart & {};
			["Heavy Duty Wheels"]: BasePart & {};
			["Large Fuel Tank"]: BasePart & {};
			["Mega Fuel Tank"]: BasePart & {};
			["Mini Plow Blade"]: BasePart & {};
			["Rocket Booster"]: BasePart & {};
			["Seat"]: BasePart & {};
			["Small Fuel Tank"]: BasePart & {};
			["Snow Shredder"]: BasePart & {};
			["Standard Wheel"]: BasePart & {};
			["Steel Block"]: BasePart & {};
			["Strong Snow Shredder"]: BasePart & {};
			["Super Engine"]: BasePart & {};
			["Wide Plow Blade"]: BasePart & {};
			["WoodenBlock"]: BasePart & {};
		};
		StarterSnowPlow: Model & {
			Seat: VehicleSeat

			Platform: BasePart & {
				Springs: Folder & {
					FR: SpringConstraint;
					FL: SpringConstraint;
					BR: SpringConstraint;
					BL: SpringConstraint;
				};
				Cylinders: Folder & {
					FR: CylindricalConstraint;
					FL: CylindricalConstraint;
					BR: CylindricalConstraint;
					BL: CylindricalConstraint;
				};

				FR: Attachment
			FL: Attachment
			BR: Attachment
			BL: Attachment
			}
		};
	};
	UI: Folder & {
		GameUI: ScreenGui & {
			ShopUI: ScreenGui & {
				Common: Frame & {
					Layout: ImageLabel & {
						PictureFrame: Frame & {
							PictureFrame: ImageLabel & {
								ItemImage: ImageLabel;
							};
						};

						Common1: ImageLabel;
						Description: TextLabel;
						ItemName: TextLabel;
						ItemPrice: TextLabel;
						ItemStock: TextLabel;
					};
				};
				Uncommon: Frame & {
					Layout: ImageLabel & {
						PictureFrame: Frame & {
							PictureFrame: ImageLabel & {
								ItemImage: ImageLabel;
							};
						};

						Common1: ImageLabel;
						Description: TextLabel;
						ItemName: TextLabel;
						ItemPrice: TextLabel;
						ItemStock: TextLabel;
					};
				};
				Rare: Frame & {
					Layout: ImageLabel & {
						PictureFrame: Frame & {
							PictureFrame: ImageLabel & {
								ItemImage: ImageLabel;
							};
						};

						Common1: ImageLabel;
						Description: TextLabel;
						ItemName: TextLabel;
						ItemPrice: TextLabel;
						ItemStock: TextLabel;
					};
				};
				Mythic: Frame & {
					Layout: ImageLabel & {
						PictureFrame: Frame & {
							PictureFrame: ImageLabel & {
								ItemImage: ImageLabel;
							};
						};

						Common1: ImageLabel;
						Description: TextLabel;
						ItemName: TextLabel;
						ItemPrice: TextLabel;
						ItemStock: TextLabel;
					};
				};
				Eternal: Frame & {
					Layout: ImageLabel & {
						PictureFrame: Frame & {
							PictureFrame: ImageLabel & {
								ItemImage: ImageLabel;
							};
						};
						Common1: ImageLabel;
						Description: TextLabel;
						ItemName: TextLabel;
						ItemPrice: TextLabel;
						ItemStock: TextLabel;
					};
				};
				MainLayout: Frame & {
					NewBlockLayout: Frame & {
						X: ImageButton;
						RestockButton: ImageButton;
						Restock: TextLabel;
					};
					ScrollingFrame: ScrollingFrame & {
						UIListLayout: UIListLayout & {
							BuyFrame: Frame & {
								CoinsBuy: ImageButton;
							};
						};
					};
				};
			};
			MainUI: ScreenGui & {
				Inventory: Frame & {
					UIGridLayout: UIGridLayout & {
						Template: ImageLabel & {
							HotbarSlot: Frame & {
								Button: TextButton;
								Count: TextLabel;
								ItemName: TextLabel;
							};
						};
					};
				};
				Place: Frame & {
					PlaceButton: ImageButton;
				};
				Launch: Frame & {
					LaunchButton: ImageButton;
				};
			};
		};
	};
	Tools: Folder & {
		["All-TerrainWheels"]: Tool;
	};
};

type Assets = Folder & {
	SnowPlow: Folder & {
		Parts: Folder & {
			["All-Terrain Wheels"]: Model & {};
			["Black Hole Engine"]: Model & {};
			["Fuel Canister"]: Model & {};
			["Heavy Duty Wheels"]: Model & {};
			["Large Fuel Tank"]: Model & {};
			["Mega Fuel Tank"]: Model & {};
			["Mini Plow Blade"]: Model & {};
			["Rocket Booster"]: Model & {};
			["Seat"]: Model & {};
			["Small Fuel Tank"]: Model & {};
			["Snow Shredder"]: Model & {};
			["Standard Wheel"]: Model & {};
			["Steel Block"]: Model & {};
			["Strong Snow Shredder"]: Model & {};
			["Super Engine"]: Model & {};
			["Wide Plow Blade"]: Model & {};
			["WoodenBlock"]: Model & {};
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

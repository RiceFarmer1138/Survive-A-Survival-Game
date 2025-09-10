import { t } from "@rbxts/t"
import paths from "shared/paths"
import imageIds from "./imageId"

const partsDescription: { [key in TowVehiclePartName]: string } = {
    ["WoodenBlock"]: "Basic lightweight structure piece. (structure)",
    ["Seat"]: "Seat your character to control the plow. (structure)",
    ["Standard Wheel"]: "Basic rubber wheels for movement. (speed)",
    ["Small Fuel Tank"]: "Tiny fuel supply for short runs. (fuel)",
    ["Steel Block"]: "Stronger structure, heavier but tougher. (structure)",
    ["Fuel Canister"]: "Extends plow trips slightly. (fuel)",
    ["Mini Plow Blade"]: "Clears small snow paths. (plow)",
    ["All-Terrain Wheels"]: "Better traction on ice and snow. (speed)",
    ["Snow Shredder"]: "Breaks down icy chunks of snow. (progression)",
    ["Wide Plow Blade"]: "Clears bigger snow lanes. (plow)",
    ["Heavy Duty Wheels"]: "Extra durability and grip in deep snow. (speed)",
    ["Large Fuel Tank"]: "Enough for long journeys. (fuel)",
    ["Strong Snow Shredder"]: "Cuts through packed snow and ice. (progression)",
    ["Super Engine"]: "Massive speed boost for the plow. (speed)",
    ["Mega Fuel Tank"]: "Gigantic fuel upgrade; lasts way longer than any tank. (fuel)",
    ["Rocket Booster"]: "Temporary extreme speed burst on activation. (short speed)",
    ["Black Hole Engine"]: "Super fast engine that bends space and zooms your plow forward! (speed"
}

const partsPrices: { [key in TowVehiclePartName]: number } = {
    ["WoodenBlock"]: 0,
   ["Seat"]: 75,
   ["Standard Wheel"]: 50,
   ["Small Fuel Tank"]: 25,
   ["Steel Block"]: 100,
   ["Fuel Canister"]: 150,
   ["Mini Plow Blade"]: 200,
   ["All-Terrain Wheels"]: 400,
   ["Snow Shredder"]: 600,
   ["Wide Plow Blade"]: 800,
   ["Heavy Duty Wheels"]: 1200,
   ["Large Fuel Tank"]: 1600,
    ["Mega Fuel Tank"]: 10000,
   ["Strong Snow Shredder"]: 2000,
   ["Super Engine"]: 5000,
   ["Rocket Booster"]: 15000,
   ["Black Hole Engine"]: 25000,
}

const partRaritesLookup: { [key in TowVehiclePartName]: TowVehicleRarity }  = {
    ["WoodenBlock"]: "Common",
    ["Seat"]: "Common",
    ["Standard Wheel"]: "Common",
    ["Small Fuel Tank"]: "Common",

    ["Steel Block"]: "Uncommon",
    ["Fuel Canister"]: "Uncommon",
    ["Mini Plow Blade"]: "Uncommon",
    ["All-Terrain Wheels"]: "Uncommon",

    ["Snow Shredder"]: "Rare",
    ["Wide Plow Blade"]: "Rare",
    ["Heavy Duty Wheels"]: "Rare",
    ["Large Fuel Tank"]: "Rare",

    ["Strong Snow Shredder"]: "Mythic",
    ["Super Engine"]: "Mythic",

    ["Mega Fuel Tank"]: "Eternal",
    ["Rocket Booster"]: "Eternal",
    ["Black Hole Engine"]: "Eternal"
}

const partsData = [] as TowVehiclePart[]
paths.Assets.SnowPlow.Parts.GetChildren().forEach((part) => {
    const name = part.Name as TowVehiclePartName

    partsData.push({
        Name: name,
        Description: partsDescription[name],
        Rarity: partRaritesLookup[name],
        Image: imageIds.itemImages[name] as AssetId,
        InStock: 0,
        Price: partsPrices[name]
    })
})

const partsRarityAppearances: { [key in TowVehicleRarity]: number } = {
    Common: 2, // 50%
    Uncommon: 4.3, // 37.5%
    Rare: 8.3, //  25%
    Mythic: 12, // 16%
    Eternal: 18 // 1.25%
}

const partRarityStocks: { [key in TowVehicleRarity]: [number, number] } = {
    Common: [1, 4], // 50%
    Uncommon: [1, 3], // 37.5%
    Rare: [1, 2], //  25%
    Mythic: [1, 1], // 16%
    Eternal: [1,1] // 1.25%
}

partsData.sort((a, b) => a.Price < b.Price)
export default {
    partsCollection: partsData,
    partsChances: partsRarityAppearances,
    partsPrices,
    partRarityStocks
}

const pagePaths = (page: GameUI) => {
    return {
       Shop: page.ShopUI,
       PlaceMobile: page.MainUI.Place,
       Inventory: page.MainUI.Inventory
    };
}

export type PagePaths = ReturnType<typeof pagePaths>;
export default pagePaths
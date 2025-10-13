
const pagePaths = (page: GameUI) => {
    return {
       // Inventory: page.MainUI.Inventory,
    };
}

export type PagePaths = ReturnType<typeof pagePaths>;
export default pagePaths
import { HttpService } from "@rbxts/services"
import { t } from "@rbxts/t"
import paths from "shared/paths"


type snowPlowReference = {
    base: SnowPlowName,
    parts: {
        seat: string
        wheels: {
            fr: {
                name: string,
                position: string
                relativeLocation: string
            },
            fl: {
                name: string,
                position: string
                relativeLocation: string
            },
            bl: {
                name: string,
                position: string
                relativeLocation: string
            },
            br: {
                name: string,
                position: string
                relativeLocation: string
            },
        },
        plow: {
            name: string,
            relativeLocation: string
        },
        fuel: {
            name: string,
            relativeLocation: string
        }
    }
}

const snowPlowDefaultData: snowPlowReference = {
    base: "StarterSnowPlow",
    parts: {
        seat: tostring(new CFrame(-1.56427002, 0.115074635, 0.0670642853, 0, 0, -1, 0, 1, 0, 1, 0, 0)),
        wheels: {
            fr: {
                name: "Standard Wheel",
                position: "FR",
                relativeLocation: tostring(new CFrame(8.57166386, -4.28614473, -295.373413, -0.0140456567, 0, 0.999901235, 0, 0.999999762, 0, -0.999901414, 0, -0.014045652))
            },
            fl: {
                name: "Standard Wheel",
                position: "FL",
                relativeLocation: tostring(new CFrame(5.36929512, -4.28614473, -295.32843, -0.0140456567, 0, 0.999901235, 0, 0.999999762, 0, -0.999901414, 0, -0.014045652))
            },
            bl: {
                name: "Standard Wheel",
                position: "BL",
                relativeLocation: tostring(new CFrame(5.4247694, -4.28614473, -291.379242, -0.0140456567, 0, 0.999901235, 0, 0.999999762, 0, -0.999901414, 0, -0.014045652))
            },
            br: {
                name: "Standard Wheel",
                position: "BR",
                relativeLocation: tostring(new CFrame(8.6709528, -4.28614473, -291.424835, -0.0140456567, 0, 0.999901235, 0, 0.999999762, 0, -0.999901414, 0, -0.014045652))
            },
        },  
        plow: {
            name: "Mini Plow Blade",
            relativeLocation: tostring(new CFrame(-3.56396484, -1.96637201, 0.108394623, 0, 0, -1, 0, 1, 0, 1, 0, 0))
        },
        fuel: {
            name: "Small Fuel Tank",
            relativeLocation: tostring(new CFrame(2.32391357, 0.227020741, 0.542480469, -1, 0, 0, 0, 1, 0, 0, 0, -1))
        }
    }
}

export const snowPlowValidation = t.interface({
    base: t.string as t.check<SnowPlowName>,
    parts: t.interface({
        seat: t.string,
        wheels: t.interface({
            fr: t.interface({
                name: t.string,
                position: t.string,
                relativeLocation: t.string
            }),
            fl: t.interface({
                name: t.string,
                position: t.string,
                relativeLocation: t.string
            }),
            bl: t.interface({
                name: t.string,
                position: t.string,
                relativeLocation: t.string
            }),
            br: t.interface({
                name: t.string,
                position: t.string,
                relativeLocation: t.string
            }),
        }),
        plow: t.interface({
            name: t.string,
            relativeLocation: t.string
        }),
        fuel: t.interface({
            name: t.string,
            relativeLocation: t.string
        })
    })
})

export default snowPlowDefaultData
export type SnowPlowData = typeof snowPlowDefaultData
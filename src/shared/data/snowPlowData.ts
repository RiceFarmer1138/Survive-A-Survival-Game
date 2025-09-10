import { t } from "@rbxts/t"
import paths from "shared/paths"

type snowPlowReference = {
    base: SnowPlowName,
    parts: {
        wheels: {
            front: {
                left_wheel: {},
                right_wheel: {}
            },
            back: {
                left_wheel: {},
                right_wheel: {}
            }
        }
    }
}

const snowPlowDefaultData: snowPlowReference = {
    base: "StarterSnowPlow",
    parts: {
        wheels: {
            front: {
                left_wheel: {

                },
                right_wheel: {

                }
            },
            back: {
                left_wheel: {},
                right_wheel: {}
            }
        }
    }
}

export const snowPlowValidation = t.interface({
    base: t.string as t.check<SnowPlowName>,
    parts: t.interface({
        wheels: t.interface({
            front: t.interface({
                left_wheel: t.interface({}),
                right_wheel: t.interface({})
            }),
            back: t.interface({
                left_wheel: t.interface({}),
                right_wheel: t.interface({})
            })
        })
    })
})

export default snowPlowDefaultData
export type SnowPlowData = typeof snowPlowDefaultData
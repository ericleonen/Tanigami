import bunny from "../targets/json/bunny.json";
import dancing_person from "../targets/json/dancing_person.json"
import silly_person from "../targets/json/silly_person.json"

export const LEVELS: Level[] = [
    {
        index: 1,
        target: bunny as Shape,
        tiles: []
    },
    {
        index: 2,
        target: dancing_person as Shape,
        tiles: []
    },
    {
        index: 3,
        target: silly_person as Shape,
        tiles: []
    }
]
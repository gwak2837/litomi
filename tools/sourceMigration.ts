import { BookmarkSource } from '@/database/schema'
import { Manga } from '@/types/manga'

import harpiJSON from '../src/database/harpi.json'
import hashaJSON from '../src/database/hasha.json'

const hashaMangas = hashaJSON as Record<string, Manga>
const harpiMangas = harpiJSON as Record<string, Manga>

const noSourceMangaIds = [
  3304029, 3304032, 3303425, 3303096, 3080981, 3109437, 3204490, 3066323, 3026323, 3181671, 3181668, 3179054, 3178158,
  3178145, 2618568, 3166700, 3165041, 3154795, 3153452, 3143339, 3139095, 3082666, 3138914, 3093448, 3138052, 3136847,
  3136192, 3136016, 3135899, 3134382, 3125698, 3124482, 3300529, 3300537, 3261909, 3051233, 2943333, 2818347, 2828872,
  3300529, 3300537, 3305715, 3090486, 2383599, 2596129, 2725896, 3304321, 3300677, 3300537, 3300529, 2907514, 3300509,
  3298046, 3297710, 3297205, 3297177, 3294616, 3293532, 3264789, 3305189, 2949546, 3306856, 1995000, 3303798, 2973826,
  3030662, 3249717, 3024705, 3305025, 3305575, 3209144, 3039404, 3206433, 3303680, 3303564, 3301637, 3308049, 3306037,
  3308049, 3307425, 3308373, 3307381, 3301184, 3294052, 3300507, 3308780, 3308382, 3053634, 3033978, 3306856, 3306372,
  3308780, 3308472,
]

const mangaIdsWithSource = noSourceMangaIds
  .map((id) => {
    if (id in hashaMangas) {
      return `(${id}, ${BookmarkSource.HASHA})`
    }
    if (!(id in harpiMangas)) {
      return `(${id}, ${BookmarkSource.HIYOBI})`
    }
    return undefined
  })
  .filter((source) => source !== undefined)
  .join(', ')

console.log('👀 - mangaIdsWithSource:', mangaIdsWithSource)

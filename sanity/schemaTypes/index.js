import constellation from './constellation'
import axes from './axes'
import external from './external'
import about from './singletons/about'

const singletons = [about]
const objects = [constellation, axes, external]

export const schemaTypes = [...singletons, ...objects]

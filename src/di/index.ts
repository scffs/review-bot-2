import { db } from 'database/database'

import { DIContainer } from './di'

export const di = new DIContainer(() => db.db)

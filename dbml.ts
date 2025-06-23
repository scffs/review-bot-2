import { pgGenerate } from 'drizzle-dbml-generator'
import * as schema from './drizzle/schema'

pgGenerate({
  schema,
  out: './schema.dbml',
  relational: true
})

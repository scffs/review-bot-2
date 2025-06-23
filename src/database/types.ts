import { z } from 'zod'

import { type Vacancy, userVacancySchema } from './models'

export interface TeamMember {
  gitlabId: number
  weeekId: string
  telegramLink: string
  vacancy: Vacancy[]
  name: string
}

export const teamMemberSchema = z.object({
  gitlabId: z.number(),
  weeekId: z.string(),
  telegramLink: z.string().url(),
  vacancy: z.array(userVacancySchema),
  name: z.string()
})

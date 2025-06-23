import type { TagType, TeamMember } from '@database'

export interface WeeekTag {
  color: string
  id: number
  title: string
  // [property: string]: any
}

export interface MrField {
  reviewers: {
    total: number
    unresolved: TeamMember[]
    reviewNeeded: TeamMember[]
  }
  comments: {
    total: number
    unresolved: number
    actionsNeeded: {
      assigned: TeamMember
      comments: { id: number; link: string }[]
    }[]
    peopleCommented: TeamMember[]
  }
  branchBehindBy: number
  hasConflicts: boolean
  changedFilesCount: number
  additions: number
  deletions: number
  durationSeconds: number
}

export interface TaskTests {
  all: Array<{
    name: string
    link: string
    isCompleted: boolean
  }>
  total: number
  unresolved: Array<{ name: string; link: string }> | null
  // Нужны ли тесты задачи
  isNeeded: boolean
  isCompleted: boolean
  isStarted: boolean
  taskUrl: string | null
}

export interface ReviewFields {
  title: string | null
  mrUrl: string | null
  mrId: number | null
  taskUrl: string | null
  tags: TagType[]
  images: string[]
  videos: string[]
  assignees: Array<TeamMember>
  mr: MrField | null
  tests: TaskTests
  isEmergency: boolean
}

export interface TaskLink {
  taskId: number
  taskUrl: string | null
}

export interface UserStats {
  totalComments: number
  totalBugsResolved: number
  totalAdditions: number
  totalDeletions: number
  totalFilesChanged: number
  longestTaskDurationSeconds: number

  topCommentTask?: TaskLink
  topBugTask?: TaskLink
  topAdditionsTask?: TaskLink
  topDeletionsTask?: TaskLink
  topFilesChangedTask?: TaskLink
}

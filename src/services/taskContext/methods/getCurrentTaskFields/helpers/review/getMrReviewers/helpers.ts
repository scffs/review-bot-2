import type { TeamMember } from '@database'

export const removeByGitlabId = (array: TeamMember[], account: TeamMember) => {
  const index = array.findIndex((item) => item.gitlabId === account.gitlabId)
  if (index !== -1) {
    array.splice(index, 1)
  }
}

export const addByGitlabId = (array: TeamMember[], account: TeamMember) => {
  if (!array.find((item) => item.gitlabId === account.gitlabId)) {
    array.push(account)
  }
}

import {
  AssigneeRepository,
  AttachmentRepository,
  type DbType,
  MrCommentRepository,
  MrCommentedUserRepository,
  MrReviewRepository,
  MrReviewerRepository,
  ReviewStatRepository,
  TagRepository,
  TaskMessageRepository,
  TaskRepository,
  TaskTagRepository,
  TestDetailRepository,
  TestRepository,
  UserRepository,
  UserVacancyRepository
} from 'database'

import { Bot } from '@bot'

import { GitLabService } from '../clients/gitlab'

export class DIContainer {
  constructor(private readonly getDatabaseInstance: () => DbType) {}

  private get db(): DbType {
    return this.getDatabaseInstance()
  }

  private _user?: UserRepository
  private _task?: TaskRepository
  private _userVacancy?: UserVacancyRepository
  private _assignee?: AssigneeRepository
  private _attachment?: AttachmentRepository
  private _mrComment?: MrCommentRepository
  private _mrCommentedUser?: MrCommentedUserRepository
  private _mrReview?: MrReviewRepository
  private _mrReviewer?: MrReviewerRepository
  private _taskMessage?: TaskMessageRepository
  private _taskTag?: TaskTagRepository
  private _tag?: TagRepository
  private _test?: TestRepository
  private _testDetail?: TestDetailRepository
  private _bot?: Bot
  private _gitlab?: GitLabService
  private _reviewStat?: ReviewStatRepository

  get reviewStat() {
    return (this._reviewStat ??= new ReviewStatRepository(this.db))
  }

  get bot() {
    return (this._bot ??= new Bot())
  }

  get gitlab() {
    return (this._gitlab ??= new GitLabService())
  }

  get user() {
    return (this._user ??= new UserRepository(this.db))
  }

  get task() {
    return (this._task ??= new TaskRepository(this.db))
  }

  get userVacancy() {
    return (this._userVacancy ??= new UserVacancyRepository(this.db))
  }

  get assignee() {
    return (this._assignee ??= new AssigneeRepository(this.db))
  }

  get attachment() {
    return (this._attachment ??= new AttachmentRepository(this.db))
  }

  get mrComment() {
    return (this._mrComment ??= new MrCommentRepository(this.db))
  }

  get mrCommentedUser() {
    return (this._mrCommentedUser ??= new MrCommentedUserRepository(this.db))
  }

  get mrReview() {
    return (this._mrReview ??= new MrReviewRepository(this.db))
  }

  get mrReviewer() {
    return (this._mrReviewer ??= new MrReviewerRepository(this.db))
  }

  get taskMessage() {
    return (this._taskMessage ??= new TaskMessageRepository(this.db))
  }

  get taskTag() {
    return (this._taskTag ??= new TaskTagRepository(this.db))
  }

  get tag() {
    return (this._tag ??= new TagRepository(this.db))
  }

  get test() {
    return (this._test ??= new TestRepository(this.db))
  }

  get testDetail() {
    return (this._testDetail ??= new TestDetailRepository(this.db))
  }
}

import type { DatabaseService, UserWithVacancies } from '@database'

declare module '@mtcute/dispatcher' {
  interface DispatcherDependencies {
    user: UserWithVacancies
    db: DatabaseService
  }
}

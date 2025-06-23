export interface GetTasksResponse {
  hasMore?: boolean
  success?: boolean
  tasks?: Task[]
  // [property: string]: any
}

export interface GetTaskResponse {
  success?: boolean
  task?: Task
  // [property: string]: any
}

/**
 * Задача
 */
export interface Task {
  attachments?: Attachment[]
  /**
   * ID пользователя, создавшего задачу
   */
  authorId?: string
  boardColumnId?: number | null
  boardId?: number | null
  /**
   * Дата создания задачи в формате ISO 8601
   */
  createdAt: Date
  customFields?: CustomFieldValue[]
  description?: null | string
  /**
   * Срок выполнения задачи в формате `Y-m-d`
   */
  dueDate?: Date | null
  /**
   * Срок выполнения задачи в формате ISO 8601
   */
  dueDateTime?: Date | null
  /**
   * В минутах
   */
  duration?: number | null
  id?: number
  image?: null | string
  isCompleted?: boolean
  isPrivate?: boolean
  overdue: number
  parentId?: number | null
  /**
   * 0 - Низкий
   * 1 - Средний
   * 2 - Высокий
   * 3 - Отложено
   */
  priority?: number | null
  projectId?: number | null
  /**
   * Дата начала задачи в формате `Y-m-d`
   */
  startDate?: Date | null
  /**
   * Дата начала задачи в формате ISO 8601
   */
  startDateTime?: Date | null
  subscribers?: string[]
  subTasks?: number[]
  tags?: number[]
  timeEntries: TimeEntry[]
  title?: string
  type?: TaskType
  /**
   * Дата последнего обновления задачи в формате ISO 8601
   */
  updatedAt: Date
  /**
   * ID пользователя, выполняющего задачу
   */
  userId?: null | string
  workloads?: Workload[]
  // [property: string]: any
}

/**
 * Вложение
 */
export interface Attachment {
  createdAt: Date
  creatorId: string
  id: string
  name: string
  service: AttachmentServiceEnum
  /**
   * Размер вложения в байтах. Присутствует только если `service` — `weeek`
   */
  size?: number
  /**
   * URL вложения. Если `service` — `weeek`, этот URL будет доступен в течение часа
   */
  url: string
  // [property: string]: any
}

/**
 * Сервис хранения вложений
 */
export enum AttachmentServiceEnum {
  Box = 'box',
  Dropbox = 'dropbox',
  GoogleDrive = 'google_drive',
  OneDrive = 'one_drive',
  Weeek = 'weeek'
}

/**
 * Значение пользовательского поля
 */
export interface CustomFieldValue {
  config?: null | Config
  id?: string
  name?: null | string
  /**
   * Только для пользовательских полей типа select и multiselect
   */
  options: CustomFieldOption[]
  type: CustomFieldType
  //  any[] |
  value: boolean | number | { [key: string]: any } | null | string
  // [property: string]: any
}

/**
 * Конфигурация
 */
export interface Config {
  /**
   * Только для булевых пользовательских полей
   */
  type: ConfigType
  // [property: string]: any
}

/**
 * Только для булевых пользовательских полей
 */
export enum ConfigType {
  Checkbox = 'checkbox',
  Switch = 'switch'
}

/**
 * Опция пользовательского поля
 */
export interface CustomFieldOption {
  color: Color
  id?: string
  name: string
  // [property: string]: any
}

export enum Color {
  Blue = 'blue',
  DarkGreen = 'dark_green',
  DarkPink = 'dark_pink',
  DarkPurple = 'dark_purple',
  DarkYellow = 'dark_yellow',
  Green = 'green',
  LightBlue = 'light_blue',
  LightGreen = 'light_green',
  LightPink = 'light_pink',
  Pink = 'pink',
  Purple = 'purple',
  Red = 'red'
}

export enum CustomFieldType {
  Approval = 'approval',
  Boolean = 'boolean',
  Contact = 'contact',
  Datetime = 'datetime',
  Link = 'link',
  Member = 'member',
  Multiselect = 'multiselect',
  Select = 'select',
  Text = 'text'
}

/**
 * Запись о времени
 */
export interface TimeEntry {
  /**
   * Дата записи. В формате `Y-m-d`
   */
  date: Date
  /**
   * Время в минутах, не может превышать 1440
   */
  duration: number
  id: string
  /**
   * Флаг, указывающий, что запись является сверхурочной
   */
  isOvertime: boolean
  type: number
  userId: string
  // [property: string]: any
}

export enum TaskType {
  Action = 'action',
  Call = 'call',
  Meet = 'meet'
}

export interface Workload {
  date?: string
  duration?: number
  id?: string
  /**
   * 1 - автоматически рассчитано по таймеру
   * 2 - добавлено вручную
   */
  type?: number
  userId?: string
  workEndAt?: null | string
  workStartAt?: null | string
  // [property: string]: any
}

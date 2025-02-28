export interface Ticket {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  assignee: string
  createdAt: string
  type?: string
  requesterName?: string
  requesterEmail?: string
}

export enum Status {
  PENDING = 'pendente',
  IN_PROGRESS = 'em_andamento',
  IN_TESTING = 'em_teste',
  DONE = 'concluido',
  ARCHIVED = 'arquivado'
}

export enum Priority {
  LOW = 'baixa',
  MEDIUM = 'média',
  HIGH = 'alta'
}
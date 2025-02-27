export interface Ticket {
  id: string
  title: string
  description: string
  priority: "baixa" | "média" | "alta"
  status: "pendente" | "em_andamento" | "em_teste" | "concluido"
  assignee: string
  createdAt: string
  type?: string
  requesterName?: string
  requesterEmail?: string
}
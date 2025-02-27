"use client"

import { type DragEvent, useState } from "react"

import EditTicketDialog from "@/components/edit-ticket-dialog"
import TicketCard from "@/components/ticket-card"
import type { Ticket } from "@/lib/types"

interface KanbanBoardProps {
  tickets: Ticket[]
  onMoveTicket: (ticketId: string, newStatus: string) => void
  onEditTicket: (updatedTicket: Ticket) => void
}

export default function KanbanBoard({ tickets, onMoveTicket, onEditTicket }: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)

  const columns = [
    { id: "pendente", title: "Pendente", color: "bg-yellow-100" },
    { id: "em_andamento", title: "Em Andamento", color: "bg-blue-100" },
    { id: "em_teste", title: "Em Teste", color: "bg-purple-100" },
    { id: "concluido", title: "Concluído", color: "bg-green-100" },
  ]

  const handleDragStart = (e: DragEvent<HTMLDivElement>, ticketId: string) => {
    console.log("dragging", ticketId)
    setDraggingId(ticketId)
    e.dataTransfer.setData("ticketId", ticketId)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault()
    const ticketId = e.dataTransfer.getData("ticketId")
    console.log("Drop no status:", status, "para o ticket:", ticketId)
    onMoveTicket(ticketId, status)
    setDraggingId(null)
  }
  

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className={`p-3 rounded-t-lg ${column.color}`}>
              <h2 className="font-semibold">{column.title}</h2>
              <div className="text-sm text-muted-foreground">
                {tickets.filter((ticket) => ticket.status === column.id).length} chamados
              </div>
            </div>
            <div
              className="bg-muted/40 p-3 rounded-b-lg flex-1 min-h-[500px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="space-y-3">
                {tickets
                  .filter((ticket) => ticket.status === column.id)
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ticket.id)}
                      className={draggingId === ticket.id ? "opacity-50" : ""}
                    >
                      <TicketCard ticket={ticket} onEdit={handleEditTicket} isCompact={ticket.status === "concluido"} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingTicket && (
        <EditTicketDialog
          open={!!editingTicket}
          onOpenChange={(open) => !open && setEditingTicket(null)}
          onSubmit={onEditTicket}
          ticket={editingTicket}
        />
      )}
    </>
  )
}


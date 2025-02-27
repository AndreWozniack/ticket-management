"use client"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"

import KanbanBoard from "@/components/kanban-board"
import NewTicketDialog from "@/components/new-ticket-dialog"
import { Button } from "@/components/ui/button"
import type { Ticket } from "@/lib/types"
import { TicketApi } from "@/lib/api"

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [open, setOpen] = useState(false)
  const ticketApi = new TicketApi()


  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketApi.getTickets()
        setTickets(data)
      } catch (error) {
        console.error("Erro ao buscar tickets:", error)
      }
    }
    fetchTickets()
  }, [])

  async function addTicket(ticket: Omit<Ticket, "id" | "createdAt">) {
    try {
      const newTicket = await ticketApi.createTicket(ticket)
      setTickets((prevTickets) => [...prevTickets, newTicket])
    } catch (error) {
      console.error("Erro ao criar ticket:", error)
    }
  }
async function moveTicket(ticketId: string, newStatus: Ticket["status"]) {
  try {
    console.log("Movendo ticket:", ticketId, newStatus)
    
    // Se necessário, garanta que o ticketId esteja no mesmo formato dos ids dos tickets
    const ticketToMove = tickets.find(
      (ticket) => ticket.id.toString() === ticketId.toString()
    )
    console.log("Tickets:", tickets)
    console.log("Ticket encontrado:", ticketToMove)
    
    if (!ticketToMove) return

    // Atualiza o ticket chamando a API
    const updatedTicket = await ticketApi.updateTicket({
      ...ticketToMove,
      status: newStatus,
    })
    console.log("Ticket movido:", updatedTicket)
    
    // Atualiza o estado substituindo o ticket antigo pelo atualizado
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id.toString() === ticketId.toString() ? updatedTicket : ticket
      )
    )
  } catch (error) {
    console.error("Erro ao mover ticket:", error)
    // Aqui você pode incluir uma lógica para exibir feedback visual ao usuário
  }
}

  async function editTicket(updatedTicket: Ticket) {
    try {
      const ticketEdited = await ticketApi.updateTicket(updatedTicket)
      setTickets((prevTickets) => prevTickets.map((ticket) => ticket.id === updatedTicket.id ? ticketEdited : ticket
      )
      )
    } catch (error) {
      console.error("Erro ao editar ticket:", error)
    }
  }


  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard de Chamados - Equipe de TI</h1>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Chamado
        </Button>
      </div>

      <KanbanBoard tickets={tickets} onMoveTicket={moveTicket} onEditTicket={editTicket} />

      <NewTicketDialog open={open} onOpenChange={setOpen} onSubmit={addTicket} />
    </div>
  )
}
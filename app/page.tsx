"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"

import KanbanBoard from "@/components/kanban-board"
import NewTicketDialog from "@/components/new-ticket-dialog"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Ticket } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      fetchTickets()
    }
  }, [router])

  const fetchTickets = async () => {
    setIsLoading(true)
    try {
      const fetchedTickets = await api.getTickets()
      setTickets(fetchedTickets)
    } catch (error) {
      console.error("Erro ao buscar chamados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os chamados. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTicket = async (ticket: Omit<Ticket, "id" | "createdAt">) => {
    try {
      const newTicket = await api.createTicket(ticket)
      setTickets([...tickets, newTicket])
      toast({
        title: "Sucesso",
        description: "Chamado criado com sucesso!",
      })
    } catch (error) {
      console.error("Erro ao criar chamado:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o chamado. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const moveTicket = async (ticketId: string, newStatus: string) => {
    const ticketToUpdate = tickets.find((t) => t.id === ticketId)
    if (ticketToUpdate) {
      try {
        await api.updateTicket({ ...ticketToUpdate, status: newStatus as Ticket["status"] })
        fetchTickets()
      } catch (error) {
        console.error("Erro ao mover chamado:", error)
        toast({
          title: "Erro",
          description: "Não foi possível mover o chamado. Por favor, tente novamente.",
          variant: "destructive",
        })
      }
    }
  }
  
  

  const editTicket = async (updatedTicket: Ticket) => {
    try {
      const result = await api.updateTicket(updatedTicket)
      setTickets(tickets.map((t) => (t.id === updatedTicket.id ? result : t)))
      toast({
        title: "Sucesso",
        description: "Chamado atualizado com sucesso!",
      })
    } catch (error) {
      console.error("Erro ao editar chamado:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o chamado. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard de Chamados - Equipe de TI</h1>
        <div>
          <Button onClick={() => setOpen(true)} className="mr-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Chamado
          </Button>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>
      </div>

      <KanbanBoard tickets={tickets} onMoveTicket={moveTicket} onEditTicket={editTicket} />

      <NewTicketDialog open={open} onOpenChange={setOpen} onSubmit={addTicket} />
    </div>
  )
}


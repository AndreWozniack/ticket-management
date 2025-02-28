"use client";

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

import KanbanBoard from "@/components/kanban-board";
import NewTicketDialog from "@/components/new-ticket-dialog";
import { Button } from "@/components/ui/button";
import type { Status, Ticket } from "@/lib/types";
import { TicketApi } from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [open, setOpen] = useState(false);
  const ticketApi = new TicketApi();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketApi.getTickets();
        setTickets(data);
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  async function addTicket(ticket: Omit<Ticket, "id" | "createdAt">) {
    try {
      // Mostrar indicador de carregamento se necessário
      console.log("Criando ticket:", ticket);
      const newTicket = await ticketApi.createTicket(ticket);
      
      setTickets(prevTickets => [...prevTickets, newTicket]);
      
      toast.success("Chamado criado com sucesso!");
      
      // Fechar o diálogo
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      toast.error("Erro ao criar chamado. Tente novamente.");
    }
  }

  async function moveTicket(ticketId: string, newStatus: Status) {

    const oldTicket = tickets.find((ticket) => ticket.id === ticketId);
    if (!oldTicket) {
      console.error("Ticket não encontrado:", ticketId);
      return;
    }
  
    // Store the original status for potential rollback
    const originalStatus = oldTicket.status;
  
    // Immediately update the UI for a responsive feel
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  
    console.log("Ticket visualmente movido:", ticketId, "de", originalStatus, "para", newStatus);
  
    try {
      const updatedTicket = await ticketApi.updateTicket({
        ...oldTicket,
        status: newStatus,
      });
  
      // Optional: Update the ticket with any additional data returned from the API
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? updatedTicket : ticket
        )
      );
      
      console.log("Ticket atualizado com sucesso na API:", ticketId);
    } catch (error) {
      console.error("Erro ao mover ticket na API:", error);
      
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: originalStatus } : ticket
        )
      );
      
      toast.error("Não foi possível atualizar o status do chamado. Tente novamente.");
    }
  }

  async function editTicket(updatedTicket: Ticket) {
    try {
      const ticketEdited = await ticketApi.updateTicket(updatedTicket);
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === updatedTicket.id ? ticketEdited : ticket
        )
      );
    } catch (error) {
      console.error("Erro ao editar ticket:", error);
    }
  }

  async function deleteTicket(id: string) {
    try {
      await ticketApi.deleteTicket(id);
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== id));
    } catch (error) {
      console.error("Erro ao excluir ticket:", error);
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard de Chamados - Equipe de TI
        </h1>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Chamado
        </Button>
      </div>

      <KanbanBoard
        tickets={tickets}
        onMoveTicket={moveTicket}
        onEditTicket={editTicket}
        onDeleteTicket={deleteTicket}
      />

      <NewTicketDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={addTicket}
      />
    </div>
  );
}

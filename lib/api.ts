import axios from "axios"
import type { Ticket } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  console.error("NEXT_PUBLIC_API_URL is not set. Please set this environment variable.")
}

export const api = {
  getTickets: async (): Promise<Ticket[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tickets`)
      console.log("Resposta getTickets:", response.data)
      return response.data
    } catch (error) {
      console.error("Erro no getTickets:", error)
      throw error
    }
  },

  createTicket: async (ticket: Omit<Ticket, "id" | "createdAt">): Promise<Ticket> => {
    const response = await axios.post(`${API_BASE_URL}/tickets`, ticket)
    console.log(response.data)
    return response.data
  },

  updateTicket: async (ticket: Ticket): Promise<Ticket> => {
    const response = await axios.put(`${API_BASE_URL}/tickets/${ticket.id}`, ticket)
    console.log(response.data)
    return response.data
    
  },

  deleteTicket: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/tickets/${id}`)
  },
}
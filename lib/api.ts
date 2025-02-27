import axios, { AxiosInstance } from "axios";
import type { Ticket } from "./types";

export class TicketApi {
    private axiosInstance: AxiosInstance;

    constructor() {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_BASE_URL) {
            console.error("NEXT_PUBLIC_API_URL is not set. Please set this environment variable.");
        }
        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
        });
    }

    async getTickets(): Promise<Ticket[]> {
        try {
            const response = await this.axiosInstance.get("/tickets");
            console.log("Resposta getTickets:", response.data);
            return response.data;
        } catch (error) {
            console.error("Erro no getTickets:", error);
            throw error;
        }
    }

    async createTicket(ticket: Omit<Ticket, "id" | "createdAt">): Promise<Ticket> {
        try {
            const response = await this.axiosInstance.post("/tickets", ticket);
            console.log("Resposta createTicket:", response.data);
            return response.data;
        } catch (error) {
            console.error("Erro no createTicket:", error);
            throw error;
        }
    }

    async updateTicket(ticket: Ticket): Promise<Ticket> {
        try {
            const response = await this.axiosInstance.put(`/tickets/${ticket.id}`, ticket);
            console.log("Resposta updateTicket:", response.data);
            return response.data;
        } catch (error) {
            console.error("Erro no updateTicket:", error);
            throw error;
        }
    }

    async deleteTicket(id: string): Promise<void> {
        try {
            await this.axiosInstance.delete(`/tickets/${id}`);
            console.log(`Ticket com id ${id} deletado`);
        } catch (error) {
            console.error("Erro no deleteTicket:", error);
            throw error;
        }
    }
}
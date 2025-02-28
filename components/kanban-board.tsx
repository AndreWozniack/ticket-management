"use client";

import { type DragEvent, useState } from "react";
import { Button } from "@/components/ui/button";

import EditTicketDialog from "@/components/edit-ticket-dialog";
import TicketCard from "@/components/ticket-card";
import { Status, Ticket } from "@/lib/types";

interface KanbanBoardProps {
	tickets: Ticket[];
	onMoveTicket: (ticketId: string, newStatus: Status) => void;
	onEditTicket: (updatedTicket: Ticket) => void;
	onDeleteTicket: (id: string) => void;
}

export default function KanbanBoard({
	tickets,
	onMoveTicket,
	onEditTicket,
	onDeleteTicket,
}: KanbanBoardProps) {
	const [draggingId, setDraggingId] = useState<string | null>(null);
	const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
	const [showArchived, setShowArchived] = useState<boolean>(false);

	const columns: { id: Status; title: string; color: string }[] = [
		{ id: Status.PENDING, title: "Pendente", color: "bg-yellow-100" },
		{ id: Status.IN_PROGRESS, title: "Em Andamento", color: "bg-blue-100" },
		{ id: Status.IN_TESTING, title: "Em Teste", color: "bg-purple-100" },
		{ id: Status.DONE, title: "Concluído", color: "bg-green-100" }
	];

	if (showArchived) {
		columns.push({ id: Status.ARCHIVED, title: "Arquivado", color: "bg-gray-100" });
	}

	const sortTickets = (a: Ticket, b: Ticket) => {
		const priorityValues = {
			'alta': 3,
			'média': 2,
			'baixa': 1
		};
		const priorityA = priorityValues[a.priority as unknown as keyof typeof priorityValues] || 0;
		const priorityB = priorityValues[b.priority as unknown as keyof typeof priorityValues] || 0;

		if (priorityB !== priorityA) {
			return priorityB - priorityA;
		}

		return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	};

	const handleDragStart = (e: DragEvent<HTMLDivElement>, ticketId: string) => {
		setDraggingId(ticketId);

		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("application/json", JSON.stringify({ ticketId }));
		const dragElement = document.getElementById(`ticket-${ticketId}`);
		if (dragElement) {
			e.dataTransfer.setDragImage(dragElement, 20, 20);
		}

		console.log("Iniciando arrasto do ticket:", ticketId);
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>, status: Status) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		e.currentTarget.classList.add("drop-zone-active");
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.currentTarget.classList.remove("drop-zone-active");
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>, status: Status) => {
		e.preventDefault();

		try {
			// Get the ticket ID from the data transfer
			const data = e.dataTransfer.getData("application/json");
			if (!data) {
				console.error("Dados do arrastar e soltar não encontrados");
				return;
			}

			const { ticketId } = JSON.parse(data);
			const ticket = tickets.find(t => t.id === ticketId);
			if (!ticket) {
				console.error("Ticket não encontrado:", ticketId);
				return;
			}

			// Only update if the status is different
			if (ticket.status !== status) {
				console.log("Movendo ticket:", ticketId, "para", status);
				onMoveTicket(ticketId, status);
			} else {
				console.log("Ticket já está no status:", status);
			}
		} catch (error) {
			console.error("Erro ao processar soltar:", error);
		} finally {
			// Reset the dragging state
			setDraggingId(null);

			// Remove any visual feedback for drop zones
			document.querySelectorAll(".drop-zone-active").forEach(el => {
				el.classList.remove("drop-zone-active");
			});
		}
	};


	const handleEditTicket = (ticket: Ticket) => {
		setEditingTicket(ticket);
	};

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
				{columns.map((column) => (
					<div key={column.id} className="flex flex-col min-w-[280px]">
						<div className={`p-3 rounded-t-lg ${column.color}`}>
							<h2 className="font-semibold">{column.title}</h2>
							<div className="text-sm text-muted-foreground">
								{tickets.filter((ticket) => ticket.status === column.id).length}{" "}
								chamados
							</div>
						</div>
						<div
							className="bg-muted/40 p-3 rounded-b-lg flex-1 min-h-[500px]"
							onDragOver={(e) => handleDragOver(e, column.id)}
							onDragLeave={handleDragLeave}
							onDrop={(e) => handleDrop(e, column.id)}
						>
							<div className="space-y-3">
								{tickets
									.filter((ticket) => ticket.status === column.id)
									.sort(sortTickets) // Aplicando a ordenação aqui
									.map((ticket) => (
										<div
											id={`ticket-${ticket.id}`}
											key={ticket.id}
											draggable
											onDragStart={(e) => handleDragStart(e, ticket.id)}
											className={`transition-opacity duration-200 ${draggingId === ticket.id ? "opacity-50" : "opacity-100"
												}`}
										>
											<TicketCard
												ticket={ticket}
												onEdit={handleEditTicket}
												isCompact={ticket.status === Status.DONE}
											/>
										</div>
									))}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-center mt-4">
				<Button type="button" variant="link"
					onClick={() => setShowArchived(!showArchived)}>
					{showArchived ? "Ocultar Arquivados" : "Mostrar Arquivados"}
				</Button>
			</div>

			{editingTicket && (
				<EditTicketDialog
					open={!!editingTicket}
					onOpenChange={(open) => !open && setEditingTicket(null)}
					onSubmit={onEditTicket}
					ticket={editingTicket}
					onDelete={onDeleteTicket}
				/>
			)}
		</>
	);
}
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react"; // Importando ícone de lixeira
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Ticket } from "@/lib/types";
import { Priority, Status } from "@/lib/types";

interface EditTicketDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (ticket: Ticket) => void;
	ticket: Ticket;
	onDelete?: (id: string) => void; // Nova prop para o callback de exclusão
}

const formSchema = z.object({
	id: z.string(),
	title: z.string().min(1, "Título é obrigatório"),
	description: z.string().min(1, "Descrição é obrigatória"),
	priority: z.nativeEnum(Priority),
	status: z.nativeEnum(Status),
	assignee: z.string().min(1, "Responsável é obrigatório"),
	createdAt: z.string(),
});

export default function EditTicketDialog({
	open,
	onOpenChange,
	onSubmit,
	ticket,
	onDelete,
}: EditTicketDialogProps) {
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: ticket,
	});

	useEffect(() => {
		if (open) {
			form.reset(ticket);
		}
	}, [open, ticket, form]);

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		console.log("Editando chamado:", values);
		onSubmit(values);
		onOpenChange(false);
	};

	const handleDeleteClick = () => {
		setConfirmDeleteOpen(true);
	};

	const handleConfirmDelete = () => {
		if (onDelete) {
			onDelete(ticket.id);
			setConfirmDeleteOpen(false);
			onOpenChange(false);
		}
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Editar Chamado</DialogTitle>
						<DialogDescription>
							Edite os detalhes do chamado abaixo.
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Título</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Descrição</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="priority"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Prioridade</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Selecione" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value={Priority.LOW}>Baixa</SelectItem>
													<SelectItem value={Priority.MEDIUM}>Média</SelectItem>
													<SelectItem value={Priority.HIGH}>Alta</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Status</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Selecione" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value={Status.PENDING}>Pendente</SelectItem>
													<SelectItem value={Status.IN_PROGRESS}>
														Em Andamento
													</SelectItem>
													<SelectItem value={Status.IN_TESTING}>
														Em Teste
													</SelectItem>
													<SelectItem value={Status.DONE}>Concluído</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="assignee"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Responsável</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter className="pt-4 flex justify-between items-center">
								<Button
									type="button"
									variant="destructive"
									onClick={handleDeleteClick}
									className="mr-auto"
								>
									<Trash2 className="h-4 w-4 mr-2" /> Excluir
								</Button>
								<div>
									<Button
										type="button"
										variant="outline"
										onClick={() => onOpenChange(false)}
										className="mr-2"
									>
										Cancelar
									</Button>
									<Button
										type="submit"
										onClick={() => handleSubmit(form.getValues())}
									>
										Salvar Alterações
									</Button>
								</div>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Diálogo de confirmação para exclusão */}
			<AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza de que deseja excluir este chamado? Esta ação não pode ser desfeita.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
							Excluir
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
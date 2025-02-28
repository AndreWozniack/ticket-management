"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Ticket } from "@/lib/types"
import { Priority, Status } from "@/lib/types"

interface NewTicketDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (ticket: Omit<Ticket, "id" | "createdAt">) => void
}

const formSchema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	description: z.string().min(1, "Descrição é obrigatória"),
	priority: z.nativeEnum(Priority),
	status: z.nativeEnum(Status),
	assignee: z.string().min(1, "Responsável é obrigatório"),
})

export default function NewTicketDialog({ open, onOpenChange, onSubmit }: NewTicketDialogProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			priority: Priority.MEDIUM, // "média"
			status: Status.PENDING,      // "pendente"
			assignee: "",
		},
	})

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		onSubmit(values)
		form.reset()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Novo Chamado</DialogTitle>
					<DialogDescription>Preencha os detalhes do novo chamado abaixo.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
										<Select onValueChange={field.onChange} defaultValue={field.value}>
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
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value={Status.PENDING}>Pendente</SelectItem>
												<SelectItem value={Status.IN_PROGRESS}>Em Andamento</SelectItem>
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
						<DialogFooter className="pt-4">
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancelar
							</Button>
							<Button type="submit">Criar Chamado</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
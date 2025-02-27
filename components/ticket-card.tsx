"use client"

import { Calendar, Edit, User, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Ticket } from "@/lib/types"

interface TicketCardProps {
  ticket: Ticket
  onEdit: (ticket: Ticket) => void
  isCompact?: boolean
}

export default function TicketCard({ ticket, onEdit, isCompact = false }: TicketCardProps) {
  const [expanded, setExpanded] = useState(!isCompact)

  const priorityColors = {
    baixa: "bg-green-100 text-green-800 hover:bg-green-100",
    média: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    alta: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <Card className={`cursor-grab active:cursor-grabbing ${isCompact ? "bg-gray-50" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{ticket.title}</CardTitle>
          <Badge variant="outline" className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
            {ticket.priority}
          </Badge>
        </div>
      </CardHeader>
      {(expanded || !isCompact) && (
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">{ticket.description}</p>
        </CardContent>
      )}
      <CardFooter className="pt-0 flex justify-between items-center">
        {expanded || !isCompact ? (
          <>
            <div className="flex flex-col text-xs text-muted-foreground">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {ticket.assignee}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(ticket.createdAt)}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onEdit(ticket)}>
              <Edit className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={toggleExpand} className="w-full">
            <ChevronDown className="h-4 w-4 mr-2" />
            Expandir
          </Button>
        )}
      </CardFooter>
      {expanded && isCompact && (
        <CardFooter>
          <Button variant="ghost" size="sm" onClick={toggleExpand} className="w-full">
            <ChevronUp className="h-4 w-4 mr-2" />
            Recolher
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}


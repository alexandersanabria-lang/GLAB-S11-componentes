"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const tasks = [
  {
    id: 1,
    title: "Implementar autenticación",
    project: "E-commerce Platform",
    status: "En progreso",
    priority: "Alta",
    assignee: "María García",
    dueDate: "2026-11-15",
  },
  {
    id: 2,
    title: "Diseñar pantalla de perfil",
    project: "Mobile App",
    status: "Pendiente",
    priority: "Media",
    assignee: "Ana López",
    dueDate: "2026-11-20",
  },
  {
    id: 3,
    title: "Configurar CI/CD",
    project: "API Gateway",
    status: "Completado",
    priority: "Alta",
    assignee: "Carlos Ruiz",
    dueDate: "2026-11-10",
  },
  {
    id: 4,
    title: "Optimizar queries SQL",
    project: "E-commerce Platform",
    status: "En progreso",
    priority: "Urgente",
    assignee: "Juan Pérez",
    dueDate: "2026-11-12",
  },
  {
    id: 5,
    title: "Documentar API endpoints",
    project: "API Gateway",
    status: "Pendiente",
    priority: "Baja",
    assignee: "Laura Martínez",
    dueDate: "2026-11-25",
  },
]

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    case "Pendiente":
      return "outline"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    case "Baja":
      return "outline"
    default:
      return "outline"
  }
}

export function TasksTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Tarea</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead>Fecha límite</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>{task.project}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={priorityVariant(task.priority)}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
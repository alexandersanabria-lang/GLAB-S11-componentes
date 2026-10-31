"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import {
  AlertTriangle, CalendarDays, CheckCircle2, Clock, Eye, FolderKanban, LayoutDashboard,
  ListChecks, Mail, Pencil, Phone, Plus, Settings as SettingsIcon, Trash2, Users,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

/* ---------- Tipos y constantes ---------- */
type Project = { id: string; title: string; description: string; status: string; memberIds: string[] }
type Member = {
  userId: string; role: string; name: string; email: string; position: string
  birthdate?: Date; phone: string; projectId: string; isActive: boolean
}
type Task = {
  id: string; description: string; projectId: string; status: string
  priority: string; userId: string; deadline?: Date
}

const NONE = "none"
const PAGE_SIZE = 5
const PROJECT_STATUS = ["Planificado", "En progreso", "En revisión", "Completado"]
const TASK_STATUS = ["Pendiente", "En progreso", "Completado"]
const PRIORITIES = ["Baja", "Media", "Alta", "Urgente"]
const ROLES = ["Administrador", "Miembro", "Observador"]

const EMPTY_PROJECT: Omit<Project, "id"> = { title: "", description: "", status: "Planificado", memberIds: [] }
const EMPTY_MEMBER: Omit<Member, "userId"> = {
  role: "Miembro", name: "", email: "", position: "", birthdate: undefined,
  phone: "", projectId: NONE, isActive: true,
}
const EMPTY_TASK: Omit<Task, "id"> = {
  description: "", projectId: NONE, status: "Pendiente", priority: "Media", userId: NONE, deadline: undefined,
}

/* ---------- Datos iniciales (en memoria) ---------- */
const seedMembers: Member[] = [
  { userId: "U-001", role: "Administrador", name: "María García", email: "maria@example.com", position: "Frontend Developer", birthdate: new Date(1999, 4, 12), phone: "987654321", projectId: "P-001", isActive: true },
  { userId: "U-002", role: "Miembro", name: "Juan Pérez", email: "juan@example.com", position: "Backend Developer", birthdate: new Date(1998, 1, 3), phone: "976543210", projectId: "P-001", isActive: true },
  { userId: "U-003", role: "Miembro", name: "Ana López", email: "ana@example.com", position: "UI/UX Designer", birthdate: new Date(2000, 8, 21), phone: "965432109", projectId: "P-002", isActive: false },
  { userId: "U-004", role: "Observador", name: "Carlos Ruiz", email: "carlos@example.com", position: "DevOps Engineer", birthdate: new Date(1997, 10, 30), phone: "954321098", projectId: "P-002", isActive: true },
]
const seedProjects: Project[] = [
  { id: "P-001", title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", status: "En progreso", memberIds: ["U-001", "U-002"] },
  { id: "P-002", title: "Mobile App", description: "Aplicación móvil con React Native", status: "En revisión", memberIds: ["U-003", "U-004"] },
  { id: "P-003", title: "Design System", description: "Librería de componentes reutilizables", status: "Planificado", memberIds: [] },
]
const seedTasks: Task[] = [
  { id: "T-001", description: "Implementar autenticación", projectId: "P-001", status: "En progreso", priority: "Alta", userId: "U-001", deadline: new Date(2026, 10, 15) },
  { id: "T-002", description: "Optimizar queries SQL", projectId: "P-001", status: "En progreso", priority: "Urgente", userId: "U-002", deadline: new Date(2026, 10, 12) },
  { id: "T-003", description: "Configurar CI/CD", projectId: "P-001", status: "Completado", priority: "Alta", userId: "U-002", deadline: new Date(2026, 10, 10) },
  { id: "T-004", description: "Diseñar pantalla de perfil", projectId: "P-002", status: "Pendiente", priority: "Media", userId: "U-003", deadline: new Date(2026, 10, 20) },
  { id: "T-005", description: "Publicar versión beta", projectId: "P-002", status: "Pendiente", priority: "Alta", userId: "U-004", deadline: new Date(2026, 10, 28) },
  { id: "T-006", description: "Documentar componentes", projectId: "P-003", status: "Pendiente", priority: "Baja", userId: "U-001", deadline: new Date(2026, 11, 2) },
  { id: "T-007", description: "Definir paleta de colores", projectId: "P-003", status: "Completado", priority: "Media", userId: "U-003", deadline: new Date(2026, 10, 5) },
]

/* ---------- Utilidades ---------- */
const wait = (ms = 900) => new Promise<void>((r) => setTimeout(r, ms))
const pad = (n: number) => String(n).padStart(2, "0")
const fmt = (d?: Date) => (d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : "Sin fecha")
const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
const nextId = (prefix: string, ids: string[]) =>
  `${prefix}-${String(Math.max(0, ...ids.map((i) => Number(i.split("-")[1]))) + 1).padStart(3, "0")}`
const opts = (list: string[]) => list.map((v) => ({ value: v, label: v }))

const projectTone: Record<string, string> = {
  Planificado: "bg-slate-100 text-slate-700 border-slate-200",
  "En progreso": "bg-sky-100 text-sky-800 border-sky-200",
  "En revisión": "bg-violet-100 text-violet-800 border-violet-200",
  Completado: "bg-emerald-100 text-emerald-800 border-emerald-200",
}
const projectStrip: Record<string, string> = {
  Planificado: "bg-slate-300",
  "En progreso": "bg-sky-400",
  "En revisión": "bg-violet-400",
  Completado: "bg-emerald-500",
}
const taskTone: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-800 border-amber-200",
  "En progreso": "bg-sky-100 text-sky-800 border-sky-200",
  Completado: "bg-emerald-100 text-emerald-800 border-emerald-200",
}
const priorityTone: Record<string, string> = {
  Baja: "bg-slate-100 text-slate-700 border-slate-200",
  Media: "bg-blue-100 text-blue-800 border-blue-200",
  Alta: "bg-orange-100 text-orange-800 border-orange-200",
  Urgente: "bg-red-100 text-red-800 border-red-200",
}

/* ---------- Componentes pequeños ---------- */
function Pill({ tone = "", children }: { tone?: string; children: ReactNode }) {
  return (
    <Badge variant="outline" className={`gap-1.5 font-medium ${tone}`}>
      {children}
    </Badge>
  )
}

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}

function Stat({ icon: Icon, title, value, note }: { icon: LucideIcon; title: string; value: ReactNode; note: string }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{note}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}

function SectionHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}

function Empty({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="font-medium">{title}</p>
      <p className="max-w-xs text-sm text-muted-foreground">{hint}</p>
    </div>
  )
}

function AvatarStack({ names }: { names: string[] }) {
  return (
    <div className="flex -space-x-2">
      {names.slice(0, 4).map((n, i) => (
        <Avatar key={`${n}-${i}`} className="size-7 border-2 border-background">
          <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">{initials(n)}</AvatarFallback>
        </Avatar>
      ))}
      {names.length > 4 && (
        <span className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold">
          +{names.length - 4}
        </span>
      )}
    </div>
  )
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function Choice({
  value, onChange, options, placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function DatePicker({
  value, onChange, placeholder,
}: { value?: Date; onChange: (d?: Date) => void; placeholder: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-start font-normal">
          {value ? fmt(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          defaultMonth={value}
          captionLayout="dropdown"
          startMonth={new Date(1960, 0)}
          endMonth={new Date(2035, 11)}
        />
      </PopoverContent>
    </Popover>
  )
}

function FormDialog({
  open, onOpenChange, title, error, saving, onSubmit, children,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  title: string
  error: string
  saving: boolean
  onSubmit: (e: FormEvent) => void
  children: ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[525px]">
        <form onSubmit={onSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Completa los datos y pulsa Guardar.</DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Revisa el formulario</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {children}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner />}
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ---------- Página ---------- */
export default function DashboardPage() {
  const [members, setMembers] = useState(seedMembers)
  const [projects, setProjects] = useState(seedProjects)
  const [tasks, setTasks] = useState(seedTasks)
  const [activity, setActivity] = useState<string[]>([])
  const [taskPage, setTaskPage] = useState(1)

  const [dialog, setDialog] = useState<"project" | "member" | "task" | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [pDraft, setPDraft] = useState(EMPTY_PROJECT)
  const [mDraft, setMDraft] = useState(EMPTY_MEMBER)
  const [tDraft, setTDraft] = useState(EMPTY_TASK)

  const [settings, setSettings] = useState({
    workspace: "Mi Workspace", email: "equipo@example.com", language: "es", notifications: true, compact: false,
  })
  const [settingsMsg, setSettingsMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [settingsSaving, setSettingsSaving] = useState(false)

  /* --- Cálculos --- */
  const memberName = (id: string) => members.find((m) => m.userId === id)?.name ?? "Sin asignar"
  const projectName = (id: string) => projects.find((p) => p.id === id)?.title ?? "Sin proyecto"
  const progress = (pid: string) => {
    const list = tasks.filter((t) => t.projectId === pid)
    return list.length ? Math.round((list.filter((t) => t.status === "Completado").length * 100) / list.length) : 0
  }
  const done = tasks.filter((t) => t.status === "Completado").length
  const activeMembers = members.filter((m) => m.isActive).length

  const pageCount = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  const page = Math.min(taskPage, pageCount)
  const pageTasks = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const detail = projects.find((p) => p.id === detailId)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const gap = settings.compact ? "gap-2" : "gap-4"

  const addLog = (text: string) =>
    setActivity((prev) =>
      [`${text} (${new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })})`, ...prev].slice(0, 6)
    )

  /* --- Abrir formularios --- */
  const openDialog = (kind: "project" | "member" | "task", id: string | null = null) => {
    setError("")
    setEditId(id)
    if (kind === "project") {
      const p = projects.find((x) => x.id === id)
      setPDraft(p ? { ...p } : EMPTY_PROJECT)
    } else if (kind === "member") {
      const m = members.find((x) => x.userId === id)
      setMDraft(m ? { ...m } : EMPTY_MEMBER)
    } else {
      const t = tasks.find((x) => x.id === id)
      setTDraft(t ? { ...t } : { ...EMPTY_TASK, projectId: projects[0]?.id ?? NONE })
    }
    setDialog(kind)
  }

  /* --- Guardar con validación y Spinner --- */
  const save = async (e: FormEvent, validation: string, commit: () => void, log: string) => {
    e.preventDefault()
    if (validation) {
      setError(validation)
      return
    }
    setError("")
    setSaving(true)
    await wait() // simula la petición al backend
    commit()
    addLog(log)
    setSaving(false)
    setDialog(null)
  }

  const submitProject = (e: FormEvent) =>
    save(
      e,
      pDraft.title.trim().length < 3 ? "El nombre del proyecto debe tener al menos 3 caracteres." : "",
      () =>
        setProjects((prev) =>
          editId
            ? prev.map((p) => (p.id === editId ? { ...pDraft, id: editId } : p))
            : [...prev, { ...pDraft, id: nextId("P", prev.map((p) => p.id)) }]
        ),
      `${editId ? "Actualizaste" : "Creaste"} el proyecto ${pDraft.title}`
    )

  const submitMember = (e: FormEvent) => {
    const msg =
      mDraft.name.trim().length < 3 ? "El nombre debe tener al menos 3 caracteres."
      : !/^\S+@\S+\.\S+$/.test(mDraft.email) ? "Escribe un email válido."
      : mDraft.phone && !/^\d{9}$/.test(mDraft.phone) ? "El teléfono debe tener 9 dígitos."
      : ""
    return save(
      e,
      msg,
      () =>
        setMembers((prev) =>
          editId
            ? prev.map((m) => (m.userId === editId ? { ...mDraft, userId: editId } : m))
            : [...prev, { ...mDraft, userId: nextId("U", prev.map((m) => m.userId)) }]
        ),
      `${editId ? "Actualizaste" : "Agregaste"} a ${mDraft.name}`
    )
  }

  const submitTask = (e: FormEvent) => {
    const msg =
      tDraft.description.trim().length < 3 ? "La descripción debe tener al menos 3 caracteres."
      : tDraft.projectId === NONE ? "Selecciona un proyecto."
      : !tDraft.deadline ? "Selecciona la fecha límite en el calendario."
      : ""
    return save(
      e,
      msg,
      () =>
        setTasks((prev) =>
          editId
            ? prev.map((t) => (t.id === editId ? { ...tDraft, id: editId } : t))
            : [...prev, { ...tDraft, id: nextId("T", prev.map((t) => t.id)) }]
        ),
      `${editId ? "Actualizaste" : "Creaste"} la tarea ${tDraft.description}`
    )
  }

  /* --- Eliminar --- */
  const deleteProject = (p: Project) => {
    if (!confirm(`¿Eliminar el proyecto "${p.title}" y sus tareas?`)) return
    setProjects((prev) => prev.filter((x) => x.id !== p.id))
    setTasks((prev) => prev.filter((t) => t.projectId !== p.id))
    setMembers((prev) => prev.map((m) => (m.projectId === p.id ? { ...m, projectId: NONE } : m)))
    addLog(`Eliminaste el proyecto ${p.title}`)
  }
  const deleteMember = (m: Member) => {
    if (!confirm(`¿Eliminar a ${m.name}?`)) return
    setMembers((prev) => prev.filter((x) => x.userId !== m.userId))
    setTasks((prev) => prev.map((t) => (t.userId === m.userId ? { ...t, userId: NONE } : t)))
    setProjects((prev) => prev.map((p) => ({ ...p, memberIds: p.memberIds.filter((id) => id !== m.userId) })))
    addLog(`Eliminaste a ${m.name}`)
  }
  const deleteTask = (t: Task) => {
    if (!confirm(`¿Eliminar la tarea "${t.description}"?`)) return
    setTasks((prev) => prev.filter((x) => x.id !== t.id))
    addLog(`Eliminaste la tarea ${t.description}`)
  }

  /* --- Configuración --- */
  const saveSettings = async (e: FormEvent) => {
    e.preventDefault()
    if (!settings.workspace.trim() || !/^\S+@\S+\.\S+$/.test(settings.email)) {
      setSettingsMsg({ ok: false, text: "Escribe un nombre de workspace y un email válido." })
      return
    }
    setSettingsMsg(null)
    setSettingsSaving(true)
    await wait()
    setSettingsSaving(false)
    setSettingsMsg({ ok: true, text: "Configuración guardada correctamente." })
    addLog("Actualizaste la configuración")
  }

  const projectOptions = [{ value: NONE, label: "Sin proyecto" }, ...projects.map((p) => ({ value: p.id, label: p.title }))]
  const memberOptions = [{ value: NONE, label: "Sin asignar" }, ...members.map((m) => ({ value: m.userId, label: m.name }))]
  const goTo = (n: number) => setTaskPage(Math.min(Math.max(1, n), pageCount))

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        {/* ---------- Encabezado ---------- */}
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">{settings.workspace}</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Dashboard de Proyectos</h1>
            <p className="mt-1 text-muted-foreground">Gestiona proyectos, equipo y tareas en un solo lugar.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => openDialog("task")}>
              <Plus /> Nueva tarea
            </Button>
            <Button onClick={() => openDialog("project")}>
              <Plus /> Nuevo proyecto
            </Button>
          </div>
        </header>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList variant="line" className="h-auto w-full flex-wrap justify-start border-b p-0">
            <TabsTrigger value="overview" className="flex-none gap-2 px-3 py-2"><LayoutDashboard /> Resumen</TabsTrigger>
            <TabsTrigger value="projects" className="flex-none gap-2 px-3 py-2"><FolderKanban /> Proyectos</TabsTrigger>
            <TabsTrigger value="team" className="flex-none gap-2 px-3 py-2"><Users /> Equipo</TabsTrigger>
            <TabsTrigger value="tasks" className="flex-none gap-2 px-3 py-2"><ListChecks /> Tareas</TabsTrigger>
            <TabsTrigger value="settings" className="flex-none gap-2 px-3 py-2"><SettingsIcon /> Configuración</TabsTrigger>
          </TabsList>

          {/* ---------- Resumen ---------- */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon={FolderKanban} title="Proyectos" value={projects.length} note={`${projects.filter((p) => p.status === "Completado").length} completados`} />
              <Stat icon={CheckCircle2} title="Tareas completadas" value={`${done}/${tasks.length}`} note={`${tasks.length ? Math.round((done * 100) / tasks.length) : 0}% de avance`} />
              <Stat icon={Clock} title="Tareas pendientes" value={tasks.length - done} note={`${tasks.filter((t) => t.priority === "Urgente" && t.status !== "Completado").length} urgentes sin completar`} />
              <Stat icon={Users} title="Miembros activos" value={`${activeMembers}/${members.length}`} note={`${members.length - activeMembers} inactivos`} />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Avance por proyecto</CardTitle>
                  <CardDescription>Porcentaje de tareas completadas en cada proyecto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {projects.length === 0 && <p className="text-sm text-muted-foreground">Aún no hay proyectos.</p>}
                  {projects.map((p) => (
                    <div key={p.id} className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-medium">{p.title}</span>
                        <span className="flex items-center gap-2">
                          <Pill tone={projectTone[p.status]}>{p.status}</Pill>
                          <span className="w-10 text-right font-semibold tabular-nums">{progress(p.id)}%</span>
                        </span>
                      </div>
                      <Bar value={progress(p.id)} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tareas por estado</CardTitle>
                  <CardDescription>{tasks.length} tareas en total</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {TASK_STATUS.map((s) => {
                    const n = tasks.filter((t) => t.status === s).length
                    return (
                      <div key={s} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <Pill tone={taskTone[s]}>{s}</Pill>
                          <span className="font-semibold tabular-nums">{n}</span>
                        </div>
                        <Bar value={tasks.length ? (n * 100) / tasks.length : 0} />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Actividad reciente</CardTitle>
                <CardDescription>Se actualiza con lo que hagas en el dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                {activity.length === 0 ? (
                  <Empty icon={Clock} title="Aún no hay actividad" hint="Crea o edita un proyecto, miembro o tarea y lo verás aquí." />
                ) : (
                  <ul className="space-y-3 text-sm">
                    {activity.map((a, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- Proyectos ---------- */}
          <TabsContent value="projects" className="space-y-4">
            <SectionHeader
              title="Proyectos"
              description={`${projects.length} ${projects.length === 1 ? "proyecto" : "proyectos"}`}
              action={<Button onClick={() => openDialog("project")}><Plus /> Nuevo proyecto</Button>}
            />
            {projects.length === 0 ? (
              <Card><CardContent><Empty icon={FolderKanban} title="No hay proyectos todavía" hint="Crea el primero con el botón Nuevo proyecto." /></CardContent></Card>
            ) : (
              <div className={`grid md:grid-cols-2 lg:grid-cols-3 ${gap}`}>
                {projects.map((p) => {
                  const total = tasks.filter((t) => t.projectId === p.id).length
                  return (
                    <Card key={p.id} className="gap-0 py-0">
                      <div className={`h-1.5 ${projectStrip[p.status]}`} />
                      <div className="flex flex-1 flex-col gap-4 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 space-y-1">
                            <h3 className="truncate text-base font-semibold">{p.title}</h3>
                            <p className="line-clamp-2 text-sm text-muted-foreground">{p.description || "Sin descripción"}</p>
                          </div>
                          <Pill tone={projectTone[p.status]}>{p.status}</Pill>
                        </div>

                        <div>
                          <div className="mb-1.5 flex justify-between text-sm">
                            <span className="text-muted-foreground">Progreso · {total} tareas</span>
                            <span className="font-semibold tabular-nums">{progress(p.id)}%</span>
                          </div>
                          <Bar value={progress(p.id)} />
                        </div>

                        <div className="flex items-center gap-3">
                          {p.memberIds.length === 0 ? (
                            <span className="text-sm text-muted-foreground">Sin miembros</span>
                          ) : (
                            <AvatarStack names={p.memberIds.map(memberName)} />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {p.memberIds.length} {p.memberIds.length === 1 ? "miembro" : "miembros"}
                          </span>
                        </div>

                        <div className="mt-auto flex flex-wrap gap-2 border-t pt-3">
                          <Button size="sm" variant="ghost" onClick={() => setDetailId(p.id)}><Eye /> Ver detalles</Button>
                          <Button size="sm" variant="outline" onClick={() => openDialog("project", p.id)}><Pencil /> Editar</Button>
                          <Button size="sm" variant="ghost" className="ml-auto text-destructive hover:text-destructive" onClick={() => deleteProject(p)}>
                            <Trash2 /> Eliminar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* ---------- Equipo ---------- */}
          <TabsContent value="team" className="space-y-4">
            <SectionHeader
              title="Equipo"
              description={`${members.length} miembros, ${activeMembers} activos`}
              action={<Button onClick={() => openDialog("member")}><Plus /> Nuevo miembro</Button>}
            />
            <Card className="py-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="pl-4">Miembro</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Nacimiento</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="pr-4 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}><Empty icon={Users} title="No hay miembros" hint="Agrega a la primera persona del equipo." /></TableCell>
                    </TableRow>
                  )}
                  {members.map((m) => (
                    <TableRow key={m.userId}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 font-semibold text-primary">{initials(m.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium leading-tight">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.userId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{m.role}</TableCell>
                      <TableCell>{m.position || "—"}</TableCell>
                      <TableCell>
                        <p className="flex items-center gap-1.5"><Mail className="size-3.5 text-muted-foreground" />{m.email}</p>
                        {m.phone && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="size-3.5" />{m.phone}</p>}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{fmt(m.birthdate)}</TableCell>
                      <TableCell>{projectName(m.projectId)}</TableCell>
                      <TableCell>
                        <Pill tone={m.isActive ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}>
                          <span className={`size-1.5 rounded-full ${m.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {m.isActive ? "Activo" : "Inactivo"}
                        </Pill>
                      </TableCell>
                      <TableCell className="pr-4">
                        <div className="flex justify-end gap-1">
                          <Button size="icon-sm" variant="ghost" aria-label={`Editar a ${m.name}`} onClick={() => openDialog("member", m.userId)}><Pencil /></Button>
                          <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label={`Eliminar a ${m.name}`} onClick={() => deleteMember(m)}><Trash2 /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* ---------- Tareas ---------- */}
          <TabsContent value="tasks" className="space-y-4">
            <SectionHeader
              title="Tareas"
              description={`${tasks.length} tareas, ${done} completadas`}
              action={<Button onClick={() => openDialog("task")}><Plus /> Nueva tarea</Button>}
            />
            <Card className="py-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="pl-4">Descripción</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Asignado a</TableHead>
                    <TableHead>Fecha límite</TableHead>
                    <TableHead className="pr-4 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7}><Empty icon={ListChecks} title="No hay tareas" hint="Crea una tarea con el botón Nueva tarea." /></TableCell>
                    </TableRow>
                  )}
                  {pageTasks.map((t) => {
                    const overdue = !!t.deadline && t.status !== "Completado" && t.deadline < today
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="pl-4 font-medium">{t.description}</TableCell>
                        <TableCell>{projectName(t.projectId)}</TableCell>
                        <TableCell><Pill tone={taskTone[t.status]}>{t.status}</Pill></TableCell>
                        <TableCell><Pill tone={priorityTone[t.priority]}>{t.priority}</Pill></TableCell>
                        <TableCell>{memberName(t.userId)}</TableCell>
                        <TableCell className={`whitespace-nowrap ${overdue ? "font-medium text-destructive" : ""}`}>
                          <span className="flex items-center gap-1.5">
                            {overdue ? <AlertTriangle className="size-3.5" /> : <CalendarDays className="size-3.5 text-muted-foreground" />}
                            {fmt(t.deadline)}
                          </span>
                        </TableCell>
                        <TableCell className="pr-4">
                          <div className="flex justify-end gap-1">
                            <Button size="icon-sm" variant="ghost" aria-label="Editar tarea" onClick={() => openDialog("task", t.id)}><Pencil /></Button>
                            <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label="Eliminar tarea" onClick={() => deleteTask(t)}><Trash2 /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  {tasks.length === 0 ? "Sin resultados" : `Mostrando ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, tasks.length)} de ${tasks.length}`}
                </p>
                <Pagination className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); goTo(page - 1) }} />
                    </PaginationItem>
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                      <PaginationItem key={n}>
                        <PaginationLink href="#" isActive={n === page} onClick={(e) => { e.preventDefault(); goTo(n) }}>
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); goTo(page + 1) }} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </Card>
          </TabsContent>

          {/* ---------- Configuración ---------- */}
          <TabsContent value="settings" className="space-y-4">
            <SectionHeader title="Configuración" description="Preferencias simuladas del workspace" />
            <form onSubmit={saveSettings} className="grid max-w-2xl gap-4">
              {settingsMsg && (
                <Alert variant={settingsMsg.ok ? "default" : "destructive"}>
                  <AlertTitle>{settingsMsg.ok ? "Cambios guardados" : "Revisa el formulario"}</AlertTitle>
                  <AlertDescription>{settingsMsg.text}</AlertDescription>
                </Alert>
              )}
              <Card>
                <CardHeader>
                  <CardTitle>General</CardTitle>
                  <CardDescription>Cómo se identifica tu workspace</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Field label="Nombre del workspace">
                    <Input value={settings.workspace} onChange={(e) => setSettings({ ...settings, workspace: e.target.value })} />
                  </Field>
                  <Field label="Email de contacto">
                    <Input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                  </Field>
                  <Field label="Idioma">
                    <Choice
                      value={settings.language}
                      onChange={(v) => setSettings({ ...settings, language: v })}
                      options={[{ value: "es", label: "Español" }, { value: "en", label: "English" }, { value: "pt", label: "Português" }]}
                    />
                  </Field>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Preferencias</CardTitle>
                  <CardDescription>Ajustes de avisos y de la vista</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <label className="flex items-center justify-between gap-4 rounded-lg border p-3 text-sm">
                    <span>
                      <span className="block font-medium">Notificaciones por email</span>
                      <span className="text-muted-foreground">Recibe avisos cuando cambie una tarea.</span>
                    </span>
                    <Switch checked={settings.notifications} onCheckedChange={(v) => setSettings({ ...settings, notifications: v })} />
                  </label>
                  <label className="flex items-center justify-between gap-4 rounded-lg border p-3 text-sm">
                    <span>
                      <span className="block font-medium">Modo compacto</span>
                      <span className="text-muted-foreground">Reduce el espacio entre las tarjetas de proyectos.</span>
                    </span>
                    <Switch checked={settings.compact} onCheckedChange={(v) => setSettings({ ...settings, compact: v })} />
                  </label>
                </CardContent>
              </Card>
              <Button type="submit" disabled={settingsSaving} className="w-fit">
                {settingsSaving && <Spinner />}
                {settingsSaving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      {/* ---------- Detalle de proyecto ---------- */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent className="sm:max-w-[525px]">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>{detail.title}</DialogTitle>
                <DialogDescription>{detail.description || "Sin descripción"}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Pill tone={projectTone[detail.status]}>{detail.status}</Pill>
                  <span>Progreso: {progress(detail.id)}%</span>
                </div>
                <div>
                  <p className="mb-1 font-medium">Equipo ({detail.memberIds.length})</p>
                  {detail.memberIds.length === 0 ? (
                    <p className="text-muted-foreground">Sin miembros asignados.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {detail.memberIds.map((id) => <li key={id}>{memberName(id)}</li>)}
                    </ul>
                  )}
                </div>
                <div>
                  <p className="mb-1 font-medium">Tareas</p>
                  {tasks.filter((t) => t.projectId === detail.id).length === 0 ? (
                    <p className="text-muted-foreground">Sin tareas.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {tasks.filter((t) => t.projectId === detail.id).map((t) => (
                        <li key={t.id}>{t.description} ({t.status})</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ---------- Formulario de proyecto ---------- */}
      <FormDialog
        open={dialog === "project"}
        onOpenChange={(o) => !o && setDialog(null)}
        title={editId ? "Editar proyecto" : "Nuevo proyecto"}
        error={error}
        saving={saving}
        onSubmit={submitProject}
      >
        <Field label="Nombre del proyecto *">
          <Input value={pDraft.title} onChange={(e) => setPDraft({ ...pDraft, title: e.target.value })} placeholder="Mi Proyecto Increíble" />
        </Field>
        <Field label="Descripción">
          <Input value={pDraft.description} onChange={(e) => setPDraft({ ...pDraft, description: e.target.value })} />
        </Field>
        <Field label="Estado">
          <Choice value={pDraft.status} onChange={(v) => setPDraft({ ...pDraft, status: v })} options={opts(PROJECT_STATUS)} />
        </Field>
        <Field label="Miembros del equipo">
          <div className="grid gap-2 rounded-lg border p-3">
            {members.map((m) => (
              <label key={m.userId} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={pDraft.memberIds.includes(m.userId)}
                  onCheckedChange={(c) =>
                    setPDraft({
                      ...pDraft,
                      memberIds: c ? [...pDraft.memberIds, m.userId] : pDraft.memberIds.filter((id) => id !== m.userId),
                    })
                  }
                />
                {m.name}
              </label>
            ))}
          </div>
        </Field>
      </FormDialog>

      {/* ---------- Formulario de miembro ---------- */}
      <FormDialog
        open={dialog === "member"}
        onOpenChange={(o) => !o && setDialog(null)}
        title={editId ? "Editar miembro" : "Nuevo miembro"}
        error={error}
        saving={saving}
        onSubmit={submitMember}
      >
        <Field label="Nombre *">
          <Input value={mDraft.name} onChange={(e) => setMDraft({ ...mDraft, name: e.target.value })} />
        </Field>
        <Field label="Email *">
          <Input value={mDraft.email} onChange={(e) => setMDraft({ ...mDraft, email: e.target.value })} />
        </Field>
        <Field label="Rol">
          <Choice value={mDraft.role} onChange={(v) => setMDraft({ ...mDraft, role: v })} options={opts(ROLES)} />
        </Field>
        <Field label="Cargo">
          <Input value={mDraft.position} onChange={(e) => setMDraft({ ...mDraft, position: e.target.value })} />
        </Field>
        <Field label="Fecha de nacimiento">
          <DatePicker value={mDraft.birthdate} onChange={(d) => setMDraft({ ...mDraft, birthdate: d })} placeholder="Selecciona una fecha" />
        </Field>
        <Field label="Teléfono (9 dígitos)">
          <Input value={mDraft.phone} onChange={(e) => setMDraft({ ...mDraft, phone: e.target.value })} />
        </Field>
        <Field label="Proyecto">
          <Choice value={mDraft.projectId} onChange={(v) => setMDraft({ ...mDraft, projectId: v })} options={projectOptions} />
        </Field>
        <label className="flex items-center justify-between rounded-lg border p-3 text-sm">
          Miembro activo
          <Switch checked={mDraft.isActive} onCheckedChange={(v) => setMDraft({ ...mDraft, isActive: v })} />
        </label>
      </FormDialog>

      {/* ---------- Formulario de tarea ---------- */}
      <FormDialog
        open={dialog === "task"}
        onOpenChange={(o) => !o && setDialog(null)}
        title={editId ? "Editar tarea" : "Nueva tarea"}
        error={error}
        saving={saving}
        onSubmit={submitTask}
      >
        <Field label="Descripción *">
          <Input value={tDraft.description} onChange={(e) => setTDraft({ ...tDraft, description: e.target.value })} />
        </Field>
        <Field label="Proyecto *">
          <Choice value={tDraft.projectId} onChange={(v) => setTDraft({ ...tDraft, projectId: v })} options={projectOptions} />
        </Field>
        <Field label="Estado">
          <Choice value={tDraft.status} onChange={(v) => setTDraft({ ...tDraft, status: v })} options={opts(TASK_STATUS)} />
        </Field>
        <Field label="Prioridad">
          <Choice value={tDraft.priority} onChange={(v) => setTDraft({ ...tDraft, priority: v })} options={opts(PRIORITIES)} />
        </Field>
        <Field label="Asignado a">
          <Choice value={tDraft.userId} onChange={(v) => setTDraft({ ...tDraft, userId: v })} options={memberOptions} />
        </Field>
        <Field label="Fecha límite *">
          <DatePicker value={tDraft.deadline} onChange={(d) => setTDraft({ ...tDraft, deadline: d })} placeholder="Selecciona una fecha" />
        </Field>
      </FormDialog>
    </div>
  )
}
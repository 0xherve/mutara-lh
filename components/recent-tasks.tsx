import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, MilkIcon as Cow, Stethoscope, Heart } from "lucide-react"
import type { Database } from "@/types/supabase"

type Task = Database["public"]["Tables"]["tasks"]["Row"]

interface RecentTasksProps {
  tasks: Task[]
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  if (tasks.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No pending tasks found.</div>
  }

  return (
    <div className="space-y-8">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center">
          <Avatar className="h-9 w-9 border">
            {task.title.toLowerCase().includes("health") || task.title.toLowerCase().includes("vaccin") ? (
              <Stethoscope className="h-4 w-4 text-blue-500" />
            ) : task.title.toLowerCase().includes("breed") ? (
              <Heart className="h-4 w-4 text-pink-500" />
            ) : (
              <Cow className="h-4 w-4 text-green-500" />
            )}
            <AvatarFallback>{task.title[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{task.title}</p>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
              </p>
            </div>
          </div>
          <div className="ml-auto">
            <Badge
              variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"}
            >
              {task.priority}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}


import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AppBar() {
  return (
    <header className="w-full shadow-md bg-white px-6 py-4 flex items-center justify-between rounded-b-2xl">
      <h1 className="text-xl font-semibold">Procurement Negotiator</h1>
      <Button variant="ghost" className="relative rounded-full p-2">
        <Bell className="w-6 h-6 text-gray-700" />
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 rounded-full h-5 w-5 text-xs p-0 flex items-center justify-center"
        >
          3
        </Badge>
      </Button>
    </header>
  )
}

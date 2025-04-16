import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

type UploadedFile = {
  name: string;
  size: string;
};

export default function CreateFeaturePage() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [showCalendar, setShowCalendar] = useState(false)
  const uploadedFiles: UploadedFile[] = [
    { name: "User_interviews.pdf", size: "10.9mb" },
    { name: "Sketches_01.jpeg", size: "7.48mb" },
    { name: "Sketches_02.jpeg", size: "6.0mb" },
  ];

  return (
    <div className="flex bg-gray-100 p-8 space-x-6 mt-15">
      {/* Left: Create Feature Form */}
      <Card className="w-2/4 max-w-3xl mx-auto p-6 shadow-xl border">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Create Feature</h2>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Hikoot app concept development" />
        </div>

        <div className="space-y-2">
          <Label>Day</Label>
          <Button
            variant="outline"
            onClick={() => setShowCalendar((prev) => !prev)}
            className="flex items-center justify-between w-full"
          >
            <span>
              {date ? format(date, "PPP") : "Choose a date"}
            </span>
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showCalendar ? "rotate-180" : ""}`} />
          </Button>

          <AnimatePresence>
            {showCalendar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="mt-2 rounded-md border"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {date && (
          <p className="text-sm text-green-600">
            This event will take place on the {format(date, "do 'of' MMMM yyyy")} from 10:15am until 1:00pm
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Add description about your feature..." />
          <Button variant="outline">+ Add Test Files</Button>
        </div>
      </CardContent>
    </Card>

      {/* Middle: Team & Clients */}
      <Card className="w-1.2/4 p-6">
        <CardContent className="space-y-4">
          <div>
            <Label>Add team members</Label>
            <div className="flex space-x-2 mt-2">
              <span className="bg-red-100 px-2 py-1 rounded text-sm">LA</span>
              <span className="bg-blue-100 px-2 py-1 rounded text-sm">AM</span>
              <span className="bg-yellow-100 px-2 py-1 rounded text-sm">ES</span>
              <Button variant="outline" size="icon">+</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Add Clients</Label>
            <div className="flex gap-2">
              <Input id="clientEmail" placeholder="Email invitation" />
              <Button>Send</Button>
            </div>
          </div>

          <div>
            <Label>Notify people on</Label>
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="slack" defaultChecked />
                <Label htmlFor="slack">Slack</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hipchat" />
                <Label htmlFor="hipchat">HipChat</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="reminder">Set reminder</Label>
            <Input id="reminder" placeholder="2 hours before event" />
          </div>

          <Button className="w-full">Create event</Button>
        </CardContent>
      </Card>

      {/* Right: Uploader */}
      <Card className="w-70 p-4">
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-lg">Uploader</h3>
          <p className="text-sm text-muted-foreground">14 March</p>

          <div className="space-y-4">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{file.size}</span>
                  <Button size="icon" variant="ghost" className="text-red-500">×</Button>
                </div>
                <div className="h-24 bg-gray-200 rounded" />
                <Button variant="link" className="p-0 text-blue-600">View file</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

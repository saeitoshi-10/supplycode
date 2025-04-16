import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/MeetingUI/card";
import { Button } from "@/components/MeetingUI/button";
import { CustomCalendar } from "@/components/MeetingUI/calendar";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

interface Task {
  title: string;
  time?: string;
  labels?: string[];
  attachments?: number;
}

interface Milestone {
  date: string;
  deadline: string;
  tasks: Task[];
}

const MilestoneBoard: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // Simulated API call
    fetch("/api/milestones")
      .then((res) => res.json())
      .then((data) => setMilestones(data));
  }, []);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-20 bg-blue-600 text-white shadow-md flex flex-col items-center py-6 space-y-8">
        <div className="text-3xl font-semibold">t.</div>
        <div className="flex flex-col space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-white rounded-lg" />
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-blue-600">Milestones</h1>
          <Button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">
            <FiPlus /> Create new
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {milestones.map((milestone) => (
            <div key={milestone.date} className="w-full">
              <h2 className="text-lg text-blue-500 mb-3">
                {milestone.date} - {milestone.deadline}
              </h2>
              {milestone.tasks.map((task, i) => (
                <motion.div
                  key={i}
                  className={`mb-6 rounded-xl overflow-hidden shadow-lg ${
                    task.title === "Sketching" ? "bg-blue-500 text-white" : "bg-white text-blue-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="rounded-lg border-none">
                    <CardContent className="p-6 space-y-3">
                      <div className="text-lg font-semibold">{task.title}</div>
                      {task.time && <div className="text-sm text-gray-400">{task.time}</div>}
                      <div className="flex flex-wrap gap-3">
                        {task.labels?.map((label) => (
                          <div
                            key={label}
                            className={`text-xs font-medium px-3 py-1 rounded-md ${
                              task.title === "Sketching"
                                ? "bg-white text-blue-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {label}
                          </div>
                        ))}
                      </div>
                      {task.attachments && (
                        <div className="text-sm text-gray-500">
                          {task.attachments} attachment{task.attachments > 1 ? "s" : ""}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Sidebar */}
      <div className="w-96 bg-white shadow-md p-8 flex flex-col gap-8">
        <div>
          <div className="text-sm text-gray-500 mb-2">Calendar</div>
          <div className="text-xl font-semibold text-blue-600">{selectedDate?.toDateString()}</div>
        </div>
        <CustomCalendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
        />
      </div>
    </div>
  );
};

export default MilestoneBoard;

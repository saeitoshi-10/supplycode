import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomCalendar } from "@/components/MeetingUI/calendar";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";  // <-- import for navigation

interface Task {
  id: string; // Add id for task
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

const exampleMilestones: Milestone[] = [
  {
    date: "2025-04-16",
    deadline: "2025-04-20",
    tasks: [
      {
        id: "1",
        title: "Sketching",
        time: "10:00 AM",
        labels: ["Design", "UX"],
        attachments: 2,
      },
      {
        id: "2",
        title: "Team Briefing",
        time: "2:00 PM",
        labels: ["Meeting"],
      },
    ],
  },
  {
    date: "2025-04-17",
    deadline: "2025-04-25",
    tasks: [
      {
        id: "3",
        title: "Prototype Development",
        time: "11:30 AM",
        labels: ["Frontend", "Backend"],
        attachments: 4,
      },
      {
        id: "4",
        title: "User Testing",
        time: "3:00 PM",
        labels: ["Feedback", "QA"],
      },
    ],
  },
];

const MilestoneBoard: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchParams] = useSearchParams();                      
  const projectId = searchParams.get("projectid");       
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setMilestones(exampleMilestones);
    }, 500);
  }, []);

  const handleTaskClick = (taskId: string) => {
    if (!projectId) return;
    navigate(`/submit?projectId=${projectId}&issueId=${taskId}`);
  };

  return (
    <div className="flex h-screen mt-20 bg-white">
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
      <div className="flex-1 p-10 overflow-auto bg-blue-50">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-blue-700">Milestones</h1>
          <Button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-lg shadow">
            <FiPlus className="text-lg" /> Create new
          </Button>
        </div>

        {/* Milestone Grid */}
        <div className="grid grid-cols-3 gap-8 border-t border-blue-200 pt-6">
          {milestones.map((milestone) => (
            <div key={milestone.date} className="w-full border-r last:border-none border-blue-200 pr-6">
              <h2 className="text-lg font-medium text-blue-500 mb-4">
                {milestone.date} → {milestone.deadline}
              </h2>
              {milestone.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  className={`mb-6 rounded-xl overflow-hidden shadow cursor-pointer ${
                    task.title === "Sketching"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-600 border border-blue-100"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleTaskClick(task.id)}
                >
                  <Card className="rounded-lg border-none shadow-none">
                    <CardContent className="p-5 space-y-3">
                      <div className="text-lg font-semibold">{task.title}</div>
                      {task.time && (
                        <div className="text-sm text-blue-300">{task.time}</div>
                      )}
                      <div className="flex flex-wrap gap-2">
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
                        <div className="text-sm text-blue-300">
                          📎 {task.attachments} attachment{task.attachments > 1 ? "s" : ""}
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
      <div className="w-80 bg-white shadow-md p-8 flex flex-col gap-8">
        <div>
          <div className="text-sm text-gray-500 mb-2">Calendar</div>
          <div className="text-xl font-semibold text-blue-600">
            {selectedDate?.toDateString()}
          </div>
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

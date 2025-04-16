import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {CustomCalendar} from "@/components/MeetingUI/calendar";
import axios from "axios";
import {Project,Issue,ProjectsResponse} from "../models/project.types";
import { useNavigate } from "react-router-dom";


const ProjectDashboard = () => {
  const [projects, setProjects] = useState<ProjectsResponse>({ asCreator: [], asContributor: [] });
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

//   useEffect(() => {
//     const fetchProjects = async () => {
//       const res = await axios.get<ProjectsResponse>("/api/projects/me");
//       setProjects(res.data);
//     };
//     fetchProjects();
//   }, []);

  const getClosestIssue = (issues: Issue[]) =>
    [...issues].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];
  const renderProjects = (title: string, list: Project[], navigate: ReturnType<typeof useNavigate>) => {
    
  
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">{title}</h2>
        <div className="grid grid-cols-3 gap-8">
          {list.map((proj) => {
            const closestIssue = getClosestIssue(proj.issues);
            return (
              <motion.div
                key={proj.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl p-5 shadow-md border border-blue-100 cursor-pointer"
                onClick={() => navigate(`/milestone?id=${proj.id}`)}
              >
                <div className="mb-3">
                  <h3 className="text-xl font-semibold text-blue-600">{proj.name}</h3>
                  <p className="text-sm text-gray-500">{proj.organization}</p>
                  <p className="text-sm text-gray-400">By {proj.creator}</p>
                </div>
                {closestIssue ? (
                  <Card className="border-none shadow-none bg-blue-50">
                    <CardContent className="p-4 space-y-2">
                      <div className="text-sm font-medium text-blue-700">{closestIssue.title}</div>
                      <div className="text-xs text-blue-400">Due {closestIssue.deadline}</div>
                      <div className="flex flex-wrap gap-2">
                        {closestIssue.labels?.map((l) => (
                          <span key={l} className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                            {l}
                          </span>
                        ))}
                      </div>
                      {closestIssue.attachments && (
                        <div className="text-xs text-blue-300">
                          📎 {closestIssue.attachments} attachment(s)
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <p className="text-sm text-blue-300">No issues yet</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };
  

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-20 bg-blue-600 text-white shadow-md flex flex-col items-center py-6 space-y-8 z-25">
        <div className="text-3xl font-semibold">t.</div>
        <div className="flex flex-col space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-white rounded-lg" />
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-auto bg-blue-50 mt-15">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-blue-700">Projects</h1>
          <Button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-lg shadow">
            <FiPlus className="text-lg" /> New Project
          </Button>
        </div>

        {renderProjects("Created by Me", projects.asCreator, navigate)}
        {renderProjects("Contributing To", projects.asContributor, navigate)}
      </div>

      {/* Calendar Sidebar */}
      <div className="w-80 bg-white shadow-md p-8 flex flex-col gap-8 mt-15">
        <div>
          <div className="text-sm text-gray-500 mb-2">Calendar</div>
          <div className="text-xl font-semibold text-blue-600">
            {selectedDate?.toDateString()}
          </div>
        </div>
        <CustomCalendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
      </div>
    </div>
  );
};

export default ProjectDashboard;

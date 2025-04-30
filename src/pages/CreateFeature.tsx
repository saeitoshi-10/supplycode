
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";


export default function CreateFeaturePage() {
  const { projectId, issueId } = useParams<{ projectId: string; issueId: string }>();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [description, setDescription] = useState("");
  const [notifySlack, setNotifySlack] = useState(true);
  const [notifyHipchat, setNotifyHipchat] = useState(false);
  const [reminder, setReminder] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing issue when editing
  useEffect(() => {
    if (!issueId||!projectId) return;
    setLoading(true);
    fetch(`http://localhost:3001/issues/${issueId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch issue');
        return res.json();
      })
      .then(data => {
        setTitle(data.title);
        setDate(new Date(data.date));
        setDescription(data.description);
        setNotifySlack(data.notify?.slack);
        setNotifyHipchat(data.notify?.hipchat);
        setReminder(data.reminder);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [issueId, projectId]);

  const handleSubmit = () => {
    if(!projectId) return;
    setLoading(true);
    setError(null);
    const payload = {
      projectId: parseInt(projectId, 10),
      title,
      date: date?.toISOString(),
      description,
      notify: { slack: notifySlack, hipchat: notifyHipchat },
      reminder
    };

    const url = issueId
      ? `http://localhost:3001/issues/${issueId}`
      : `http://localhost:3001/issues`;
    const method = issueId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Save failed');
        return res.json();
      })
      .then(data => {
        navigate(`/projects/${projectId}/issues/${data.id}`);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

 

  return (
    <div className="flex bg-gray-100 p-8 space-x-6 mt-15">
      {/* Left: Dynamic Create/Edit Feature Form */}
      <Card className="w-2/4 max-w-3xl mx-auto p-6 shadow-xl border">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            {issueId ? 'Edit Feature' : 'Create Feature'} (Project {projectId})
          </h2>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Day</Label>
            <Button
              variant="outline"
              onClick={() => setShowCalendar(prev => !prev)}
              className="flex items-center justify-between w-full"
            >
              <span>{date ? format(date, "PPP") : "Choose a date"}</span>
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
            </Button>

            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
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
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div>
            <Label>Notify people on</Label>
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="slack" checked={notifySlack} onCheckedChange={c => setNotifySlack(Boolean(c))} />
                <Label htmlFor="slack">Slack</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hipchat" checked={notifyHipchat} onCheckedChange={c => setNotifyHipchat(Boolean(c))} />
                <Label htmlFor="hipchat">HipChat</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder">Set reminder</Label>
            <Input id="reminder" placeholder="2 hours before event" value={reminder} onChange={e => setReminder(e.target.value)} />
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={!title || !date}>
            {issueId ? 'Save Changes' : 'Create Event'}
          </Button>
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
      
    </div>
  );
}

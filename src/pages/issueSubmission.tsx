
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";

type FileEntry = {
  filename: string;
  hash: string;
  file: File | null;
  changeType: string;
};


export default function SubmitPage() {
  const [searchParams] = useSearchParams();                      // ← hook for query params :contentReference[oaicite:0]{index=0}
  const projectId = searchParams.get("projectid");
  const issueId = searchParams.get("issueid");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [preFiles, setPreFiles] = useState<FileEntry[]>([]);
  const [postFiles, setPostFiles] = useState<FileEntry[]>([]);
  const [dialogState, setDialogState] = useState<{ type: "pre" | "post"; open: boolean }>({ type: "pre", open: false });
  const [newFileData, setNewFileData] = useState<FileEntry>({ filename: "", hash: "", file: null, changeType: "changed" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!issueId) return;
    setLoading(true);
    fetch(`http://localhost:3001/projects/${projectId}/issues/${issueId}/submission`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load submission');
        return res.json();
      })
      .then((data: { name: string; preFiles: FileEntry[]; postFiles: FileEntry[] }) => {
        setName(data.name);
        setPreFiles(data.preFiles);
        setPostFiles(data.postFiles);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId, issueId]);

  const handleAddFile = () => {
    const entry = { ...newFileData };
    if (dialogState.type === "pre") setPreFiles(prev => [...prev, entry]);
    else setPostFiles(prev => [...prev, entry]);

    setNewFileData({ filename: "", hash: "", file: null, changeType: "changed" });
    setDialogState(prev => ({ ...prev, open: false }));
  };

  const renderFileList = (files: FileEntry[]) => (
    <div className="grid gap-3">
      {files.map((file, idx) => (
        <div key={idx} className="rounded-xl border p-4 bg-blue-50/40">
          <div className="font-medium text-blue-800">{file.filename}</div>
          <div className="text-sm text-blue-700">{file.changeType} — {file.file?.name}</div>
          <div className="text-xs text-blue-500">Hash: {file.hash}</div>
        </div>
      ))}
    </div>
  );

  const handleSubmit = () => {
    setLoading(true);
    setError(null);

    // Build link object in expected framework
    const materials = preFiles.reduce((acc, file) => {
      acc[file.filename] = { sha256: file.hash };
      return acc;
    }, {} as Record<string, { sha256: string }>);

    const products = postFiles.reduce((acc, file) => {
      acc[file.filename] = { sha256: file.hash };
      return acc;
    }, {} as Record<string, { sha256: string }>);

    const linkPayload = {
      _type: "link",
      name: "submit",
      command: ["submit", `project:${projectId}`, `issue:${issueId}`],
      materials,
      products,
    };

    const url = `http://localhost:3001/projects/${projectId}/issues/${issueId}/submission`;
    const method = issueId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linkPayload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      })
      .then(() => {
        navigate(`/projects/${projectId}/issues/${issueId}/submission`);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-30 mb-40"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-6 border-blue-400 shadow-md">
        <CardHeader>
          <CardTitle className="text-blue-700">Project Submission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-blue-700 p-2">Name</Label>
            <Input
              className="border-blue-300 focus:ring-blue-400"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-600">
            Project: {projectId} &nbsp;|&nbsp; Issue: {issueId || 'New Submission'}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="pre" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-blue-100 border border-blue-300">
          <TabsTrigger value="pre">Pre-Commit</TabsTrigger>
          <TabsTrigger value="post">Post-Commit</TabsTrigger>
        </TabsList>

        <TabsContent value="pre">
          <Card className="mt-4 border-blue-300">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-blue-700">Pre-Commit Files</CardTitle>
              <Dialog open={dialogState.open && dialogState.type === "pre"}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setDialogState({ type: "pre", open: true })}
                  >
                    Add File
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-blue-300">
                  <div className="space-y-4">
                    <Label className="text-blue-700">File Name</Label>
                    <Input
                      className="border-blue-300 focus:ring-blue-400"
                      value={newFileData.filename}
                      onChange={e => setNewFileData({ ...newFileData, filename: e.target.value })}
                    />

                    <Label className="text-blue-700">Upload File</Label>
                    <Input
                      className="border-blue-300 focus:ring-blue-400"
                      type="file"
                      onChange={e => setNewFileData({ ...newFileData, file: e.target.files?.[0] || null })}
                    />

                    <Label className="text-blue-700">File Hash</Label>
                    <Input
                      className="border-blue-300 focus:ring-blue-400"
                      value={newFileData.hash}
                      onChange={e => setNewFileData({ ...newFileData, hash: e.target.value })}
                    />

                    <Label className="text-blue-700">File Change Type</Label>
                    <Select
                      value={newFileData.changeType}
                      onValueChange={val => setNewFileData({ ...newFileData, changeType: val })}
                    >
                      <SelectTrigger className="border-blue-300 focus:ring-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="changed">Changed</SelectItem>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddFile}
                    >
                      Submit File
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>{renderFileList(preFiles)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="post">
          <Card className="mt-4 border-blue-300">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-blue-700">Post-Commit Files</CardTitle>
              <Dialog open={dialogState.open && dialogState.type === "post"}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setDialogState({ type: "post", open: true })}
                  >
                    Add File
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-blue-300">
                  <div className="space-y-4">
                    <Label className="text-blue-700">File Name</Label>
                    <Input
                      className="border-blue-300 focus:ring-blue-400"
                      value={newFileData.filename}
                      onChange={e => setNewFileData({ ...newFileData, filename: e.target.value })}
                    />

                    <Label className="text-blue-700">Upload File</Label>
                    <Input
                      className="border-blue-300 focus:ring-blue-400"
                      type="file"
                      onChange={e => setNewFileData({ ...newFileData, file: e.target.files?.[0] || null })}
                    />

                    <Label className="text-blue-700">File Hash</Label>
                    <Input
                      className="border-blue-300 focus:ring-blue-400"
                      value={newFileData.hash}
                      onChange={e => setNewFileData({ ...newFileData, hash: e.target.value })}
                    />

                    <Label className="text-blue-700">File Change Type</Label>
                    <Select
                      value={newFileData.changeType}
                      onValueChange={val => setNewFileData({ ...newFileData, changeType: val })}
                    >
                      <SelectTrigger className="border-blue-300 focus:ring-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="changed">Changed</SelectItem>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddFile}
                    >
                      Submit File
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>{renderFileList(postFiles)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white"
        onClick={handleSubmit}
      >
        Submit Project
      </Button>
    </motion.div>
  );
}

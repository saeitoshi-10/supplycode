import { useState } from "react";
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

const SubmitPage = () => {
  const [name, setName] = useState("");
  const [preFiles, setPreFiles] = useState<any[]>([]);
  const [postFiles, setPostFiles] = useState<any[]>([]);
  const [dialogState, setDialogState] = useState({ type: "pre", open: false });
  const [newFileData, setNewFileData] = useState<{
    filename: string;
    hash: string;
    file: File | null;
    changeType: string;
  }>({ filename: "", hash: "", file: null, changeType: "changed" });

  const handleAddFile = () => {
    const entry = { ...newFileData };
    if (dialogState.type === "pre") {
      setPreFiles([...preFiles, entry]);
    } else {
      setPostFiles([...postFiles, entry]);
    }
    setNewFileData({
      filename: "",
      hash: "",
      file: null,
      changeType: "changed",
    });
    setDialogState({ ...dialogState, open: false });
  };

  const renderFileList = (files: any[]) => (
    <div className="grid gap-3">
      {files.map((file, idx) => (
        <div key={idx} className="rounded-xl border p-4 bg-blue-50/40">
          <div className="font-medium text-blue-800">{file.filename}</div>
          <div className="text-sm text-blue-700">
            {file.changeType} — {file.file?.name}
          </div>
          <div className="text-xs text-blue-500">Hash: {file.hash}</div>
        </div>
      ))}
    </div>
  );

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
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
                      onChange={(e) =>
                        setNewFileData({
                          ...newFileData,
                          filename: e.target.value,
                        })
                      }
                    />

                    <Label className="text-blue-700">Upload File</Label>
                    <Input
                      className="border-blue-300 focus:ring-blue-400"
                      type="file"
                      onChange={(e) =>
                        setNewFileData({
                          ...newFileData,
                          file: e.target.files?.[0] || null,
                        })
                      }
                    />

                    <Label className="text-blue-700">File Hash</Label>
                    <Input
                      className="border-blue-300 focus:ring-blue-400"
                      value={newFileData.hash}
                      onChange={(e) =>
                        setNewFileData({ ...newFileData, hash: e.target.value })
                      }
                    />

                    <Label className="text-blue-700">File Change Type</Label>
                    <Select
                      value={newFileData.changeType}
                      onValueChange={(val) =>
                        setNewFileData({ ...newFileData, changeType: val })
                      }
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
                      onChange={(e) =>
                        setNewFileData({
                          ...newFileData,
                          filename: e.target.value,
                        })
                      }
                    />

                    <Label className="text-blue-700">Upload File</Label>
                    <Input
                      className="border-blue-300 focus:ring-blue-400"
                      type="file"
                      onChange={(e) =>
                        setNewFileData({
                          ...newFileData,
                          file: e.target.files?.[0] || null,
                        })
                      }
                    />

                    <Label className="text-blue-700">File Hash</Label>
                    <Input
                      className="border-blue-300 focus:ring-blue-400"
                      value={newFileData.hash}
                      onChange={(e) =>
                        setNewFileData({ ...newFileData, hash: e.target.value })
                      }
                    />

                    <Label className="text-blue-700">File Change Type</Label>
                    <Select
                      value={newFileData.changeType}
                      onValueChange={(val) =>
                        setNewFileData({ ...newFileData, changeType: val })
                      }
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
        onClick={() => {
          // Your actual submission logic goes here
          console.log("Submitting:", { name, preFiles, postFiles });
          alert("Project submitted!");
        }}
      >
        Submit Project
      </Button>
    </motion.div>
  );
};

export default SubmitPage;

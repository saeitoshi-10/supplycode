import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  initType: z.enum(["create", "github"]),
  githubRepo: z
    .string()
    .url("Must be a valid URL")
    .regex(
      /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/,
      "Must be a valid GitHub repository URL"
    )
    .optional()
    .or(z.literal("")), 
  email: z.string().email("Invalid email"),
  organization: z.string().min(1, "Organization is required"),
});


type FormValues = z.infer<typeof formSchema>;


const ProjectForm = () => {
  const [contributorInput, setContributorInput] = useState("");
  const [contributors, setContributors] = useState<string[]>([]);
  const [initType, setInitType] = useState<"create" | "github">("create");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      initType: "create",
      githubRepo: "",
      email: "",
      organization: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const fullData = { ...data, contributors };
    console.log("🔧 Project Data:", fullData);
    // call backend/api here
  };

  const addContributor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && contributorInput.trim()) {
      e.preventDefault();
      if (!contributors.includes(contributorInput.trim())) {
        setContributors([...contributors, contributorInput.trim()]);
        setContributorInput("");
      }
    }
  };

  const removeContributor = (id: string) => {
    setContributors(contributors.filter((c) => c !== id));
  };

  return (
    <div className="w-full max-w-4xl h-auto mx-auto p-10 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold mb-6 py-10 text-gray-800">Create Project</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Project Name */}
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Init Type */}
          <FormField
            control={form.control}
            name="initType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initialization Type</FormLabel>
                <Select
                  onValueChange={(val: "create" | "github") => {
                    setInitType(val);
                    field.onChange(val);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="create">Create new project</SelectItem>
                    <SelectItem value="github">Initialize from GitHub</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GitHub Repo */}
          {initType === "github" && (
            <FormField
              control={form.control}
              name="githubRepo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Repository URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Contributors */}
          <div>
            <FormLabel>Contributor GitHub IDs</FormLabel>
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {contributors.map((id, idx) => (
                <span
                  key={idx}
                  className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {id}
                  <button
                    onClick={() => removeContributor(id)}
                    type="button"
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder="Type GitHub ID and press enter"
              value={contributorInput}
              onChange={(e) => setContributorInput(e.target.value)}
              onKeyDown={addContributor}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Organization */}
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Organization</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., openai-org" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-4">
            <Link to="/dashboard">
              Initialize Project
            </Link>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProjectForm;


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Issue name is required"),
  deadline: z.string().min(1, "Deadline is required"),
  assignee: z.string().min(1, "Assignee is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProjectForm() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      deadline: "",
      assignee: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log({
      ...data,
      issueTypes: tags,
    });
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="w-full max-w-4xl h-screen mx-auto p-10 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold mb-6 py-10 text-gray-800">Create Issue</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Issue Name */}
          <div className="mt-5 pt-5 mb-2 pb-3 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter issue name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            </div>

          {/* Deadline */}
          <div className="my-2 py-3 ">
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            </div>
          {/* Issue Type (Tags) */}
          <div className="my-2 py-3 ">
            <FormLabel>Issue Type</FormLabel>
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-xs text-red-500 hover:text-red-700"
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder="Type and press enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
            />
          </div>

          {/* Assignee */}
          <div className="my-2 py-3 ">
          <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alice">Alice</SelectItem>
                      <SelectItem value="bob">Bob</SelectItem>
                      <SelectItem value="charlie">Charlie</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Create Issue
          </Button>
        </form>
      </Form>
    </div>
  );
}

"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isuploading, setIsuploading] = useState(false);
  const router = useRouter();

  //max file size of 670mb
  const MAX_FILE_SIZE = 60 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert("file size too large");
      return;
    }
    if (!title || !description) {
      alert("Title and Description fields are necessary!!!");
      return;
    }

    setIsuploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("orginalSize", file.size.toString());

    try {
      const response = await axios.post("video-upload", formData);
      if (!response.status) {
        console.log("error in uploading video ");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsuploading(false);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-black-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-around">
          <Label htmlFor="title">Title </Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-slate-400 ml-2"
          />
        </div>
        <div className="flex justify-around">
          <Label htmlFor="title">Description </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-slate-400 ml-2"
          />
        </div>
        <div className="flex justify-around">
          <Label htmlFor="title">Video </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border border-slate-400 ml-2"
            required
          />
        </div>
        <Button onClick={() => handleSubmit} disabled={isuploading}>
          Add Video
        </Button>
      </form>
    </div>
  );
}

"use client";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { CldImage } from "next-cloudinary";
import { Card, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Instagram Reel (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Facebook Post (1.91:1)": { width: 1200, height: 630, aspectRatio: "1.91:1" },
  "Facebook Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Facebook Cover (16:9)": { width: 820, height: 312, aspectRatio: "16:9" },
  "Twitter Post (16:9)": { width: 1600, height: 900, aspectRatio: "16:9" },
  "LinkedIn Post (1.91:1)": { width: 1200, height: 627, aspectRatio: "1.91:1" },
  "LinkedIn Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Pinterest Pin (2:3)": { width: 1000, height: 1500, aspectRatio: "2:3" },
  "YouTube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
  "YouTube Shorts (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "TikTok Video (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
};

type SocialFormat = keyof typeof socialFormats;

function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  console.log(imageRef.current?.src);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploadProgress(0);
      const response = await axios.post("/api/image-upload", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(progress);
          }
        },
      });

      setUploadedImage(response.data.publicId);
      setUploadProgress(100);
    } catch (error) {
      console.log(error);
      alert("Failed to upload an image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async () => {
    if (!imageRef.current || !imageRef.current.src) return;

    try {
      await fetch(imageRef.current.src)
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${selectedFormat
            .replace(/\s+/g, "_")
            .toLowerCase()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        });
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Social Media Image Creator
      </h1>
      <Card className="border border-gray-800 px-10 py-5">
        <CardTitle className="text-center text-2xl font-semibold">
          Upload an Image
        </CardTitle>
        <form>
          <Label className="text-lg" htmlFor="picture">
            Picture
          </Label>
          <Input
            id="picture"
            type="file"
            className="max-w-full w-md bg-slate-200 border border-slate-500"
            onChange={handleFileUpload}
          />
        </form>

        {isUploading && (
          <div className="mt-4 max-w-full mx-auto w-full">
            <Progress value={uploadProgress} />
          </div>
        )}

        {uploadedImage && (
          <div className="mt-3">
            <CardTitle className="mb-2">Select Social Media Format</CardTitle>
            <form>
              <Select
                value={selectedFormat}
                onValueChange={(value) =>
                  setSelectedFormat(value as SocialFormat)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.keys(socialFormats).map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </form>

            <div className="mt-3 relative ">
              <h3 className="text-lg font-semibold mb-2">Preview: </h3>
              <div className="flex justify-center">
                {isTransforming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                    <Loader />
                  </div>
                )}

                <CldImage
                  alt="transformed image"
                  width={socialFormats[selectedFormat].width}
                  height={socialFormats[selectedFormat].height}
                  src={uploadedImage}
                  crop="fill"
                  aspectRatio={socialFormats[selectedFormat].aspectRatio}
                  gravity="auto"
                  ref={imageRef}
                  onLoad={() => setIsTransforming(false)}
                />
              </div>

              <Button className="mt-3 mx-auto p-4" onClick={handleDownload}>
                Download {selectedFormat}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default SocialShare;

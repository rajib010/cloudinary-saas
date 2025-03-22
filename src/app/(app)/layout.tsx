"use client";

import React, { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, Share2Icon, UploadIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import HeaderComponent from "@/components/header";

const sideBarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div>
      <Sheet
        open={sidebarOpen}
        onOpenChange={() => setSidebarOpen(!sidebarOpen)}
      >
        <SheetContent side="left" className="max-w-sm w-64">
          <DialogTitle className="sr-only">Navigation Sheet</DialogTitle>
          <SheetTitle className="text-center mt-5">Navigation Bar</SheetTitle>
          <SheetDescription className="flex flex-col gap-5 max-w-sm w-full items-center justify-center">
            {sideBarItems.map((item, index) => (
              <Button key={index} asChild>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={
                    pathname === item.href ? "text-gold-600" : "text-white"
                  }
                >
                  {item.label}
                </Link>
              </Button>
            ))}
          </SheetDescription>
        </SheetContent>
      </Sheet>
      <HeaderComponent
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        handleSignOut={handleSignOut}
      />
      {children}
    </div>
  );
}

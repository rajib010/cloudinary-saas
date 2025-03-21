import {
  SignInButton,
  SignUpButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { LogOutIcon, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";

type HeaderComponentProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  handleSignOut: () => void;
};

export default function HeaderComponent({
  setSidebarOpen,
  sidebarOpen,
  handleSignOut,
}: HeaderComponentProps) {
  const { user } = useUser();
  const emailAddress = user?.emailAddresses[0].emailAddress;

  const handleOpensidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="flex justify-between px-20 items-center h-16 bg-slate-200 shadow-lg">
      <div onClick={handleOpensidebar}>
        <Menu />
      </div>
      <div>
        <SignedOut>
          <div className="flex flex-row gap-4">
            <Button asChild>
              <SignInButton />
            </Button>
            <Button variant={"secondary"} asChild>
              <SignUpButton />
            </Button>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex gap-5">
            {user && (
              <Avatar>
                <AvatarImage
                className="w-8 h-8 rounded"
                  src={user.imageUrl}
                  alt={user.username || emailAddress}
                />
                <AvatarFallback>{user.username || emailAddress}</AvatarFallback>
              </Avatar>
            )}
            <LogOutIcon onClick={handleSignOut}>
              <SignOutButton />
            </LogOutIcon>
          </div>
        </SignedIn>
      </div>
    </header>
  );
}

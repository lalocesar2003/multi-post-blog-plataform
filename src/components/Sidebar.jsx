import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { AlignLeft } from "lucide-react";

export function Sidebar() {
  const authToken = false;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <AlignLeft />
        </Button>
      </SheetTrigger>
      <SheetContent className={"bg-white flex justify-center items-center"}>
        <nav>
          <ul className="flex flex-col items-center gap-5 font-bold text-md">
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/mydata"}>My Data</Link>
            </li>
            {authToken ? (
              <>
                <li>
                  <Button
                    className={
                      "bg-black border border-black rounded-lg text-white font-bold cursor-pointer hover:bg-transparent hover:text-black transition-all duration-200"
                    }
                  >
                    Logout
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    className={
                      "bg-transparent border border-black rounded-lg text-black font-bold cursor-pointer hover:bg-black hover:text-white transition-all duration-200"
                    }
                  >
                    Add Data
                  </Button>
                </li>
              </>
            ) : (
              <li>
                {" "}
                <Button
                  className={
                    "bg-black border border-black rounded-lg text-white font-bold cursor-pointer hover:bg-transparent hover:text-black transition-all duration-200"
                  }
                >
                  Sign In
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

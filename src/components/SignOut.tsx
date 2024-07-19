"use client"

import Image from "next/image"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs"
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SignOut({ user }: Readonly<{ user: KindeUser }>) {
  LogoutLink

  return (
    <>
      {user.picture === null ? (
        <LogoutLink>Log Out</LogoutLink>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Image
              src={user.picture}
              width={35}
              height={35}
              alt="user"
              className="object-covers aspect-square rounded-full"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <LogoutLink>Log Out</LogoutLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

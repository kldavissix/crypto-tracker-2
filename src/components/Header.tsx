import Link from "next/link"
import { FaHive } from "react-icons/fa"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import SignOut from "./SignOut"

export default async function Header() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  return (
    <header>
      <div className="flex items-center justify-between border-b py-5">
        <Link href="/" className="flex items-center gap-x-4">
          <FaHive size={48} />

          <div className="flex flex-col">
            <p className="text-xl">CryptoTracker</p>
            <p className="text-sm">Cryptocurrency Prices by Market Cap</p>
          </div>
        </Link>

        <nav className="flex gap-x-5 text-[14px]">
          <ul className="flex items-center space-x-5">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              {user ? (
                <>
                  <SignOut user={user}></SignOut>
                </>
              ) : (
                <LoginLink>Sign In</LoginLink>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

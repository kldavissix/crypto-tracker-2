import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

import { ThemeProvider } from "@/components/ThemeProvider"
import Container from "@/components/Container"
import { FavoritesProvider } from "@/context/FavoritesContext"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "@/lib/db"
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CrpytoTracker",
  description: "Cryptocurrency Prices by Market Cap",
}

const getInitialFavorites = async (user: KindeUser | null) => {
  let initialFavorites: string[] = []

  if (user && user.id) {
    const favorites = await prisma.cT_Favorite.findMany({
      where: {
        userId: user.id,
      },
      select: {
        coinId: true,
      },
    })

    initialFavorites = favorites.map((favorite) => favorite.coinId)
  }

  return initialFavorites
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  const initialFavorites = await getInitialFavorites(user)

  return (
    <html lang="en">
      <body className={`${inter.className}min-h-screen`}>
        <FavoritesProvider initialFavorites={initialFavorites}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            // enableSystem
            disableTransitionOnChange
          >
            <Container>
              <Header />
              <div className="flex flex-grow flex-col">{children}</div>

              <Footer />
            </Container>
          </ThemeProvider>
        </FavoritesProvider>
      </body>
    </html>
  )
}

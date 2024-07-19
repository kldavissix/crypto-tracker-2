"use server"

import prisma from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

export async function ToggleFavorite(coinId: string, userId: string | null) {
  const { getUser } = getKindeServerSession()

  const user = await getUser()
  if (!user || user.id !== userId) {
    redirect("/api/auth/login")
  }

  try {
    // Check if the record exists
    const existingFavorite = await prisma.cT_Favorite.findUnique({
      where: {
        userId_coinId: {
          userId: user.id,
          coinId: coinId,
        },
      },
    })

    if (existingFavorite) {
      // Delete the record if it exists
      const deletedFavorite = await prisma.cT_Favorite.delete({
        where: {
          userId_coinId: {
            userId: user.id,
            coinId: coinId,
          },
        },
      })
      return "deleted"
    } else {
      // Create the record if it does not exist
      const newFavorite = await prisma.cT_Favorite.create({
        data: {
          userId: user.id,
          coinId: coinId,
        },
      })
      return "created"
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
  }
}

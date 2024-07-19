import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  return NextResponse.json({ error: "blocking function" }, { status: 400 })

  const { userId, coinId } = await request.json()

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  try {
    if (!!coinId) {
      const favorite = await prisma.cT_Favorite.findUnique({
        where: {
          userId_coinId: {
            userId,
            coinId,
          },
        },
      })

      if (favorite) {
        return NextResponse.json(favorite, { status: 200 })
      } else {
        return NextResponse.json(
          { error: "Favorite not found" },
          { status: 404 }
        )
      }
    } else {
      const favorites = await prisma.cT_Favorite.findMany({
        where: {
          userId,
        },
        select: {
          coinId: true,
        },
      })

      return NextResponse.json(
        favorites.map((favorite) => favorite.coinId),
        { status: 200 }
      )
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}

"use client"

import { ToggleFavorite } from "@/actions/toggleFavorite"
import { useFavorites } from "@/context/FavoritesContext"
import { toggleFavoritesArray } from "@/lib/utils"
import { FaRegStar, FaStar } from "react-icons/fa"

type FavoriteStarProps = { coinId: string; userId: string | null }

export default function FavoriteStar({ userId, coinId }: FavoriteStarProps) {
  const { favorites, setFavorites } = useFavorites()

  const handleToggleFavorite = async (
    coinId: string,
    userId: string | null,
  ) => {
    const response = await ToggleFavorite(coinId, userId)
    setFavorites((prev) =>
      toggleFavoritesArray(prev, coinId, response === "created"),
    )
  }

  const isFavorite = favorites.includes(coinId)

  return (
    <div>
      <div
        className={`flex cursor-pointer justify-center text-lg ${
          isFavorite ? "text-yellow-500" : "text-muted-foreground"
        }`}
        onClick={() => handleToggleFavorite(coinId, userId)}
      >
        {isFavorite ? <FaStar /> : <FaRegStar />}
      </div>
    </div>
  )
}

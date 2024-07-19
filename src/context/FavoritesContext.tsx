"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type FavoritesContextProviderProps = {
  favorites: string[]
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>
}

const FavoritesContext = createContext<
  FavoritesContextProviderProps | undefined
>(undefined)

export function FavoritesProvider({
  children,
  initialFavorites,
}: {
  children: ReactNode
  initialFavorites: string[]
}) {
  const [favorites, setFavorites] = useState<string[]>(initialFavorites)

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within an FavoritesProvider")
  }
  return context
}

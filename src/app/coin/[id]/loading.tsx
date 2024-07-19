"use client"

import BarLoader from "react-spinners/BarLoader"

export default function Loading() {
  return (
    <div className="mt-[125px] flex items-center justify-center border-blue-500">
      <BarLoader height={3} width={175} color={"white"} loading={true} />
    </div>
  )
}

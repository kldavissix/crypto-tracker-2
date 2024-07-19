import { formatAsPercentageForApp } from "@/lib/utils"
import { FaCaretDown, FaCaretUp } from "react-icons/fa"

export default function Percentage({ pct }: { pct: number }) {
  if (pct !== undefined) {
    return (
      <span
        className={`flex items-center ${
          pct > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {pct > 0 ? <FaCaretUp /> : <FaCaretDown />}
        {formatAsPercentageForApp(pct)}
      </span>
    )
  }
}

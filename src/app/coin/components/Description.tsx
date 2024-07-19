import DOMPurify from "isomorphic-dompurify"
import parse from "html-react-parser"

const parseHTMLText = (textWithHTML: string | null) => {
  if (!textWithHTML) return null
  // Configure DOMPurify to allow certain elements or attributes
  const sanitizedHTML = DOMPurify.sanitize(textWithHTML)
  const parsedHTML = parse(sanitizedHTML)
  return <>{parsedHTML}</>
}

export default function Description({
  description,
}: {
  description: string | null
}) {
  if (!description) return null

  return (
    <div className="mt-1">
      <p className="text-muted-foreground">{parseHTMLText(description)}</p>
    </div>
  )
}

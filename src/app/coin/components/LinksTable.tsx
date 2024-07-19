// "use client"
"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaFacebook, FaGithub, FaReddit } from "react-icons/fa"
import { FaMagnifyingGlass, FaXTwitter } from "react-icons/fa6"

type LinksTableProps = {
  symbol: string | null
  homepage: string | null
  whitepaper: string | null
  twitter_screen_name: string | null
  facebook_username: string | null
  official_forum_url: string | null
  subreddit_url: string | null
  github: string | null
}

const externalLinkButton = (
  url: string,
  text: string,
  icon?: React.ReactNode | null,
) => {
  return (
    <Button asChild variant="secondary" className="h-7 px-1.5">
      <Link href={url} target="_blank">
        <div className="flex items-center gap-x-1 text-xs text-foreground">
          {icon} {text}
        </div>
      </Link>
    </Button>
  )
}

const shortURL = (url: string) => {
  return url?.split("://")[1].replace("www.", "").replace(/\/$/, "")
}

const ButtonsRow = ({
  label,
  buttons,
}: {
  label: string
  buttons: React.ReactNode[]
}) => {
  return (
    <div className="flex items-center justify-between border-b py-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-x-1">
        {buttons.map((button, index) => {
          return <div key={index}>{button}</div>
        })}
      </div>
    </div>
  )
}

export default function LinksTable({
  linkTableValues,
}: {
  linkTableValues: LinksTableProps
}) {
  const {
    symbol,
    homepage,
    whitepaper,
    twitter_screen_name,
    facebook_username,
    official_forum_url,
    subreddit_url,
    github,
  } = linkTableValues

  interface LinkButtons {
    website: { label: string; items: React.ReactNode[] }
    officialForum: { label: string; items: React.ReactNode[] }
    community: { label: string; items: React.ReactNode[] }
    search: { label: string; items: React.ReactNode[] }
    sourceCode: { label: string; items: React.ReactNode[] }
  }

  const getLinkButtons = () => {
    const linkButtons: LinkButtons = {
      website: {
        label: "Website",
        items: [],
      },
      officialForum: {
        label: "Official Forum",
        items: [],
      },
      community: {
        label: "Community",
        items: [],
      },
      search: {
        label: "Search on",
        items: [],
      },
      sourceCode: {
        label: "Source Code",
        items: [],
      },
    }

    if (homepage) {
      linkButtons.website.items.push(
        externalLinkButton(homepage, shortURL(homepage)),
      )
    }
    if (whitepaper) {
      linkButtons.website.items.push(
        externalLinkButton(whitepaper, "Whitepaper"),
      )
    }

    if (official_forum_url) {
      linkButtons.officialForum.items.push(
        externalLinkButton(official_forum_url, shortURL(official_forum_url)),
      )
    }

    if (twitter_screen_name) {
      linkButtons.community.items.push(
        externalLinkButton(
          `https://twitter.com/${twitter_screen_name}`,
          "Twitter",
          <FaXTwitter />,
        ),
      )
    }

    if (facebook_username) {
      linkButtons.community.items.push(
        externalLinkButton(
          `https://www.facebook.com/${facebook_username}`,
          "Facebook",
          <FaFacebook />,
        ),
      )
    }

    if (subreddit_url) {
      linkButtons.community.items.push(
        externalLinkButton(subreddit_url, "Reddit", <FaReddit />),
      )
    }

    if (symbol) {
      linkButtons.search.items.push(
        externalLinkButton(
          `https://twitter.com/search?q=$${symbol.toUpperCase()}`,
          "Twitter",
          <FaMagnifyingGlass />,
        ),
      )
    }

    if (github) {
      linkButtons.sourceCode.items.push(
        externalLinkButton(github, "Github", <FaGithub />),
      )
    }

    return linkButtons
  }

  const { website, officialForum, community, search, sourceCode } =
    getLinkButtons()

  return (
    <div className="w-full rounded pt-5">
      <div className="mb-1 text-xl">Info</div>
      {website.items.length > 0 && (
        <ButtonsRow label={website.label} buttons={website.items} />
      )}
      {officialForum.items.length > 0 && (
        <ButtonsRow label={officialForum.label} buttons={officialForum.items} />
      )}
      {community.items.length > 0 && (
        <ButtonsRow label={community.label} buttons={community.items} />
      )}
      {search.items.length > 0 && (
        <ButtonsRow label={search.label} buttons={search.items} />
      )}
      {sourceCode.items.length > 0 && (
        <ButtonsRow label={sourceCode.label} buttons={sourceCode.items} />
      )}
    </div>
  )
}

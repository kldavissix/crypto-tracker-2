import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="flex flex-grow">
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-y-4">
            <div className="text-5xl font-semibold">
              <p className="">Uh oh...</p>
              <p>I think we&apos;re lost.</p>
            </div>
            <p className="text-muted-foreground">
              The page you&apos;re looking for could not be found.
            </p>

            <div className="mt-4">
              <Button asChild variant="secondary">
                <Link href="/">Take me home</Link>
              </Button>
            </div>
          </div>

          <div className="relative flex h-[525px] w-[275px] items-center">
            <Image
              src="/images/confused-removebg.png"
              alt="404 - Not Found"
              priority
              width="0"
              height="0"
              sizes="100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1150px] flex-col px-8 lg:px-0">
      {children}
    </div>
  )
}

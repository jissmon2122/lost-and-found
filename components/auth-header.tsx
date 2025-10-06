import Link from "next/link"

export function AuthHeader() {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <Link href="/" className="text-3xl font-bold text-primary">
        Lost & Found
      </Link>
      <p className="text-sm text-muted-foreground text-center">Reunite with your belongings</p>
    </div>
  )
}

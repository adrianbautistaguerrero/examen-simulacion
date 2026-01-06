import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-bold text-xl text-slate-100">
            Plataforma ML
          </Link>

          <div className="flex gap-2">
            <Link href="/spam-detector">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-slate-100 hover:bg-slate-800">
                Detector Spam
              </Button>
            </Link>
            <Link href="/dataset-visualization">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-slate-100 hover:bg-slate-800">
                Dataset
              </Button>
            </Link>
            <Link href="/preprocessing">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-slate-100 hover:bg-slate-800">
                Preprocesamiento
              </Button>
            </Link>
            <Link href="/model-evaluation">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-slate-100 hover:bg-slate-800">
                Evaluación
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

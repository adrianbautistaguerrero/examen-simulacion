import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, BarChart3, Settings, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Plataforma de Análisis ML
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Herramientas de machine learning para detección de spam, visualización del dataset NSL-KDD y evaluación de
            modelos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/spam-detector">
            <Card className="bg-slate-900/50 border-slate-800 hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer hover:border-cyan-500/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-slate-100">Detector de Spam</CardTitle>
                <CardDescription className="text-slate-400">
                  Analiza correos en tiempo real usando clasificador basado en características
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500"
                >
                  Abrir Detector
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dataset-visualization">
            <Card className="bg-slate-900/50 border-slate-800 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer hover:border-blue-500/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-slate-100">Visualización de Dataset</CardTitle>
                <CardDescription className="text-slate-400">
                  Explora el dataset NSL-KDD de detección de intrusiones con gráficos interactivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500"
                >
                  Ver Dashboard
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/preprocessing">
            <Card className="bg-slate-900/50 border-slate-800 hover:shadow-lg hover:shadow-green-500/20 transition-all cursor-pointer hover:border-green-500/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-slate-100">Preprocesamiento de Datos</CardTitle>
                <CardDescription className="text-slate-400">
                  Configura división de datasets y visualiza pipelines de transformación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500"
                >
                  Configurar Pipeline
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/model-evaluation">
            <Card className="bg-slate-900/50 border-slate-800 hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer hover:border-emerald-500/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle className="text-slate-100">Evaluación de Modelos</CardTitle>
                <CardDescription className="text-slate-400">
                  Compara modelos con matrices de confusión, curvas ROC y métricas detalladas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500"
                >
                  Ver Métricas
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}

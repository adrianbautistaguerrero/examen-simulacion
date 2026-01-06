"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Settings, AlertTriangle, CheckCircle, Loader2, Split, Workflow } from "lucide-react"
import Link from "next/link"

interface SplitResult {
  tamaño_entrenamiento: number
  tamaño_validacion: number
  tamaño_prueba: number
  estratificado: boolean
  semilla_aleatoria: number
  distribucion?: any
}

interface PipelineInfo {
  pipeline_completo: boolean
  total_pasos: number
  pasos: Array<{
    paso: number
    nombre: string
    descripcion: string
    completado: boolean
  }>
  caracteristicas_originales: number
  caracteristicas_finales: number
  tiempo_procesamiento_ms: number
}

export default function PreprocessingPage() {
  const [dataSize, setDataSize] = useState(125973)
  const [trainRatio, setTrainRatio] = useState(60)
  const [valRatio, setValRatio] = useState(20)
  const [testRatio, setTestRatio] = useState(20)
  const [stratified, setStratified] = useState(true)
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null)
  const [pipelineInfo, setPipelineInfo] = useState<PipelineInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateSplit = async () => {
    if (trainRatio + valRatio + testRatio !== 100) {
      setError("Los ratios deben sumar 100%")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/api/preprocessing/split/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          train_ratio: trainRatio / 100,
          val_ratio: valRatio / 100,
          test_ratio: testRatio / 100,
          stratified: stratified,
          random_state: 42,
        }),
      })

      if (!response.ok) throw new Error("Fallo en la petición API")

      const data = await response.json()
      setSplitResult(data)
    } catch (err) {
      setError("Error al calcular división. Asegúrate de que el API de Django esté corriendo.")
    } finally {
      setLoading(false)
    }
  }

  const loadPipeline = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/api/preprocessing/transform/", {
        method: "POST",
      })

      if (!response.ok) throw new Error("Fallo en la petición API")

      const data = await response.json()
      setPipelineInfo(data)
    } catch (err) {
      setError("Error al cargar pipeline. Asegúrate de que el API de Django esté corriendo.")
    } finally {
      setLoading(false)
    }
  }

  const handleTrainRatioChange = (value: number[]) => {
    const newTrain = value[0]
    const remaining = 100 - newTrain
    setTrainRatio(newTrain)
    setValRatio(Math.round(remaining / 2))
    setTestRatio(100 - newTrain - Math.round(remaining / 2))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-300 hover:text-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-slate-100">Preprocesamiento de Datos</h1>
            <p className="text-slate-400">
              Configura división de datasets, transformaciones y pipelines de preprocesamiento
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-950/50 border-red-900">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Split className="w-5 h-5 text-purple-400" />
                  <CardTitle className="text-slate-100">Configuración de División del Dataset</CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Configura ratios de entrenamiento/validación/prueba
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="data-size" className="text-slate-300">
                    Tamaño del Dataset
                  </Label>
                  <Input
                    id="data-size"
                    type="number"
                    value={dataSize}
                    onChange={(e) => setDataSize(Number.parseInt(e.target.value) || 0)}
                    className="mt-2 bg-slate-950/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-slate-300">Ratio Entrenamiento</Label>
                    <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                      {trainRatio}%
                    </Badge>
                  </div>
                  <Slider value={[trainRatio]} onValueChange={handleTrainRatioChange} max={80} min={40} step={5} />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-slate-300">Ratio Validación</Label>
                    <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                      {valRatio}%
                    </Badge>
                  </div>
                  <Slider
                    value={[valRatio]}
                    onValueChange={(val) => {
                      setValRatio(val[0])
                      setTestRatio(100 - trainRatio - val[0])
                    }}
                    max={40}
                    min={10}
                    step={5}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-slate-300">Ratio Prueba</Label>
                    <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                      {testRatio}%
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-500">Calculado automáticamente: {testRatio}%</div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div>
                    <Label htmlFor="stratified" className="text-slate-300">
                      Muestreo Estratificado
                    </Label>
                    <p className="text-sm text-slate-500">Preservar distribución de clases</p>
                  </div>
                  <Switch id="stratified" checked={stratified} onCheckedChange={setStratified} />
                </div>

                <Button
                  onClick={calculateSplit}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculando...
                    </>
                  ) : (
                    "Calcular División"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Resultados de la División</CardTitle>
                <CardDescription className="text-slate-400">
                  Tamaños calculados de particiones del dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                {splitResult ? (
                  <div className="space-y-4">
                    <Alert className="bg-green-950/30 border-green-900">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <AlertDescription className="text-green-300">División calculada exitosamente</AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-100">Conjunto de Entrenamiento</span>
                          <Badge className="bg-blue-600">{trainRatio}%</Badge>
                        </div>
                        <div className="text-2xl font-bold mt-2 text-blue-300">
                          {splitResult.tamaño_entrenamiento.toLocaleString()} muestras
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-100">Conjunto de Validación</span>
                          <Badge className="bg-yellow-600">{valRatio}%</Badge>
                        </div>
                        <div className="text-2xl font-bold mt-2 text-yellow-300">
                          {splitResult.tamaño_validacion.toLocaleString()} muestras
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-100">Conjunto de Prueba</span>
                          <Badge className="bg-green-600">{testRatio}%</Badge>
                        </div>
                        <div className="text-2xl font-bold mt-2 text-green-300">
                          {splitResult.tamaño_prueba.toLocaleString()} muestras
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total de Muestras:</span>
                        <span className="font-medium text-slate-300">{dataSize.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Estratificado:</span>
                        <span className="font-medium text-slate-300">{splitResult.estratificado ? "Sí" : "No"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Semilla Aleatoria:</span>
                        <span className="font-medium text-slate-300">{splitResult.semilla_aleatoria}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Split className="w-16 h-16 text-slate-700 mb-4" />
                    <p className="text-slate-500">
                      Configura los ratios de división y haz clic en &quot;Calcular División&quot;
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 bg-slate-900/50 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-slate-100">Pipeline de Transformación</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    Preprocesamiento automatizado de datos e ingeniería de características
                  </CardDescription>
                </div>
                <Button
                  onClick={loadPipeline}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cargar Pipeline"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pipelineInfo ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4 text-slate-100">Pasos del Pipeline</h3>
                    <div className="space-y-3">
                      {pipelineInfo.pasos.map((step, index) => (
                        <div key={index} className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                          <div className="flex items-start gap-3">
                            <Badge className="mt-1 bg-purple-600">{step.paso}</Badge>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1 text-slate-100">{step.nombre}</h4>
                              <p className="text-sm text-slate-400 mb-2">{step.descripcion}</p>
                              {step.completado && (
                                <Badge variant="outline" className="border-green-600 text-green-400">
                                  Completado
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 text-slate-100">Resultados de Transformación</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 text-center">
                        <div className="text-3xl font-bold text-purple-400">
                          {pipelineInfo.caracteristicas_originales}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Características Antes</div>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 text-center">
                        <div className="text-3xl font-bold text-purple-400">{pipelineInfo.caracteristicas_finales}</div>
                        <div className="text-sm text-slate-400 mt-1">Características Después</div>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 text-center">
                        <div className="text-3xl font-bold text-purple-400">{pipelineInfo.total_pasos}</div>
                        <div className="text-sm text-slate-400 mt-1">Pasos Ejecutados</div>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 text-center">
                        <div className="text-3xl font-bold text-purple-400">
                          {pipelineInfo.tiempo_procesamiento_ms}ms
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Tiempo de Proceso</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Workflow className="w-16 h-16 text-slate-700 mb-4" />
                  <p className="text-slate-500">
                    Haz clic en &quot;Cargar Pipeline&quot; para ver detalles de transformación
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

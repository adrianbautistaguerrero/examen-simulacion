"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface SpamResult {
  es_spam: boolean
  confianza: number
  puntuacion_spam: number
  caracteristicas: Record<string, any>
}

export default function SpamDetectorPage() {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [result, setResult] = useState<SpamResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeEmail = async () => {
    if (!subject.trim() && !body.trim()) {
      setError("Por favor ingresa el asunto o cuerpo del correo")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/api/spam/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      })

      if (!response.ok) throw new Error("Fallo en la petición API")

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Error al analizar el correo. Asegúrate de que el API de Django esté corriendo en el puerto 8000.")
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (type: "spam" | "legitimo") => {
    if (type === "spam") {
      setSubject("¡GANASTE UN PREMIO! Reclama ahora")
      setBody(
        "¡FELICIDADES! Has sido seleccionado para ganar $10,000 USD. Haz clic AQUÍ AHORA para reclamar tu premio GRATIS. Oferta limitada - ¡ACTÚA YA! No se requiere tarjeta de crédito. ¡¡¡GARANTIZADO 100%!!!",
      )
    } else {
      setSubject("Reunión de equipo - Viernes 3pm")
      setBody(
        "Hola equipo,\n\nLes recuerdo que tenemos nuestra reunión semanal el viernes a las 3pm. Por favor revisen el reporte adjunto antes de la reunión.\n\nSaludos,\nJuan",
      )
    }
    setResult(null)
  }

  const clearForm = () => {
    setSubject("")
    setBody("")
    setResult(null)
    setError(null)
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

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-slate-100">Detector de Spam</h1>
            <p className="text-slate-400">
              Detección de spam con IA usando regresión logística y extracción de características
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-950/50 border-red-900">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Entrada de Correo</CardTitle>
                <CardDescription className="text-slate-400">
                  Ingresa el asunto y cuerpo del correo para analizar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-slate-300">Asunto</label>
                  <Input
                    placeholder="Asunto del correo..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-slate-300">Cuerpo</label>
                  <Textarea
                    placeholder="Contenido del correo..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={analyzeEmail}
                    disabled={loading}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      "Analizar Correo"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearForm}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                  >
                    Limpiar
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadExample("spam")}
                    className="flex-1 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cargar Ejemplo Spam
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadExample("legitimo")}
                    className="flex-1 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cargar Ejemplo Legítimo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Resultados del Análisis</CardTitle>
                <CardDescription className="text-slate-400">
                  Clasificación detallada y análisis de características
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div
                      className="p-4 rounded-lg border-2"
                      style={{
                        backgroundColor: result.es_spam ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                        borderColor: result.es_spam ? "rgb(239 68 68 / 0.5)" : "rgb(34 197 94 / 0.5)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {result.es_spam ? (
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        )}
                        <span className="text-2xl font-bold text-slate-100">
                          {result.es_spam ? "SPAM DETECTADO" : "CORREO LEGÍTIMO"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Confianza:</span>
                        <Badge
                          variant={result.es_spam ? "destructive" : "default"}
                          className={result.es_spam ? "bg-red-600" : "bg-green-600"}
                        >
                          {result.confianza.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 text-slate-100">Características Extraídas</h3>
                      <div className="space-y-2">
                        {Object.entries(result.caracteristicas).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-2 border-b border-slate-800">
                            <span className="text-sm text-slate-400 capitalize">{key.replace(/_/g, " ")}</span>
                            <span className="font-mono text-sm font-medium text-slate-300">
                              {typeof value === "boolean"
                                ? value
                                  ? "Sí"
                                  : "No"
                                : typeof value === "number"
                                  ? value.toFixed(2)
                                  : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Mail className="w-16 h-16 text-slate-700 mb-4" />
                    <p className="text-slate-500">
                      Ingresa un correo y haz clic en &quot;Analizar Correo&quot; para ver resultados
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Cómo Funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                  <h4 className="font-semibold mb-2 text-slate-100">1. Extracción de Características</h4>
                  <p className="text-sm text-slate-400">
                    Analiza palabras clave spam, contenido HTML, patrones de puntuación y características del texto
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                  <h4 className="font-semibold mb-2 text-slate-100">2. Clasificación</h4>
                  <p className="text-sm text-slate-400">
                    Usa modelo de regresión logística entrenado con el dataset TREC 2007 Spam Corpus
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                  <h4 className="font-semibold mb-2 text-slate-100">3. Puntuación de Confianza</h4>
                  <p className="text-sm text-slate-400">
                    Calcula puntuación de probabilidad basada en la importancia ponderada de características
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

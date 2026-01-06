"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, AlertTriangle, Loader2, RefreshCw, Info } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface DatasetInfo {
  total_registros: number
  distribucion_ataques: Record<string, number>
  estadisticas_caracteristicas: any[]
  scatter_data?: any[]
  usando_datos_personalizados?: boolean
}

const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#10b981", "#f59e0b", "#14b8a6"]

export default function DatasetVisualizationPage() {
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [datasetStatus, setDatasetStatus] = useState<any>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [infoRes, vizRes, statusRes] = await Promise.all([
        fetch("http://localhost:8000/api/dataset/info/"),
        fetch("http://localhost:8000/api/dataset/visualizations/"),
        fetch("http://localhost:8000/api/dataset/status/"),
      ])

      if (!infoRes.ok || !vizRes.ok) throw new Error("Fallo en la petición API")

      const info = await infoRes.json()
      const viz = await vizRes.json()
      const status = statusRes.ok ? await statusRes.json() : null

      setDatasetInfo({
        total_registros: info.total_registros,
        distribucion_ataques: info.distribución_ataques || info.distribucion_ataques,
        estadisticas_caracteristicas: viz.estadisticas_caracteristicas || [],
        scatter_data: viz.scatter_data || [],
        usando_datos_personalizados: info.usando_datos_personalizados || false,
      })
      setDatasetStatus(status)
    } catch (err) {
      setError("Error al cargar el dataset. Asegúrate de que el API de Django esté corriendo en el puerto 8000.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const attackDistributionData = datasetInfo
    ? Object.entries(datasetInfo.distribucion_ataques).map(([name, value]) => ({
        nombre: name,
        valor: value,
        porcentaje: ((value / datasetInfo.total_registros) * 100).toFixed(1),
      }))
    : []

  const topAttacks = attackDistributionData.slice(0, 8)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-300 hover:text-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </Link>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-slate-100">Visualización del Dataset NSL-KDD</h1>
            <p className="text-slate-400">
              Dataset de detección de intrusiones con análisis de tráfico de red y patrones de ataque
            </p>
          </div>

          {datasetStatus && (
            <Alert className="mb-6 bg-blue-950/50 border-blue-900">
              <Info className="w-4 h-4 text-blue-400" />
              <AlertDescription className="text-blue-400">
                <div className="font-semibold mb-1">Estado del Dataset</div>
                <div className="text-sm">
                  {datasetStatus.usando_datos_personalizados ? (
                    <>
                      Usando dataset personalizado cargado ({datasetStatus.total_registros.toLocaleString()} registros,{" "}
                      {datasetStatus.tipos_ataque} tipos de ataque)
                    </>
                  ) : (
                    <>
                      Usando datos de ejemplo (NSL-KDD simulado). Puedes{" "}
                      <Link href="/upload-dataset" className="underline font-semibold">
                        cargar tu propio dataset
                      </Link>
                      .
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-950/50 border-red-900">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mb-4" />
              <p className="text-slate-400">Cargando dataset...</p>
            </div>
          ) : datasetInfo ? (
            <>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-slate-400">Total de Registros</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-cyan-400">
                      {datasetInfo.total_registros.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-slate-400">Tipos de Ataque</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400">
                      {Object.keys(datasetInfo.distribucion_ataques).length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-slate-400">Tráfico Normal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">
                      {((datasetInfo.distribucion_ataques.normal / datasetInfo.total_registros) * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-slate-400">Tráfico de Ataque</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-400">
                      {(
                        ((datasetInfo.total_registros - datasetInfo.distribucion_ataques.normal) /
                          datasetInfo.total_registros) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Distribución de Ataques</CardTitle>
                    <CardDescription className="text-slate-400">
                      Tipos de ataque principales por frecuencia
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={topAttacks}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
                        />
                        <Bar dataKey="valor" fill="#06b6d4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Composición del Tráfico</CardTitle>
                    <CardDescription className="text-slate-400">
                      Proporción de tráfico normal vs ataques
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={topAttacks}
                          dataKey="valor"
                          nameKey="nombre"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          label={(entry) => `${entry.nombre}: ${entry.porcentaje}%`}
                        >
                          {topAttacks.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {datasetInfo.scatter_data && datasetInfo.scatter_data.length > 0 && (
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-slate-100">Análisis de Transferencia de Bytes</CardTitle>
                      <CardDescription className="text-slate-400">
                        Bytes de origen vs destino por tipo de ataque
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="src_bytes" name="Bytes Origen" stroke="#94a3b8" />
                          <YAxis dataKey="dst_bytes" name="Bytes Destino" stroke="#94a3b8" />
                          <Tooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #334155",
                              color: "#e2e8f0",
                            }}
                          />
                          <Legend />
                          <Scatter
                            name="Normal"
                            data={datasetInfo.scatter_data.filter((d) => d.tipo === "normal")}
                            fill="#22c55e"
                            opacity={0.6}
                          />
                          <Scatter
                            name="Ataque"
                            data={datasetInfo.scatter_data.filter((d) => d.tipo !== "normal")}
                            fill="#ef4444"
                            opacity={0.6}
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-slate-100">Patrones de Conexión</CardTitle>
                      <CardDescription className="text-slate-400">Distribución por tipo de ataque</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="src_bytes" name="Origen" stroke="#94a3b8" />
                          <YAxis dataKey="dst_bytes" name="Destino" stroke="#94a3b8" />
                          <Tooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #334155",
                              color: "#e2e8f0",
                            }}
                          />
                          <Legend />
                          {Array.from(new Set(datasetInfo.scatter_data.map((d) => d.tipo)))
                            .slice(0, 5)
                            .map((tipo, index) => (
                              <Scatter
                                key={tipo}
                                name={tipo}
                                data={datasetInfo.scatter_data!.filter((d) => d.tipo === tipo)}
                                fill={COLORS[index % COLORS.length]}
                                opacity={0.6}
                              />
                            ))}
                        </ScatterChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card className="mb-6 bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">Estadísticas de Características</CardTitle>
                  <CardDescription className="text-slate-400">
                    Resumen estadístico de características clave de red
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {datasetInfo.estadisticas_caracteristicas.map((feature: any) => (
                      <div key={feature.nombre} className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                        <h4 className="font-semibold mb-3 capitalize text-slate-100">
                          {feature.nombre.replace(/_/g, " ")}
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Media:</span>
                            <span className="font-mono text-slate-300">{feature.media?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Desv. Est.:</span>
                            <span className="font-mono text-slate-300">{feature.std?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Mín:</span>
                            <span className="font-mono text-slate-300">{feature.min}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Máx:</span>
                            <span className="font-mono text-slate-300">{feature.max?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-slate-100">Leyenda de Tipos de Ataque</CardTitle>
                      <CardDescription className="text-slate-400">
                        Vista general de tipos de intrusión en el dataset
                      </CardDescription>
                    </div>
                    <Button
                      onClick={loadData}
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Actualizar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(datasetInfo.distribucion_ataques).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800"
                      >
                        <span className="font-medium capitalize text-slate-300">{type}</span>
                        <Badge
                          variant={type === "normal" ? "default" : "destructive"}
                          className={type === "normal" ? "bg-green-600" : "bg-red-600"}
                        >
                          {count.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

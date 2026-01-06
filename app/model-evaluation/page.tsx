"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, AlertTriangle, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  confusion_matrix: number[][]
}

interface ModelComparison {
  model_name: string
  metrics: ModelMetrics
  confusion_matrix: number[][]
  training_time_s: number
  cross_validation_score: number
}

interface ROCData {
  fpr: number[]
  tpr: number[]
  auc: number
  thresholds: number[]
}

export default function ModelEvaluationPage() {
  const [models, setModels] = useState<ModelComparison[]>([])
  const [rocData, setRocData] = useState<ROCData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>("Logistic Regression")

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [modelsRes, rocRes] = await Promise.all([
        fetch("http://localhost:8000/api/model/comparison"),
        fetch("http://localhost:8000/api/model/roc?n_points=100"),
      ])

      if (!modelsRes.ok || !rocRes.ok) throw new Error("API request failed")

      const modelsData = await modelsRes.json()
      const rocDataRes = await rocRes.json()

      setModels(modelsData.models)
      setRocData(rocDataRes)
      if (modelsData.models.length > 0) {
        setSelectedModel(modelsData.models[0].model_name)
      }
    } catch (err) {
      setError("Failed to load model metrics. Make sure the Python API is running on port 8000.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const selectedModelData = models.find((m) => m.model_name === selectedModel)

  const metricsComparison = models.map((model) => ({
    name: model.model_name.split(" ")[0],
    accuracy: (model.metrics.accuracy * 100).toFixed(1),
    precision: (model.metrics.precision * 100).toFixed(1),
    recall: (model.metrics.recall * 100).toFixed(1),
    f1: (model.metrics.f1_score * 100).toFixed(1),
  }))

  const rocChartData =
    rocData?.fpr.map((fpr, index) => ({
      fpr: (fpr * 100).toFixed(2),
      tpr: (rocData.tpr[index] * 100).toFixed(2),
    })) || []

  const renderConfusionMatrix = (matrix: number[][]) => {
    const labels = ["Negative", "Positive"]
    const total = matrix.flat().reduce((a, b) => a + b, 0)

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <div className="text-center font-semibold text-sm">Predicted Negative</div>
          <div className="text-center font-semibold text-sm">Predicted Positive</div>

          <div className="font-semibold text-sm flex items-center">Actual Negative</div>
          <div className="p-4 rounded-lg bg-green-500/20 border-2 border-green-500/40 text-center">
            <div className="text-2xl font-bold">{matrix[0][0]}</div>
            <div className="text-xs text-muted-foreground">True Negative</div>
            <div className="text-xs font-semibold">{((matrix[0][0] / total) * 100).toFixed(1)}%</div>
          </div>
          <div className="p-4 rounded-lg bg-red-500/20 border-2 border-red-500/40 text-center">
            <div className="text-2xl font-bold">{matrix[0][1]}</div>
            <div className="text-xs text-muted-foreground">False Positive</div>
            <div className="text-xs font-semibold">{((matrix[0][1] / total) * 100).toFixed(1)}%</div>
          </div>

          <div className="font-semibold text-sm flex items-center">Actual Positive</div>
          <div className="p-4 rounded-lg bg-red-500/20 border-2 border-red-500/40 text-center">
            <div className="text-2xl font-bold">{matrix[1][0]}</div>
            <div className="text-xs text-muted-foreground">False Negative</div>
            <div className="text-xs font-semibold">{((matrix[1][0] / total) * 100).toFixed(1)}%</div>
          </div>
          <div className="p-4 rounded-lg bg-green-500/20 border-2 border-green-500/40 text-center">
            <div className="text-2xl font-bold">{matrix[1][1]}</div>
            <div className="text-xs text-muted-foreground">True Positive</div>
            <div className="text-xs font-semibold">{((matrix[1][1] / total) * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Model Evaluation</h1>
            <p className="text-muted-foreground">
              Compare model performance with confusion matrices, ROC curves, and key metrics
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading model metrics...</p>
            </div>
          ) : models.length > 0 ? (
            <>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                {selectedModelData && (
                  <>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Accuracy</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {(selectedModelData.metrics.accuracy * 100).toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Precision</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {(selectedModelData.metrics.precision * 100).toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Recall</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{(selectedModelData.metrics.recall * 100).toFixed(1)}%</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>F1 Score</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {(selectedModelData.metrics.f1_score * 100).toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              <Tabs defaultValue="comparison" className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
                  <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
                  <TabsTrigger value="roc">ROC Curve</TabsTrigger>
                </TabsList>

                <TabsContent value="comparison" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics Comparison</CardTitle>
                      <CardDescription>Compare accuracy, precision, recall, and F1 score across models</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={metricsComparison}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis label={{ value: "Score (%)", angle: -90, position: "insideLeft" }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy" />
                          <Bar dataKey="precision" fill="#22c55e" name="Precision" />
                          <Bar dataKey="recall" fill="#f97316" name="Recall" />
                          <Bar dataKey="f1" fill="#a855f7" name="F1 Score" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-3 gap-4">
                    {models.map((model) => (
                      <Card
                        key={model.model_name}
                        className={selectedModel === model.model_name ? "border-primary" : ""}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">{model.model_name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Accuracy:</span>
                              <span className="font-semibold">{(model.metrics.accuracy * 100).toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Training Time:</span>
                              <span className="font-semibold">{model.training_time_s}s</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">CV Score:</span>
                              <span className="font-semibold">{(model.cross_validation_score * 100).toFixed(2)}%</span>
                            </div>
                          </div>
                          <Button
                            variant={selectedModel === model.model_name ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => setSelectedModel(model.model_name)}
                          >
                            {selectedModel === model.model_name ? "Selected" : "View Details"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="confusion">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Confusion Matrix</CardTitle>
                          <CardDescription>True vs predicted classifications for {selectedModel}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {models.map((model) => (
                            <Button
                              key={model.model_name}
                              variant={selectedModel === model.model_name ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedModel(model.model_name)}
                            >
                              {model.model_name.split(" ")[0]}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedModelData && (
                        <div className="max-w-2xl mx-auto">
                          {renderConfusionMatrix(selectedModelData.confusion_matrix)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="roc">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>ROC Curve</CardTitle>
                          <CardDescription>
                            Receiver Operating Characteristic curve - AUC: {rocData?.auc.toFixed(4)}
                          </CardDescription>
                        </div>
                        <Button onClick={loadData} variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={500}>
                        <LineChart data={rocChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="fpr"
                            label={{ value: "False Positive Rate (%)", position: "insideBottom", offset: -5 }}
                          />
                          <YAxis label={{ value: "True Positive Rate (%)", angle: -90, position: "insideLeft" }} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="tpr"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name="ROC Curve"
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            data={[
                              { fpr: 0, baseline: 0 },
                              { fpr: 100, baseline: 100 },
                            ]}
                            dataKey="baseline"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Random Classifier"
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>

                      <div className="mt-6 p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">Understanding ROC Curve</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>AUC (Area Under Curve) of {rocData?.auc.toFixed(4)} indicates model performance</li>
                          <li>AUC = 1.0: Perfect classifier</li>
                          <li>AUC = 0.5: Random classifier (diagonal line)</li>
                          <li>Higher AUC = Better model discrimination capability</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

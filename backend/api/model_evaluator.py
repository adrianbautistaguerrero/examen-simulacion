import numpy as np
from typing import Dict, List

class ModelEvaluator:
    """Evaluador de modelos de ML"""
    
    def __init__(self):
        # Métricas simuladas de diferentes modelos
        self.models_data = {
            'regresion_logistica': {
                'nombre': 'Regresión Logística',
                'precision': 0.92,
                'recall': 0.89,
                'f1_score': 0.90,
                'accuracy': 0.91,
                'matriz_confusion': [[8500, 450], [550, 7500]],
                'curva_roc': self._generate_roc_curve(0.92)
            },
            'random_forest': {
                'nombre': 'Random Forest',
                'precision': 0.95,
                'recall': 0.93,
                'f1_score': 0.94,
                'accuracy': 0.94,
                'matriz_confusion': [[8700, 250], [350, 7700]],
                'curva_roc': self._generate_roc_curve(0.96)
            },
            'gradient_boosting': {
                'nombre': 'Gradient Boosting',
                'precision': 0.94,
                'recall': 0.91,
                'f1_score': 0.92,
                'accuracy': 0.93,
                'matriz_confusion': [[8650, 300], [450, 7600]],
                'curva_roc': self._generate_roc_curve(0.95)
            }
        }
    
    def get_metrics(self, model_name: str) -> dict:
        """Obtiene métricas de un modelo específico"""
        model_data = self.models_data.get(model_name, self.models_data['regresion_logistica'])
        
        return {
            'modelo': model_data['nombre'],
            'metricas': {
                'precision': model_data['precision'],
                'recall': model_data['recall'],
                'f1_score': model_data['f1_score'],
                'exactitud': model_data['accuracy']
            },
            'matriz_confusion': {
                'valores': model_data['matriz_confusion'],
                'etiquetas': ['Normal', 'Ataque']
            },
            'curva_roc': model_data['curva_roc'],
            'cross_validation': {
                'media': model_data['accuracy'],
                'std': 0.02,
                'scores': [model_data['accuracy'] + np.random.uniform(-0.02, 0.02) for _ in range(5)]
            }
        }
    
    def compare_models(self) -> dict:
        """Compara todos los modelos"""
        comparison = []
        
        for model_key, model_data in self.models_data.items():
            comparison.append({
                'modelo': model_data['nombre'],
                'clave': model_key,
                'precision': model_data['precision'],
                'recall': model_data['recall'],
                'f1_score': model_data['f1_score'],
                'exactitud': model_data['accuracy']
            })
        
        # Ordenar por F1-score
        comparison.sort(key=lambda x: x['f1_score'], reverse=True)
        
        return {
            'comparacion': comparison,
            'mejor_modelo': comparison[0]['modelo'],
            'criterio': 'F1-Score'
        }
    
    def _generate_roc_curve(self, auc_target: float) -> Dict[str, List[float]]:
        """Genera una curva ROC simulada"""
        # Generar puntos de la curva ROC
        n_points = 50
        fpr = np.linspace(0, 1, n_points)
        
        # Generar TPR que resulte en el AUC deseado
        tpr = np.power(fpr, 0.5) * (auc_target / 0.85)
        tpr = np.clip(tpr, 0, 1)
        
        # Asegurar que empiece en (0,0) y termine en (1,1)
        tpr[0] = 0
        tpr[-1] = 1
        
        return {
            'fpr': fpr.tolist(),
            'tpr': tpr.tolist(),
            'auc': round(auc_target, 3),
            'umbral_optimo': 0.5
        }

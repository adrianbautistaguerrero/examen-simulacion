import numpy as np
import pandas as pd
from typing import Dict, List, Optional

class DatasetHandler:
    """Manejador del dataset NSL-KDD"""
    
    def __init__(self):
        self.using_custom_data = False
        self.custom_dataframe = None
        
        # Datos simulados del NSL-KDD por defecto
        self.total_records = 125973
        
        self.attack_types = {
            'normal': 67343,
            'neptune': 41214,
            'portsweep': 10413,
            'ipsweep': 3599,
            'satan': 3633,
            'warezclient': 890,
            'teardrop': 892,
            'nmap': 231
        }
        
        # Estadísticas de características
        self.feature_stats = self._generate_feature_stats()
    
    def load_dataset(self, dataframe: pd.DataFrame) -> dict:
        """Carga un dataset personalizado desde un DataFrame"""
        try:
            self.custom_dataframe = dataframe
            self.using_custom_data = True
            
            # Detectar columna de etiquetas (última columna o columna 'label'/'class')
            if 'label' in dataframe.columns:
                label_col = 'label'
            elif 'class' in dataframe.columns:
                label_col = 'class'
            elif 'attack_type' in dataframe.columns:
                label_col = 'attack_type'
            else:
                # Asumir que la última columna es la etiqueta
                label_col = dataframe.columns[-1]
            
            # Actualizar estadísticas
            self.total_records = len(dataframe)
            self.attack_types = dataframe[label_col].value_counts().to_dict()
            self.feature_stats = self._generate_feature_stats_from_df(dataframe, label_col)
            
            return {
                'registros': self.total_records,
                'caracteristicas': len(dataframe.columns) - 1,
                'tipos_ataque': len(self.attack_types),
                'columna_etiqueta': label_col,
                'tipos_encontrados': list(self.attack_types.keys())
            }
        except Exception as e:
            self.using_custom_data = False
            raise Exception(f"Error al cargar dataset: {str(e)}")
    
    def get_status(self) -> dict:
        """Retorna el estado actual del dataset"""
        return {
            'usando_datos_personalizados': self.using_custom_data,
            'total_registros': self.total_records,
            'tipos_ataque': len(self.attack_types),
            'origen': 'Dataset personalizado' if self.using_custom_data else 'Datos de ejemplo (NSL-KDD simulado)'
        }
    
    def get_info(self) -> dict:
        """Retorna información general del dataset"""
        return {
            'total_registros': self.total_records,
            'num_caracteristicas': len(self.custom_dataframe.columns) - 1 if self.using_custom_data else 42,
            'tipos_ataque': len(self.attack_types),
            'distribución_ataques': self.attack_types,
            'desbalanceado': True,
            'descripción': 'Dataset personalizado cargado' if self.using_custom_data else 'NSL-KDD Dataset para detección de intrusiones en redes',
            'usando_datos_personalizados': self.using_custom_data
        }
    
    def get_visualizations(self) -> dict:
        """Retorna datos para visualizaciones"""
        return {
            'distribucion_ataques': [
                {'tipo': tipo, 'cantidad': cantidad, 'porcentaje': round(cantidad/self.total_records*100, 2)}
                for tipo, cantidad in self.attack_types.items()
            ],
            'estadisticas_caracteristicas': self.feature_stats,
            'correlaciones_principales': self._get_top_correlations(),
            'scatter_data': self._generate_scatter_data()
        }
    
    def _generate_feature_stats_from_df(self, df: pd.DataFrame, label_col: str) -> List[dict]:
        """Genera estadísticas de características desde un DataFrame real"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        numeric_cols = [col for col in numeric_cols if col != label_col]
        
        stats = []
        for col in numeric_cols[:10]:  # Limitar a 10 características principales
            stats.append({
                'nombre': col,
                'media': float(df[col].mean()),
                'std': float(df[col].std()),
                'min': float(df[col].min()),
                'max': float(df[col].max())
            })
        
        return stats
    
    def _generate_feature_stats(self) -> List[dict]:
        """Genera estadísticas de características"""
        features = [
            {'nombre': 'duration', 'media': 47.98, 'std': 707.75, 'min': 0, 'max': 58329},
            {'nombre': 'src_bytes', 'media': 3025.26, 'std': 880428.37, 'min': 0, 'max': 1379963888},
            {'nombre': 'dst_bytes', 'media': 868.54, 'std': 32230.65, 'min': 0, 'max': 1309937401},
            {'nombre': 'wrong_fragment', 'media': 0.01, 'std': 0.15, 'min': 0, 'max': 3},
            {'nombre': 'hot', 'media': 0.19, 'std': 1.51, 'min': 0, 'max': 101},
            {'nombre': 'num_failed_logins', 'media': 0.01, 'std': 0.04, 'min': 0, 'max': 5},
            {'nombre': 'num_compromised', 'media': 0.08, 'std': 5.45, 'min': 0, 'max': 7479},
            {'nombre': 'count', 'media': 83.31, 'std': 114.22, 'min': 0, 'max': 511},
            {'nombre': 'srv_count', 'media': 29.31, 'std': 94.33, 'min': 0, 'max': 511},
            {'nombre': 'serror_rate', 'media': 0.29, 'std': 0.45, 'min': 0, 'max': 1},
        ]
        return features
    
    def _get_top_correlations(self) -> List[dict]:
        """Retorna las principales correlaciones"""
        if self.using_custom_data and self.custom_dataframe is not None:
            numeric_df = self.custom_dataframe.select_dtypes(include=[np.number])
            if len(numeric_df.columns) >= 2:
                corr_matrix = numeric_df.corr()
                correlations = []
                
                for i in range(len(corr_matrix.columns)):
                    for j in range(i+1, len(corr_matrix.columns)):
                        correlations.append({
                            'feature1': corr_matrix.columns[i],
                            'feature2': corr_matrix.columns[j],
                            'correlacion': float(corr_matrix.iloc[i, j])
                        })
                
                correlations.sort(key=lambda x: abs(x['correlacion']), reverse=True)
                return correlations[:4]
        
        return [
            {'feature1': 'src_bytes', 'feature2': 'dst_bytes', 'correlacion': 0.73},
            {'feature1': 'count', 'feature2': 'srv_count', 'correlacion': 0.65},
            {'feature1': 'serror_rate', 'feature2': 'srv_serror_rate', 'correlacion': 0.92},
            {'feature1': 'rerror_rate', 'feature2': 'srv_rerror_rate', 'correlacion': 0.88},
        ]
    
    def _generate_scatter_data(self) -> List[dict]:
        """Genera datos para scatter plot"""
        if self.using_custom_data and self.custom_dataframe is not None:
            df = self.custom_dataframe
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            
            if len(numeric_cols) >= 2:
                # Tomar muestra aleatoria para visualización
                sample_size = min(len(df), 1000)
                df_sample = df.sample(n=sample_size, random_state=42)
                
                # Detectar columna de etiqueta
                label_col = 'label' if 'label' in df.columns else df.columns[-1]
                
                scatter_data = []
                for _, row in df_sample.iterrows():
                    scatter_data.append({
                        'src_bytes': float(row[numeric_cols[0]]),
                        'dst_bytes': float(row[numeric_cols[1]]),
                        'tipo': str(row[label_col])
                    })
                
                return scatter_data
        
        # Datos simulados por defecto
        np.random.seed(42)
        data = []
        
        for attack_type, count in list(self.attack_types.items())[:5]:
            sample_size = min(count, 200)
            for _ in range(sample_size):
                data.append({
                    'src_bytes': float(np.random.lognormal(7, 2)),
                    'dst_bytes': float(np.random.lognormal(6, 2)),
                    'tipo': attack_type
                })
        
        return data

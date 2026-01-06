import numpy as np
from typing import Dict

class DataPreprocessor:
    """Preprocesador de datos"""
    
    def __init__(self):
        self.total_samples = 125973
    
    def split_dataset(self, train_ratio: float, val_ratio: float, 
                     test_ratio: float, stratified: bool, random_state: int) -> dict:
        """Divide el dataset en train/val/test"""
        
        # Validar ratios
        if abs(train_ratio + val_ratio + test_ratio - 1.0) > 0.01:
            raise ValueError('Los ratios deben sumar 1.0')
        
        # Calcular tamaños
        train_size = int(self.total_samples * train_ratio)
        val_size = int(self.total_samples * val_ratio)
        test_size = self.total_samples - train_size - val_size
        
        # Generar distribución simulada
        np.random.seed(random_state)
        
        if stratified:
            # Distribución estratificada mantiene proporciones
            distribution = {
                'train': self._generate_stratified_distribution(train_size),
                'validation': self._generate_stratified_distribution(val_size),
                'test': self._generate_stratified_distribution(test_size)
            }
        else:
            # Distribución aleatoria
            distribution = {
                'train': self._generate_random_distribution(train_size),
                'validation': self._generate_random_distribution(val_size),
                'test': self._generate_random_distribution(test_size)
            }
        
        return {
            'tamaño_entrenamiento': train_size,
            'tamaño_validacion': val_size,
            'tamaño_prueba': test_size,
            'estratificado': stratified,
            'semilla_aleatoria': random_state,
            'distribucion': distribution
        }
    
    def transform_data(self) -> dict:
        """Simula el proceso de transformación de datos"""
        
        steps = [
            {
                'paso': 1,
                'nombre': 'Imputación de Valores Faltantes',
                'descripcion': 'Reemplazar valores faltantes con la mediana',
                'caracteristicas_afectadas': 3,
                'completado': True
            },
            {
                'paso': 2,
                'nombre': 'Escalado Robusto',
                'descripcion': 'Escalar características usando RobustScaler',
                'caracteristicas_procesadas': 38,
                'completado': True
            },
            {
                'paso': 3,
                'nombre': 'Codificación One-Hot',
                'descripcion': 'Codificar variables categóricas',
                'categorias_originales': 4,
                'caracteristicas_generadas': 12,
                'completado': True
            },
            {
                'paso': 4,
                'nombre': 'Normalización Final',
                'descripcion': 'Normalizar todas las características a rango [0,1]',
                'metodo': 'MinMaxScaler',
                'completado': True
            }
        ]
        
        return {
            'pipeline_completo': True,
            'total_pasos': len(steps),
            'pasos': steps,
            'caracteristicas_originales': 42,
            'caracteristicas_finales': 50,
            'tiempo_procesamiento_ms': 1247
        }
    
    def _generate_stratified_distribution(self, size: int) -> Dict[str, int]:
        """Genera distribución estratificada"""
        # Proporciones originales del dataset
        proportions = {
            'normal': 0.5345,
            'neptune': 0.3272,
            'portsweep': 0.0827,
            'ipsweep': 0.0286,
            'satan': 0.0288,
            'otros': 0.0182
        }
        
        distribution = {}
        remaining = size
        
        for attack_type, prop in list(proportions.items())[:-1]:
            count = int(size * prop)
            distribution[attack_type] = count
            remaining -= count
        
        distribution['otros'] = remaining
        return distribution
    
    def _generate_random_distribution(self, size: int) -> Dict[str, int]:
        """Genera distribución aleatoria"""
        attack_types = ['normal', 'neptune', 'portsweep', 'ipsweep', 'satan', 'otros']
        counts = np.random.multinomial(size, [1/6]*6)
        
        return {attack_type: int(count) for attack_type, count in zip(attack_types, counts)}

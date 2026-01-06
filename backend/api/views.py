from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from .spam_detector import SpamDetector
from .dataset_handler import DatasetHandler
from .preprocessing import DataPreprocessor
from .model_evaluator import ModelEvaluator

# Inicializar handlers
spam_detector = SpamDetector()
dataset_handler = DatasetHandler()
preprocessor = DataPreprocessor()
model_evaluator = ModelEvaluator()

@api_view(['GET'])
def api_root(request):
    return Response({
        'mensaje': 'API de Análisis de Machine Learning',
        'version': '2.0.0',
        'descripcion': 'Plataforma de análisis con datos de ejemplo de NSL-KDD y detección de spam',
        'endpoints': {
            'deteccion_spam': '/api/spam/predict/',
            'info_dataset': '/api/dataset/info/',
            'visualizaciones_dataset': '/api/dataset/visualizations/',
            'preprocesamiento_split': '/api/preprocessing/split/',
            'preprocesamiento_transform': '/api/preprocessing/transform/',
            'metricas_modelo': '/api/model/metrics/',
            'comparar_modelos': '/api/model/compare/',
            'subir_dataset': '/api/dataset/upload/',
            'estado_dataset': '/api/dataset/estado/',
            'entrenar_modelo': '/api/model/train/'
        }
    })

@api_view(['GET'])
def health_check(request):
    return Response({
        'estado': 'saludable',
        'timestamp': datetime.now().isoformat()
    })

@api_view(['POST'])
def spam_predict(request):
    """Detecta si un correo es spam usando el clasificador entrenado"""
    try:
        subject = request.data.get('subject', '')
        body = request.data.get('body', '')
        
        if not subject and not body:
            return Response(
                {'error': 'Se requiere asunto o cuerpo del correo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = spam_detector.predict(subject, body)
        return Response(result)
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def dataset_info(request):
    """Obtiene información del dataset NSL-KDD"""
    try:
        info = dataset_handler.get_info()
        return Response(info)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def dataset_visualizations(request):
    """Obtiene datos para visualizaciones del dataset NSL-KDD"""
    try:
        visualizations = dataset_handler.get_visualizations()
        return Response(visualizations)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def preprocessing_split(request):
    """Realiza split del dataset en train/val/test"""
    try:
        train_ratio = float(request.data.get('train_ratio', 0.6))
        val_ratio = float(request.data.get('val_ratio', 0.2))
        test_ratio = float(request.data.get('test_ratio', 0.2))
        stratified = request.data.get('stratified', True)
        random_state = int(request.data.get('random_state', 42))
        
        result = preprocessor.split_dataset(
            train_ratio, val_ratio, test_ratio, stratified, random_state
        )
        return Response(result)
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def preprocessing_transform(request):
    """Aplica transformaciones al dataset (escalado, encoding, etc)"""
    try:
        result = preprocessor.transform_data()
        return Response(result)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def model_metrics(request):
    """Obtiene métricas de evaluación de un modelo específico"""
    try:
        model_name = request.query_params.get('model', 'logistic_regression')
        metrics = model_evaluator.get_metrics(model_name)
        return Response(metrics)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def model_compare(request):
    """Compara el rendimiento de diferentes modelos"""
    try:
        comparison = model_evaluator.compare_models()
        return Response(comparison)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def upload_dataset(request):
    """Carga un dataset (CSV) para ser procesado"""
    try:
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No se proporcionó ningún archivo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        return Response({
            'mensaje': 'Archivo recibido',
            'nombre': file.name
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def dataset_status(request):
    """Verifica el estado actual del procesamiento"""
    try:
        return Response({
            'estado': 'listo',
            'mensaje': 'Sistema preparado para procesar datos',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# --- ESTA ES LA NUEVA FUNCIÓN QUE FALTABA ---
@api_view(['POST'])
def train_model(request):
    """Inicia el entrenamiento de un modelo"""
    try:
        model_type = request.data.get('model_type', 'logistic_regression')
        # Aquí iría la lógica real de llamada al entrenamiento
        
        return Response({
            'mensaje': f'Entrenamiento iniciado para: {model_type}',
            'status': 'training_started',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

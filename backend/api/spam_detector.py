import re
import html
import math
import pandas as pd
from collections import Counter

class SpamDetector:
    """Detector de spam basado en características del texto"""
    
    def __init__(self):
        # Palabras clave comunes en spam
        self.spam_keywords = [
            'free', 'winner', 'cash', 'prize', 'urgent', 'click', 'offer',
            'limited', 'act now', 'congratulations', 'guarantee', 'no cost',
            'gratis', 'ganador', 'premio', 'urgente', 'oferta', 'garantía'
        ]
        
        # Palabras clave legítimas
        self.ham_keywords = [
            'meeting', 'schedule', 'report', 'attached', 'please', 'regards',
            'reunión', 'reporte', 'adjunto', 'saludos', 'gracias'
        ]
        
        self.using_custom_model = False
        self.training_data = None
    
    def load_training_data(self, dataframe: pd.DataFrame) -> dict:
        """Carga datos de entrenamiento de spam desde un DataFrame"""
        try:
            self.training_data = dataframe
            self.using_custom_model = True
            
            # Detectar columnas de texto y etiqueta
            text_cols = [col for col in dataframe.columns if 'text' in col.lower() or 'body' in col.lower() or 'message' in col.lower()]
            label_cols = [col for col in dataframe.columns if 'label' in col.lower() or 'class' in col.lower() or 'spam' in col.lower()]
            
            if not text_cols or not label_cols:
                raise Exception("No se encontraron columnas de texto o etiqueta apropiadas")
            
            # Actualizar palabras clave basadas en datos reales
            spam_texts = dataframe[dataframe[label_cols[0]] == 1][text_cols[0]].str.lower()
            ham_texts = dataframe[dataframe[label_cols[0]] == 0][text_cols[0]].str.lower()
            
            # Extraer palabras más comunes
            spam_words = ' '.join(spam_texts.astype(str).tolist()).split()
            ham_words = ' '.join(ham_texts.astype(str).tolist()).split()
            
            spam_counter = Counter(spam_words)
            ham_counter = Counter(ham_words)
            
            # Actualizar palabras clave
            self.spam_keywords.extend([word for word, _ in spam_counter.most_common(20)])
            self.ham_keywords.extend([word for word, _ in ham_counter.most_common(20)])
            
            return {
                'registros': len(dataframe),
                'spam_count': int(dataframe[label_cols[0]].sum()),
                'ham_count': int((~dataframe[label_cols[0]]).sum()),
                'columna_texto': text_cols[0],
                'columna_etiqueta': label_cols[0]
            }
        except Exception as e:
            self.using_custom_model = False
            raise Exception(f"Error al cargar datos de entrenamiento: {str(e)}")
    
    def predict(self, subject: str, body: str) -> dict:
        """Predice si un correo es spam"""
        text = f"{subject} {body}".lower()
        
        # Extraer características
        features = self._extract_features(subject, body, text)
        
        # Calcular score de spam (0-1)
        spam_score = self._calculate_spam_score(features)
        
        # Clasificar
        is_spam = spam_score > 0.5
        confidence = spam_score if is_spam else (1 - spam_score)
        
        return {
            'es_spam': is_spam,
            'confianza': round(confidence * 100, 2),
            'puntuacion_spam': round(spam_score, 3),
            'caracteristicas': features,
            'usando_modelo_personalizado': self.using_custom_model
        }
    
    def _extract_features(self, subject: str, body: str, text: str) -> dict:
        """Extrae características del correo"""
        features = {}
        
        # Características básicas
        features['longitud_total'] = len(text)
        features['longitud_asunto'] = len(subject)
        features['palabras_totales'] = len(text.split())
        
        # Conteo de caracteres especiales
        features['signos_exclamacion'] = text.count('!')
        features['signos_pregunta'] = text.count('?')
        features['simbolos_dinero'] = text.count('$') + text.count('€') + text.count('£')
        features['mayusculas_pct'] = sum(1 for c in text if c.isupper()) / max(len(text), 1) * 100
        
        # HTML y URLs
        features['tiene_html'] = bool(re.search(r'<[^>]+>', body))
        features['num_urls'] = len(re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\$$\$$,]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text))
        
        # Palabras clave de spam
        spam_count = sum(1 for keyword in self.spam_keywords if keyword in text)
        features['palabras_spam'] = spam_count
        
        # Palabras clave legítimas
        ham_count = sum(1 for keyword in self.ham_keywords if keyword in text)
        features['palabras_legitimas'] = ham_count
        
        # Urgencia
        urgency_words = ['urgent', 'hurry', 'act now', 'limited time', 'urgente', 'rápido']
        features['palabras_urgencia'] = sum(1 for word in urgency_words if word in text)
        
        return features
    
    def _calculate_spam_score(self, features: dict) -> float:
        """Calcula un score de spam basado en características"""
        score = 0.0
        
        # Pesos para diferentes características
        if features['palabras_spam'] > 2:
            score += 0.3
        elif features['palabras_spam'] > 0:
            score += 0.15
        
        if features['palabras_urgencia'] > 0:
            score += 0.2
        
        if features['mayusculas_pct'] > 30:
            score += 0.15
        
        if features['signos_exclamacion'] > 3:
            score += 0.1
        
        if features['simbolos_dinero'] > 2:
            score += 0.1
        
        if features['num_urls'] > 3:
            score += 0.15
        
        # Reducir score si hay palabras legítimas
        if features['palabras_legitimas'] > 2:
            score -= 0.2
        
        # Normalizar entre 0 y 1
        return max(0.0, min(1.0, score))

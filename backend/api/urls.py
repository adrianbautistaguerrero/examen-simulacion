from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('health/', views.health_check, name='health-check'),
    path('spam/predict/', views.spam_predict, name='spam-predict'),
    path('dataset/info/', views.dataset_info, name='dataset-info'),
    path('dataset/visualizations/', views.dataset_visualizations, name='dataset-visualizations'),
    path('preprocessing/split/', views.preprocessing_split, name='preprocessing-split'),
    path('preprocessing/transform/', views.preprocessing_transform, name='preprocessing-transform'),
    path('model/metrics/', views.model_metrics, name='model-metrics'),
    path('model/compare/', views.model_compare, name='model-compare'),
    path('dataset/upload/', views.upload_dataset, name='upload-dataset'),
    path('dataset/status/', views.dataset_status, name='dataset-status'),
    path('model/train/', views.train_model, name='train-model'),
    path('model/list/', views.list_trained_models, name='list-trained-models'),
    path('model/load/', views.load_trained_model, name='load-trained-model'),
]

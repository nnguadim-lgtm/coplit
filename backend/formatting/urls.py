from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('fonts', views.FontFamilyViewSet, basename='font')
router.register('templates', views.FormattingTemplateViewSet, basename='template')
router.register('configurations', views.FormattingConfigurationViewSet, basename='configuration')
router.register('presets', views.UserFormattingPresetViewSet, basename='preset')

urlpatterns = [
    path('', include(router.urls)),
    path('process/', views.process_document, name='process-document'),
    path('preview/', views.generate_preview, name='generate-preview'),
    path('tasks/<str:task_id>/', views.get_task_status, name='task-status'),
    path('validate/', views.validate_formatting_config, name='validate-config'),
    path('suggestions/<uuid:document_id>/', views.get_formatting_suggestions, name='formatting-suggestions'),
]
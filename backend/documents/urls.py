from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.DocumentViewSet, basename='document')
router.register('types', views.DocumentTypeViewSet, basename='document-type')

urlpatterns = [
    path('', include(router.urls)),
    path('<uuid:document_id>/processed/', views.ProcessedDocumentView.as_view(), name='processed-document'),
    path('shared/<uuid:share_token>/', views.shared_document_view, name='shared-document'),
]
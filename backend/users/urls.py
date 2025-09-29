from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.CurrentUserView.as_view(), name='current-user'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('password-reset/', views.password_reset_request, name='password-reset'),
    path('password-reset-confirm/', views.password_reset_confirm, name='password-reset-confirm'),
    path('verify-email/', views.verify_email, name='verify-email'),
    path('resend-verification/', views.resend_verification_email, name='resend-verification'),
]
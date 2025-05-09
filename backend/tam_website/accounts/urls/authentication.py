from django.urls import path
from ..custom import views as custom_views
from rest_framework_simplejwt.views import TokenRefreshView
from .. import views

urlpatterns = [
    path('get-access-token/', custom_views.CustomTokenObtainPairView.as_view(), name='access-token'),
    path('get-refresh-token/', TokenRefreshView.as_view(), name='refresh-token'),
    path('otp_code/', views.OtpCodeView.as_view(), name='otp_code'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('change_password/',views.ChangePasswordView.as_view(), name='change-password'),
]


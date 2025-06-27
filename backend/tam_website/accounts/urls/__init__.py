from django.urls import include, path


urlpatterns = [
    path('', include('accounts.urls.authentication')),
]


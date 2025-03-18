"""
URL configuration for predictor project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import predict_food
from .views import health_check, predict_food_get

urlpatterns = [
    path('admin/', admin.site.urls),
    path('predict/', predict_food, name='predict_food'),
    path('predict-get/', predict_food_get, name='predict_food_get'),
    path("", health_check),
]

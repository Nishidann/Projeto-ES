from django.contrib import admin
from django.urls import path
from usuarios.views import criar_usuario, login_usuario

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/usuarios/', criar_usuario),
    path('api/login/', login_usuario),
]

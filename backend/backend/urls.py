from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Rotas de usuários ficam separadas no app
    path("api/usuarios/", include("usuarios.urls")),
    path("api/jogo/", include("jogo.urls")),

]

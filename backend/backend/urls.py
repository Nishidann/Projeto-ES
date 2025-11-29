from django.contrib import admin
from django.urls import path, include
from usuarios import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # rotas da API de usuários
    path("api/", include("usuarios.urls")),

    # CREATE
    path('api/usuarios/', views.criar_usuario),

    # READ
    path('api/usuarios/todos/', views.listar_usuarios),
    path('api/usuarios/<int:id>/', views.detalhar_usuario),

    # UPDATE
    path("usuarios/<int:id>/atualizar/", views.atualizar_usuario),


    # DELETE
    path('api/usuarios/<int:id>/deletar/', views.deletar_usuario),
]

from django.urls import path
from .views import (
    criar_usuario,
    listar_usuarios,
    detalhar_usuario,
    atualizar_usuario,
    deletar_usuario,
    login_usuario,
)

urlpatterns = [
    # LOGIN
    path("usuarios/login/", login_usuario),

    # CREATE
    path("usuarios/criar/", criar_usuario),

    # READ
    path("usuarios/", listar_usuarios),
    path("usuarios/<int:id>/", detalhar_usuario),

    # UPDATE
    path("usuarios/<int:id>/atualizar/", atualizar_usuario),

    # DELETE
    path("usuarios/<int:id>/deletar/", deletar_usuario),
]

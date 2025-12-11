from django.urls import path
from .views import (
    criar_jogo,
    listar_jogos,
    detalhar_jogo,
    atualizar_jogo,
    deletar_jogo,
    listar_generos,
)

urlpatterns = [
    path("", listar_jogos),
    path("criar/", criar_jogo),
    path("<int:id>/", detalhar_jogo),
    path("<int:id>/atualizar/", atualizar_jogo),
    path("<int:id>/deletar/", deletar_jogo),
    path("generos/", listar_generos),  # <--- necessário para o front
]

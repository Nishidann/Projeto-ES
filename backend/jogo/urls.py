from django.urls import path
from . import views

urlpatterns = [
    path("", views.listar_jogos, name="listar_jogos"),
    path("criar/", views.criar_jogo, name="criar_jogo"),
    path("<int:id>/", views.detalhar_jogo, name="detalhar_jogo"),
    path("<int:id>/atualizar/", views.atualizar_jogo, name="atualizar_jogo"),
    path("<int:id>/deletar/", views.deletar_jogo, name="deletar_jogo"),
    path("generos/", views.listar_generos, name="listar_generos"),

    # apenas endpoints relativos
    path("<int:jogo_id>/comentarios/", views.listar_comentarios, name="listar_comentarios"),
    path("comentarios/criar/", views.criar_comentario, name="criar_comentario"),
]

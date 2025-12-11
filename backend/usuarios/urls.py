from django.urls import path
from . import views

urlpatterns = [
    # CREATE
    path('', views.criar_usuario),

    # READ
    path('todos/', views.listar_usuarios),
    path('<int:id>/', views.detalhar_usuario),

    # UPDATE
    path('<int:id>/atualizar/', views.atualizar_usuario),

    # DELETE
    path('<int:id>/deletar/', views.deletar_usuario),
]

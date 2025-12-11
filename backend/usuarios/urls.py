from django.urls import path
from . import views

urlpatterns = [
    path('', views.criar_usuario),
    path('todos/', views.listar_usuarios),
    path('<int:id>/', views.detalhar_usuario),
    path('<int:id>/atualizar/', views.atualizar_usuario),
    path('<int:id>/deletar/', views.deletar_usuario),

    # LOGIN
    path('login/', views.login_usuario),
]

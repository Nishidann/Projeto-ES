from django.db import models
from usuarios.models import Usuario

class Jogo(models.Model):

    GENEROS = [
        ("acao", "Ação"),
        ("aventura", "Aventura"),
        ("rpg", "RPG"),
        ("estrategia", "Estratégia"),
        ("corrida", "Corrida"),
        ("esportes", "Esportes"),
        ("terror", "Terror"),
        ("simulacao", "Simulação"),
        ("luta", "Luta"),
        ("tiro", "Tiro (FPS/TPS)"),
        ("moba", "MOBA"),
        ("plataforma", "Plataforma"),
    ]
    

    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    ano = models.IntegerField()
    capa_url = models.URLField(blank=True, null=True)

    genero = models.CharField(max_length=50, choices=GENEROS)

    def __str__(self):
        return self.titulo

class Comentario(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    jogo = models.ForeignKey("Jogo", on_delete=models.CASCADE, related_name="comentarios")
    texto = models.TextField()
    nota = models.IntegerField(default=5)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.nome} - {self.jogo.titulo}"
from django.db import models

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

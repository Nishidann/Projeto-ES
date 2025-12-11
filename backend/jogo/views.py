from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Jogo


def listar_generos(request):
    generos = [
        {"value": chave, "label": label}
        for chave, label in Jogo.GENEROS
    ]
    return JsonResponse(generos, safe=False)


@csrf_exempt
def criar_jogo(request):
    if request.method != "POST":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    dados = json.loads(request.body)

    jogo = Jogo.objects.create(
        titulo=dados.get("titulo"),
        descricao=dados.get("descricao"),
        genero=dados.get("genero"),
        ano=dados.get("ano"),
    )

    return JsonResponse({"mensagem": "Jogo criado", "id": jogo.id})


def listar_jogos(request):
    jogos = Jogo.objects.all()

    dados = [
        {
            "id": j.id,
            "titulo": j.titulo,
            "descricao": j.descricao,
            "ano": j.ano,
            "genero": j.genero,
        }
        for j in jogos
    ]

    return JsonResponse(dados, safe=False)


def detalhar_jogo(request, id):
    try:
        jogo = Jogo.objects.get(id=id)
    except Jogo.DoesNotExist:
        return JsonResponse({"erro": "Jogo não encontrado"}, status=404)

    return JsonResponse({
        "id": jogo.id,
        "titulo": jogo.titulo,
        "descricao": jogo.descricao,
        "genero": jogo.genero,
        "ano": jogo.ano,
    })


@csrf_exempt
def atualizar_jogo(request, id):
    if request.method != "PUT":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    try:
        jogo = Jogo.objects.get(id=id)
    except Jogo.DoesNotExist:
        return JsonResponse({"erro": "Jogo não encontrado"}, status=404)

    dados = json.loads(request.body)

    jogo.titulo = dados.get("titulo", jogo.titulo)
    jogo.descricao = dados.get("descricao", jogo.descricao)
    jogo.genero = dados.get("genero", jogo.genero)
    jogo.ano = dados.get("ano", jogo.ano)
    jogo.save()

    return JsonResponse({"mensagem": "Jogo atualizado"})


@csrf_exempt
def deletar_jogo(request, id):
    if request.method != "DELETE":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    try:
        jogo = Jogo.objects.get(id=id)
    except Jogo.DoesNotExist:
        return JsonResponse({"erro": "Jogo não encontrado"}, status=404)

    jogo.delete()
    return JsonResponse({"mensagem": "Jogo deletado"})

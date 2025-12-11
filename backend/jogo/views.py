from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Jogo, Comentario
from usuarios.models import Usuario


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

def listar_comentarios(request, jogo_id):
    comentarios = Comentario.objects.filter(jogo_id=jogo_id).select_related("usuario").order_by("-criado_em")
    dados = [
        {
            "id": c.id,
            "usuario": c.usuario.nome,
            "texto": c.texto,
            "nota": c.nota,
            "criado_em": c.criado_em.strftime("%d/%m/%Y %H:%M"),
        }
        for c in comentarios
    ]
    return JsonResponse(dados, safe=False)


# Criar comentário
@csrf_exempt
def criar_comentario(request):
    if request.method != "POST":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    dados = json.loads(request.body)
    usuario_id = dados.get("usuario_id")
    jogo_id = dados.get("jogo_id")
    texto = dados.get("texto")
    nota = dados.get("nota", 5)

    try:
        usuario = Usuario.objects.get(id=usuario_id)
        jogo = Jogo.objects.get(id=jogo_id)
    except (Usuario.DoesNotExist, Jogo.DoesNotExist):
        return JsonResponse({"erro": "Usuário ou Jogo não encontrado"}, status=404)

    comentario = Comentario.objects.create(
        usuario=usuario,
        jogo=jogo,
        texto=texto,
        nota=nota
    )

    return JsonResponse({
        "id": comentario.id,
        "usuario": comentario.usuario.nome,
        "texto": comentario.texto,
        "nota": comentario.nota,
        "criado_em": comentario.criado_em.strftime("%d/%m/%Y %H:%M"),
    })
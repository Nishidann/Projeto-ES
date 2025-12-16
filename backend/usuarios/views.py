import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario


@csrf_exempt
def criar_usuario(request):
    if request.method != "POST":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    dados = json.loads(request.body)

    if Usuario.objects.filter(email=dados["email"]).exists():
        return JsonResponse({"erro": "Email já cadastrado"}, status=400)

    # 🔐 primeiro usuário vira admin
    is_primeiro_usuario = Usuario.objects.count() == 0

    usuario = Usuario.objects.create(
        nome=dados["nome"],
        email=dados["email"],
        senha=dados["senha"],
        is_admin=is_primeiro_usuario
    )

    return JsonResponse({
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "is_admin": usuario.is_admin
    })



def listar_usuarios(request):
    if request.method != "GET":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    usuarios = Usuario.objects.all().values(
        "id", "nome", "email", "is_admin"
    )
    return JsonResponse(list(usuarios), safe=False)


def detalhar_usuario(request, id):
    if request.method != "GET":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    try:
        usuario = Usuario.objects.get(id=id)
    except Usuario.DoesNotExist:
        return JsonResponse({"erro": "Usuário não encontrado"}, status=404)

    return JsonResponse({
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "is_admin": usuario.is_admin
    })


@csrf_exempt
def atualizar_usuario(request, id):
    if request.method not in ["PUT", "POST"]:
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    try:
        usuario = Usuario.objects.get(id=id)
    except Usuario.DoesNotExist:
        return JsonResponse({"erro": "Usuário não encontrado"}, status=404)

    dados = json.loads(request.body)

    usuario.nome = dados.get("nome", usuario.nome)
    usuario.email = dados.get("email", usuario.email)

    nova_senha = dados.get("senha")
    if nova_senha:
        usuario.senha = nova_senha

    usuario.save()

    return JsonResponse({
        "mensagem": "Usuário atualizado",
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "is_admin": usuario.is_admin
    })


@csrf_exempt
def login_usuario(request):
    if request.method != "POST":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    dados = json.loads(request.body)
    email = dados.get("email")
    senha = dados.get("senha")

    try:
        usuario = Usuario.objects.get(email=email, senha=senha)
    except Usuario.DoesNotExist:
        return JsonResponse({"erro": "Credenciais inválidas"}, status=400)

    return JsonResponse({
        "mensagem": "Login realizado com sucesso",
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "is_admin": usuario.is_admin  # 🔥 ISSO É O QUE FALTAVA
    })



@csrf_exempt
def deletar_usuario(request, id):
    if request.method != "DELETE":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    try:
        usuario = Usuario.objects.get(id=id)
    except Usuario.DoesNotExist:
        return JsonResponse({"erro": "Usuário não encontrado"}, status=404)

    usuario.delete()

    return JsonResponse({"mensagem": "Usuário deletado com sucesso"})

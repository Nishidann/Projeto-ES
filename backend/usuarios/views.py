import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import Usuario


@csrf_exempt
def criar_usuario(request):
    if request.method != "POST":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    body = json.loads(request.body.decode("utf-8"))
    nome = body.get("nome")
    email = body.get("email")
    senha = body.get("senha")

    if Usuario.objects.filter(email=email).exists():
        return JsonResponse({"erro": "Email já cadastrado"}, status=400)

    usuario = Usuario.objects.create(
        nome=nome,
        email=email,
        senha=make_password(senha)
    )

    return JsonResponse({
        "mensagem": "Usuário criado com sucesso!",
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email
        }
    })
    

@csrf_exempt
def login_usuario(request):
    if request.method != "POST":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    body = json.loads(request.body.decode("utf-8"))
    email = body.get("email")
    senha = body.get("senha")

    try:
        usuario = Usuario.objects.get(email=email)
    except Usuario.DoesNotExist:
        return JsonResponse({"erro": "Usuário não encontrado"}, status=404)

    if not check_password(senha, usuario.senha):
        return JsonResponse({"erro": "Senha incorreta"}, status=401)

    return JsonResponse({
        "mensagem": "Login efetuado!",
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email
        }
    })

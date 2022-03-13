# Padrão
{
  "rules": {
    ".read": false,
    ".write": false
  }
}

# Público
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

# Usuários autenticados
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}

# Acesso restrito ao dono dos dados
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid == auth.uid",
        ".write": "$uid == auth.uid"
      }
    }
  }
}

# Incluindo regras de validação para as tarefas
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid == auth.uid",
    		".write": "$uid == auth.uid",
        "$tid": {
          ".validate": "newData.child('name').isString() && newData.child('name').val().length <= 30"
        }
      }
    }
  }
}
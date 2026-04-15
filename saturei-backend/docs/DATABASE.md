# Database Setup & Migrations

Guia para configurar o banco de dados local e gerenciar migrations com Flyway.

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- [Java 17](https://adoptium.net/) (para rodar o app localmente sem Docker)
- [pgAdmin 4](https://www.pgadmin.org/) ou DBeaver (opcional, para inspecionar o banco)

---

## 1. Subir o banco de dados

### Copiar o arquivo de variáveis de ambiente

```bash
cp .env.example .env
```

> O `.env` já vem preenchido com os valores padrão para desenvolvimento local.  
> **Nunca commite o `.env` real** — ele está no `.gitignore`.

### Iniciar o container do PostgreSQL

```bash
docker-compose up -d db
```

Verifique se está rodando:

```bash
docker ps
```

Você deve ver algo como:

```
NAMES        STATUS           PORTS
saturei-db   Up X seconds (healthy)   0.0.0.0:5432->5432/tcp
```

---

## 2. Rodar o backend (Flyway executa automaticamente)

O Flyway roda **automaticamente** ao iniciar o Spring Boot, aplicando todas as migrations pendentes.

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev \
  -Dspring-boot.run.jvmArguments="-DDB_URL=jdbc:postgresql://localhost:5432/saturei -DDB_USERNAME=postgres -DDB_PASSWORD=postgres"
```

> No Windows (PowerShell):
> ```powershell
> .\mvnw spring-boot:run "-Dspring-boot.run.profiles=dev" "-Dspring-boot.run.jvmArguments=-DDB_URL=jdbc:postgresql://localhost:5432/saturei -DDB_USERNAME=postgres -DDB_PASSWORD=postgres"
> ```

Quando o app subir, as tabelas já estarão criadas no banco.

---

## 3. Conectar no pgAdmin

| Campo    | Valor       |
|----------|-------------|
| Host     | `localhost` |
| Port     | `5432`      |
| Database | `saturei`   |
| Username | `postgres`  |
| Password | `postgres`  |

---

## 4. Criar uma nova migration

### Convenção de nomenclatura obrigatória

Os arquivos de migration **devem** seguir o padrão do Flyway:

```
V{versão}__{descrição}.sql
```

| Parte | Descrição | Exemplo |
|---|---|---|
| `V` | Prefixo fixo | `V` |
| `{versão}` | Número inteiro sequencial | `2`, `3`, `10` |
| `__` | Dois underscores | `__` |
| `{descrição}` | Palavras separadas por `_` | `add_phone_to_users` |

### Exemplos válidos

```
V2__add_phone_to_users.sql
V3__create_favorites_table.sql
V10__add_index_on_orders_status.sql
```

### Onde colocar o arquivo

```
src/main/resources/db/migration/
├── V1__create_schema.sql       ← migration inicial (não edite!)
├── V2__sua_nova_migration.sql  ← adicione aqui
└── ...
```

### Exemplo de migration

```sql
-- V2__add_phone_to_users.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

### Aplicar a migration

Basta **reiniciar o app**. O Flyway detecta automaticamente os arquivos novos e os executa na ordem.

---

## 5. Regras importantes

> [!CAUTION]
> **Nunca edite ou delete um arquivo de migration já commitado.**  
> O Flyway armazena um checksum de cada migration na tabela `flyway_schema_history`.  
> Se o arquivo for alterado após ser executado, o app vai falhar ao iniciar com erro de validação.

> [!WARNING]
> **Não pule versões.** Se a última migration é `V3`, a próxima deve ser `V4`.  
> Versões fora de ordem podem causar comportamento inesperado.

> [!TIP]
> Para **desfazer uma migration em dev**, pare o app, apague o volume e suba novamente:
> ```bash
> docker-compose down -v
> docker-compose up -d db
> ```
> Isso recria o banco do zero e o Flyway re-executa todas as migrations.

---

## 6. Verificar migrations executadas

No pgAdmin ou via psql, consulte a tabela de controle do Flyway:

```sql
SELECT version, description, script, success, installed_on
FROM flyway_schema_history
ORDER BY installed_rank;
```

Uma migration com `success = true` foi aplicada com sucesso.

---

## 7. Estrutura de arquivos relevantes

```
saturei-backend/
├── .env.example                          # template das variáveis de ambiente
├── .env                                  # variáveis locais (não commitar)
├── docker-compose.yml                    # sobe o PostgreSQL local
├── Dockerfile                            # build da imagem da aplicação
└── src/
    └── main/
        └── resources/
            ├── application.properties    # config base (usa env vars)
            ├── application-dev.properties# config do perfil dev
            └── db/
                └── migration/
                    └── V1__create_schema.sql
```

# 🧠 Autômato de Pilha -- Analisador Sintático LL(1)

Interface interativa desenvolvida para o Trabalho Discente Efetivo (TDE)
da disciplina de **Compiladores**, URI Erechim, implementando um
**Analisador Sintático Top-Down Preditivo Tabular (LL(1))** com geração
interativa de sentenças, validação e traço completo da pilha.

::: {align="center"}
### 🔸 Tema visual: **Black & Gold Premium UI**

### 🔸 Desenvolvido por **João Rossetto --- 2025**
:::

------------------------------------------------------------------------

# 🚀 Demonstração

::: {align="center"}
`<img src="https://i.imgur.com/Q6lx5rS.png" width="850">`{=html}
:::

> Interface moderna com foco em legibilidade e usabilidade, incluindo
> modo interativo via tabela LL(1), execução passo a passo e análise
> completa da pilha.

------------------------------------------------------------------------

# 📌 Sobre o Projeto

Este trabalho implementa um **Autômato de Pilha LL(1)** baseado em:

-   Gramática Livre de Contexto fatorada, não ambígua e sem recursão à
    esquerda
-   FIRST e FOLLOW calculados e organizados
-   Tabela de Parsing LL(1) construída manualmente
-   Pilha top-down preditiva não recursiva
-   Reconhecimento de sentenças corretas e rejeição automática das
    inválidas

O sistema permite:

✔ Entrada manual de sentenças\
✔ Geração de sentenças pela tabela LL(1)\
✔ Status dinâmico da sentença (parcial / válida / inválida)\
✔ Execução passo a passo\
✔ Execução completa automática\
✔ Desfazer interação da sentença\
✔ Traço completo da pilha com ações\
✔ Resultado final (aceito / rejeitado + número de passos)

------------------------------------------------------------------------

# 📚 Gramática Utilizada (LL(1))

    S → a A b | b B | c C d  
    A → a C | ε  
    B → a D c | b A  
    C → a B | d A  
    D → c S

✔ 5 regras\
✔ Uma delas possui 3 produções\
✔ Pelo menos 3 regras têm 2+ produções\
✔ Uma delas possui ε\
✔ Não há produções do tipo A → a\
✔ Fatorada, sem recursão à esquerda\
✔ LL(1) válida

------------------------------------------------------------------------

# 🔎 FIRST e FOLLOW

### FIRST

    FIRST(S) = { a, b, c }
    FIRST(A) = { a, ε }
    FIRST(B) = { a, b }
    FIRST(C) = { a, d }
    FIRST(D) = { c }

### FOLLOW

    FOLLOW(S) = { $, c }
    FOLLOW(A) = { $, b, c, d }
    FOLLOW(B) = { $, b, c, d }
    FOLLOW(C) = { $, b, c, d }
    FOLLOW(D) = { c }

------------------------------------------------------------------------

# 🧩 Tabela de Parsing LL(1)

          a        b        c        d        $
    S   a A b     b B    c C d      —        —
    A   a C       ε        ε        ε        ε
    B   a D c    b A       —        —        —
    C   a B       —        —       d A       —
    D    —        —       c S       —        —

------------------------------------------------------------------------

# 🛠️ Como executar

Basta abrir o arquivo:

    index.html

O sistema funciona totalmente **offline**, sem depender de servidor.

------------------------------------------------------------------------

# 📁 Estrutura do Projeto

    📦 raiz
     ├── index.html        # Interface principal
     ├── css/
     │    └── style.css    # Tema Black & Gold
     ├── js/
     │    └── script.js    # Lógica do analisador LL(1)
     └── assets/ (opcional para prints)

------------------------------------------------------------------------

# 🎨 Destaques do Front-end

-   Layout organizado em duas colunas
-   Efeitos premium (glass, glow, hover, animações)
-   Responsividade ajustada
-   Feedback visual imediato
-   Paleta Gold & Black sofisticada

------------------------------------------------------------------------

# 🧪 Funcionamento Interno

O analisador segue o algoritmo padrão LL(1):

1.  Inicializa a pilha com `S` e `$`
2.  Lê o próximo símbolo da entrada (`lookahead`)
3.  Se topo da pilha é terminal:
    -   Caso igual ao lookahead → consome
    -   Caso contrário → erro
4.  Se topo é não-terminal:
    -   Consulta tabela LL(1)
    -   Aplica produção (ou erro)
5.  Aceita ao encontrar `S → ... → $` simultaneamente com a entrada

A interface registra cada passo na tabela:

-   Estado da pilha
-   Entrada restante
-   Ação aplicada
-   Número do passo

------------------------------------------------------------------------

# 🏁 Resultado Final

O sistema indica:

-   ✔ **"Aceito em X passos."**\
-   ❌ **"Erro em X passos."**

E permite continuar testando sentenças sem recarregar a página.

------------------------------------------------------------------------

# 📎 Requisitos do TDE Atendidos

  Requisito                 Atendido
  ------------------------- ----------
  GLC LL(1) válida          ✔
  FIRST / FOLLOW            ✔
  Tabela LL(1)              ✔
  Pilha top-down tabular    ✔
  Entrada manual            ✔
  Geração de sentenças      ✔
  Traço completo da pilha   ✔
  Resultado final           ✔
  Usabilidade e layout      ✔
  Execução no navegador     ✔

------------------------------------------------------------------------

# 👨‍💻 Autor

**João Rossetto**\
Estudante de Ciência da Computação -- URI Erechim\
Desenvolvimento Web • Compiladores • IA • Sistemas

------------------------------------------------------------------------

# 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos na
disciplina de **Compiladores -- Prof. Fabio Zanin**.

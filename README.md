# Autômato de Pilha – Analisador Sintático LL(1)

Este projeto faz parte do Trabalho Discente Efetivo (TDE) da disciplina de Compiladores da URI Erechim.  
O objetivo é implementar um analisador sintático LL(1) usando um autômato de pilha top-down preditivo tabular, seguindo os requisitos definidos pelo professor.

A interface permite testar sentenças manualmente e também gerar sentenças interativamente pela tabela LL(1). Todo o processo da pilha é mostrado passo a passo.

------------------------------------------------

## Sobre o Projeto

O analisador foi desenvolvido com HTML, CSS e JavaScript. Ele utiliza:

- Gramática LL(1) fatorada e sem recursão à esquerda  
- Conjuntos FIRST e FOLLOW  
- Tabela de Parsing  
- Pilha top-down não recursiva  

O sistema aceita ou rejeita sentenças conforme a gramática e mostra o traço completo da execução.

------------------------------------------------

## Gramática Utilizada (LL(1))

S → a A b | b B | c C d
A → a C | ε
B → a D c | b A
C → a B | d A
D → c S

------------------------------------------------

## FIRST

FIRST(S) = { a, b, c }
FIRST(A) = { a, ε }
FIRST(B) = { a, b }
FIRST(C) = { a, d }
FIRST(D) = { c }

------------------------------------------------

## FOLLOW

FOLLOW(S) = { $, c }
FOLLOW(A) = { $, b, c, d }
FOLLOW(B) = { $, b, c, d }
FOLLOW(C) = { $, b, c, d }
FOLLOW(D) = { c }

------------------------------------------------

## Tabela de Parsing LL(1)

| NT | a     | b   | c     | d    | $   |
|----|-------|-----|-------|------|-----|
| S  | a A b | b B | c C d | —    | —   |
| A  | a C   | ε   | ε     | ε    | ε   |
| B  | a D c | b A | —     | —    | —   |
| C  | a B   | —   | —     | d A  | —   |
| D  | —     | —   | c S   | —    | —   |

------------------------------------------------

## Como executar

Basta abrir o arquivo: index.html
O sistema funciona offline, diretamente no navegador.

------------------------------------------------

## Estrutura do Projeto

/raiz
├── index.html
├── css/
│ └── style.css
├── js/
│ └── script.js

------------------------------------------------

## Funcionamento do Analisador

1. A pilha inicia com `S` e `$`.  
2. O analisador lê o símbolo atual da entrada.  
3. Se o topo da pilha é terminal, compara com a entrada.  
4. Se for não-terminal, consulta a tabela LL(1) e aplica a produção.  
5. Aceita quando pilha e entrada chegam em `$` ao mesmo tempo.

Durante o processo, a tela mostra:
- Pilha  
- Entrada  
- Ação aplicada  
- Número do passo  

------------------------------------------------

## Autor

João Rossetto  
Aluno de Ciência da Computação – URI Erechim

------------------------------------------------

## Observação

Projeto desenvolvido exclusivamente para fins acadêmicos na disciplina de Compiladores (Prof. Fabio Zanin).

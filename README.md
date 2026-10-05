# Estude Cards CMS Plus

Extensão para Google Chrome que adiciona ao CMS do [estudecards.com.br](https://estudecards.com.br/cms) funções de **inclusão, atualização e download de cards e perguntas em lote** por meio de planilhas CSV.

A extensão atua nas páginas **Cards da Disciplina** e **Perguntas da Disciplina** do CMS e usa a sessão do usuário logado: só faz o que o próprio usuário teria permissão de fazer manualmente.

## Funcionalidades

| Funcionalidade | Cards | Perguntas |
|---|:---:|:---:|
| Incluir registros em lote a partir de um CSV | ✅ | ✅ |
| Atualizar registros existentes reenviando o CSV com a coluna ID | ✅ | ✅ |
| Definir a posição (ordem de exibição) pela coluna Posição | ✅ | — |
| Baixar os registros selecionados em CSV | ✅ | ✅ |
| Desfazer automaticamente a importação em caso de erro (rollback) | ✅ | ✅ |
| Formatação do texto com Markdown | ✅ | ✅ |

## Instalação

Pré-requisitos: [Node.js](https://nodejs.org) e [Yarn](https://yarnpkg.com).

```bash
yarn install
yarn build
```

O build gera a extensão na pasta `dist/`. Para carregá-la no Chrome:

1. Acesse `chrome://extensions`;
2. Ative o **Modo do desenvolvedor**;
3. Clique em **Carregar sem compactação** e selecione a pasta `dist/`.

Scripts disponíveis:

| Comando | Descrição |
|---|---|
| `yarn build` | Build de produção (minificado) |
| `yarn dev` | Build de desenvolvimento em modo *watch* |
| `yarn debug` | Build de desenvolvimento com *source maps* |

## Como usar

Na página **Cards da Disciplina** ou **Perguntas da Disciplina**, a extensão adiciona dois botões ao lado do botão de adicionar do CMS:

- **Adicionar em lote**: abre a janela de envio do CSV. Nela também há o botão **Baixar modelo CSV**.
- **Baixar selecionados (CSV)**: baixa os registros marcados na coluna **Seleção** do CMS.

### Incluir em lote

1. Baixe o modelo CSV ([cards](docs/modelo_cards.csv) ou [perguntas](docs/modelo_perguntas.csv)) e preencha uma linha por registro;
2. Clique em **Adicionar em lote** e selecione o arquivo;
3. Confira o resumo e confirme. A janela de execução mostra o progresso e a página é recarregada ao final.

### Baixar registros

1. Marque os registros na coluna **Seleção** do CMS (ou use **Selecionar tudo**);
2. Clique em **Baixar selecionados (CSV)**.

O arquivo é gerado no mesmo layout da importação, com a coluna **ID** e, no caso dos cards, a coluna **Posição**. Os registros são lidos da listagem completa da disciplina, independentemente de busca aplicada na tela.

Nas perguntas são exportadas apenas as respostas **ativas**. Ao final do download, a extensão avisa se alguma pergunta não poderá ser reimportada sem ajuste (mais de 6 respostas ativas ou um número de respostas corretas diferente de 1).

### Atualizar registros pela planilha

1. Baixe os registros (veja acima);
2. Edite a planilha. Mantenha a coluna **ID** nas linhas que devem ser atualizadas;
3. Envie o arquivo em **Adicionar em lote**.

Regras:

- Linha **com ID** atualiza o registro existente; linha **sem ID** (ou com `0`) cria um registro novo. As duas podem estar na mesma planilha;
- Só são gravados os registros que realmente mudaram. Reenviar a planilha sem edições não altera nada;
- O ID precisa pertencer à disciplina aberta. IDs de outra disciplina são recusados antes de qualquer alteração;
- A janela de confirmação informa quantos registros serão incluídos e quantos serão atualizados.

Nas **perguntas**, as respostas ativas são associadas pela ordem às colunas `Res1` a `Res6`:

| Na planilha | No CMS |
|---|---|
| Resposta alterada (texto ou correta) | A resposta é atualizada |
| Resposta a mais | Uma nova resposta é criada |
| Resposta removida | A resposta é **desativada**, não excluída |

As respostas removidas são desativadas porque podem estar referenciadas em simulados já respondidos.

## Formato do CSV

- Separador `;` (padrão do Excel em português) ou `,`;
- Primeira linha com os nomes das colunas. Os nomes não diferenciam maiúsculas de minúsculas e podem ser escritos com ou sem acento (`Comentário` ou `Comentario`, `Posição` ou `Posicao`);
- O arquivo baixado pela extensão é UTF-8 e abre diretamente no Excel.

### Cards

| Coluna | Obrigatória | Conteúdo |
|---|:---:|---|
| ID | Não | ID do card a atualizar. Em branco = card novo |
| Pergunta | Sim | Texto da frente do card |
| Resposta | Sim | Texto do verso do card |
| Comentario | Sim (pode ficar vazia) | Comentário do card |
| Assunto | Sim | Nome de um assunto já cadastrado na disciplina |
| Status | Sim | `Ativo`, `Desativado` ou `Oculto` |
| Posição | Não | Ordem de exibição. `0` ou em branco = sem posição definida |

Sobre a **Posição**:

- Aceita apenas números inteiros, sem valores repetidos na planilha;
- A extensão aplica as posições da menor para a maior, de forma que cada card fique exatamente na posição informada; os demais cards da disciplina são deslocados para abrir espaço;
- O CMS mantém as posições em sequência: se a planilha pedir posições maiores que o total de cards posicionados, elas são ajustadas (por exemplo, `10` e `20` em uma disciplina vazia viram `1` e `2`);
- Sem a coluna Posição, os cards atualizados mantêm a posição atual.

### Perguntas

| Coluna | Obrigatória | Conteúdo |
|---|:---:|---|
| ID | Não | ID da pergunta a atualizar. Em branco = pergunta nova |
| Pergunta | Sim | Enunciado |
| Fonte | Sim (pode ficar vazia) | Fonte da pergunta |
| Comentario | Sim (pode ficar vazia) | Comentário da pergunta |
| Assunto | Sim | Nome de um assunto já cadastrado na disciplina |
| Status | Sim | `Ativo`, `Desativado` ou `Oculto` |
| Res1 e Res2 | Sim | Alternativas |
| Res3 a Res6 | Não | Alternativas adicionais |
| Correta | Sim | Número da alternativa correta (`1` a `6`) |

Também são aceitos os nomes `Resposta1`, `Alternativa1`, `Alt1` (e equivalentes) para as alternativas e `Certa` para a correta.

### Formatação com Markdown

Os textos dos registros novos ou editados são convertidos de Markdown para HTML. Além da sintaxe padrão (`**negrito**`, `*itálico*`, `~~tachado~~`, listas etc.), a extensão aceita:

| Sintaxe | Resultado |
|---|---|
| `__texto__` | Sublinhado |
| `==amarelo[texto]==` | Grifo colorido (`amarelo`, `verde`, `vermelho`, `azul`, `rosa`, `laranja`, entre outras cores, ou nomes de cores HTML) |
| `{justify}texto{/justify}` | Texto justificado |

O CSV baixado traz o conteúdo em HTML, como é armazenado no CMS. Ao reenviá-lo, células não editadas são mantidas exatamente como estão.

## Validações e segurança

Antes de criar ou alterar qualquer registro, a extensão verifica:

- Colunas obrigatórias presentes e ausência de colunas não reconhecidas;
- Assuntos existentes na disciplina e status válidos;
- Colunas ID e Posição apenas com números inteiros e sem valores repetidos;
- Alternativa correta correspondente a uma resposta preenchida (perguntas);
- IDs pertencentes à disciplina aberta.

Se algo estiver errado, nada é gravado e os erros são exibidos com as linhas da planilha.

### Rollback (tudo ou nada)

Se ocorrer um erro durante a importação, a extensão desfaz o que já tinha feito:

- Os registros criados nesta importação são excluídos (no caso das perguntas, com as respostas);
- Os registros atualizados voltam ao conteúdo anterior, incluindo respostas e posições.

Por segurança, se forem encontrados mais registros novos na disciplina do que a extensão tentou criar (por exemplo, outra pessoa cadastrando ao mesmo tempo), nada é excluído automaticamente. Nesse caso, e se a própria restauração falhar, a mensagem de erro lista os IDs que precisam ser conferidos manualmente no CMS.

## Limitações conhecidas

- Imagens de cards e perguntas não são incluídas, baixadas nem atualizadas;
- Atualizar um registro altera a data de cadastro para a data atual, como acontece na edição manual pelo CMS;
- Na atualização de perguntas, quebras de linha `<br />` da Fonte viram quebras de linha simples, mesma perda que ocorre na edição pelo formulário do CMS;
- O download de perguntas lê duas páginas do CMS por pergunta (edição e respostas). Com muitas perguntas selecionadas, ele pode levar alguns segundos;
- Ao salvar a planilha, o Excel pode alterar o HTML das células; células alteradas assim são tratadas como editadas e regravadas.

## Desenvolvimento

```
src/
├── app.js                 # Ponto de entrada: identifica a página do CMS
├── components/            # Botões e janelas (jQuery UI)
├── constants/             # Páginas e URLs do CMS
├── core/
│   ├── AutomationEngine/  # Inclusão, atualização, posições e rollback
│   ├── exportCards/       # Download de cards
│   ├── exportQuestions/   # Download de perguntas
│   ├── readers/           # Leitura das listagens do CMS
│   └── csvProcessor.js    # Leitura e validação do CSV
└── utils/                 # Markdown, validação, CSV e auxiliares
docs/                      # Modelos CSV e política de privacidade
```

## Licença

[MIT](LICENSE)

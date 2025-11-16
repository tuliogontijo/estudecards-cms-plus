class MarkdownParser {
  constructor() {
    // Define a ordem de prioridade dos tokens (do mais específico ao mais geral)
    this.inlineRules = [
      // Grifos coloridos (mais específico)
      {
        name: 'highlight',
        pattern: /^==(\w+)\[([^\]]+)\]==/,
        render: (match, parser) => {
          const colors = {
            amarelo: 'yellow',
            azul: 'lightblue',
            cinza: 'lightgray',
            vermelho: '#ffcccb',
            roxo: '#e6ccff'
          };
          const color = colors[match[1]] || 'yellow';
          const content = parser.parseInline(match[2]); // Recursivo!
          return `<mark style="background-color: ${color};">${content}</mark>`;
        }
      },
      // Negrito + Itálico: ***texto***
      {
        name: 'boldItalic',
        pattern: /^\*\*\*([^*]+)\*\*\*/,
        render: (match, parser) => {
          const content = parser.parseInline(match[1]);
          return `<strong><em>${content}</em></strong>`;
        }
      },
      // Negrito: **texto**
      {
        name: 'bold',
        pattern: /^\*\*([^*]+)\*\*/,
        render: (match, parser) => {
          const content = parser.parseInline(match[1]);
          return `<strong>${content}</strong>`;
        }
      },
      // Itálico: *texto*
      {
        name: 'italic',
        pattern: /^\*([^*]+)\*/,
        render: (match, parser) => {
          const content = parser.parseInline(match[1]);
          return `<em>${content}</em>`;
        }
      },
      // Sublinhado: ~~texto~~
      {
        name: 'underline',
        pattern: /^~~(.+?)~~/,
        render: (match, parser) => {
          const content = parser.parseInline(match[1]);
          return `<u>${content}</u>`;
        }
      }
    ];

    this.blockRules = [
      // Justificar: {justify}texto{/justify}
      {
        name: 'justify',
        pattern: /^\{justify\}(.*?)\{\/justify\}/s,
        render: (match, parser) => {
          const content = parser.parseInline(match[1]);
          return `<div style="text-align: justify;">${content}</div>`;
        }
      }
    ];
  }

  /**
   * Parse inline (recursivo) - suporta aninhamento
   */
  parseInline(text) {
    if (!text) return '';

    let result = '';
    let remaining = text;

    while (remaining.length > 0) {
      let matched = false;

      // Tenta cada regra inline na ordem de prioridade
      for (const rule of this.inlineRules) {
        const match = remaining.match(rule.pattern);

        if (match && match.index === 0) {
          // Renderiza o token (pode ser recursivo)
          result += rule.render(match, this);
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }

      // Se não encontrou nenhuma marcação, adiciona o próximo caractere
      if (!matched) {
        result += remaining[0];
        remaining = remaining.slice(1);
      }
    }

    return result;
  }

  /**
   * Parse de blocos (top-level)
   */
  parseBlock(text) {
    if (!text) return '';

    let result = text;

    // Processa regras de bloco
    for (const rule of this.blockRules) {
      result = result.replace(rule.pattern, (match, ...groups) => {
        return rule.render([match, ...groups], this);
      });
    }

    // Processa inline dentro de cada bloco
    return this.parseInline(result);
  }

  /**
   * Método principal de parse
   */
  parse(text) {
    return this.parseBlock(text);
  }
}

export default MarkdownParser;

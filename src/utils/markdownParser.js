/**
 * @file MarkdownParser.js
 * Parser baseado em marked.js com extensões customizadas
 */

import { marked } from 'marked';

/**
 * Configuração do Parser Markdown com extensões customizadas
 */
class MarkdownParser {
  constructor() {
    // Configura as extensões customizadas
    this.setupExtensions();
  }

  /**
   * Configura extensões customizadas para marked.js
   */
  setupExtensions() {
    marked.use({
      extensions: [
        // Extensão para sublinhado: __texto__
        {
          name: 'underline',
          level: 'inline',
          start(src) {
            return src.indexOf('__');
          },
          tokenizer(src) {
            const rule = /^__((?:(?!__).)+)__/;
            const match = rule.exec(src);

            if (match) {
              return {
                type: 'underline',
                raw: match[0],
                text: match[1],
                tokens: this.lexer.inlineTokens(match[1]) // Suporta aninhamento!
              };
            }
          },
          renderer(token) {
            // Parse recursivo dos tokens internos
            const text = this.parser.parseInline(token.tokens);
            return `<u>${text}</u>`;
          }
        },

        // Extensão para grifos coloridos: ==cor[texto]==
        {
          name: 'highlight',
          level: 'inline',
          start(src) {
            return src.indexOf('==');
          },
          tokenizer(src) {
            const rule = /^==([a-z]+)\[([^\]]+)\]==/;
            const match = rule.exec(src);

            if (match) {
              return {
                type: 'highlight',
                raw: match[0],
                color: match[1],
                text: match[2],
                tokens: this.lexer.inlineTokens(match[2]) // Suporta aninhamento!
              };
            }
          },
          renderer(token) {
            // Mapeia cores nomeadas do HTML
            const htmlColors = {
              // Cores básicas
              amarelo: 'yellow',
              azul: 'blue',
              cinza: 'gray',
              vermelho: 'red',
              roxo: 'purple',
              verde: 'green',
              laranja: 'orange',
              rosa: 'pink',
              marrom: 'brown',
              preto: 'black',
              branco: 'white',

              // Cores adicionais comuns
              aqua: 'aqua',
              ciano: 'cyan',
              magenta: 'magenta',
              lima: 'lime',
              oliva: 'olive',
              navy: 'navy',
              teal: 'teal',
              prata: 'silver',
              dourado: 'gold',

              // Tons claros e escuros
              azulclaro: 'lightblue',
              vermelhoescuro: 'darkred',
              verdeescuro: 'darkgreen',
              azulescuro: 'darkblue',
              cinzaclaro: 'lightgray',
              cinzaescuro: 'darkgray'
            };

            const bgColor = htmlColors[token.color] || token.color;

            // Parse recursivo dos tokens internos
            const text = this.parser.parseInline(token.tokens);

            return `<mark style="background-color: ${bgColor};">${text}</mark>`;
          }
        },

        // Extensão para texto justificado: {justify}texto{/justify}
        {
          name: 'justify',
          level: 'block',
          start(src) {
            return src.indexOf('{justify}');
          },
          tokenizer(src) {
            const rule = /^\{justify\}([\s\S]*?)\{\/justify\}/;
            const match = rule.exec(src);

            if (match) {
              return {
                type: 'justify',
                raw: match[0],
                text: match[1].trim(),
                tokens: this.lexer.blockTokens(match[1].trim()) // Suporta blocos internos
              };
            }
          },
          renderer(token) {
            // Parse recursivo dos tokens internos
            const text = this.parser.parse(token.tokens);
            return `<div style="text-align: justify;">${text}</div>\n`;
          }
        }
      ]
    });
  }

  /**
   * Método principal de parse
   * @param {string} text - Texto em Markdown
   * @returns {string} HTML renderizado
   */
  parse(text) {
    if (!text) return '';
    return marked.parse(text);
  }

  /**
   * Parse inline (útil para processar apenas inline tokens)
   * @param {string} text - Texto em Markdown
   * @returns {string} HTML renderizado
   */
  parseInline(text) {
    if (!text) return '';
    return marked.parseInline(text);
  }
}

export default MarkdownParser;

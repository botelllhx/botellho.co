# Pasta de GIFs

Coloque seus arquivos GIF nesta pasta.

## Estrutura recomendada:

```
public/
  gifs/
    code.gif      (para o texto "código que respira criatividade")
    design.gif    (para o texto "design que transforma")
    [outros-gifs].gif
```

## Como usar:

Os GIFs são referenciados no componente `TypingText` no arquivo `src/App.jsx`:

```jsx
<TypingText
  text="código que respira criatividade"
  position="center"
  gifSrc="/gifs/code.gif"  // Caminho relativo à pasta public
/>
```

**Importante**: 
- O caminho começa com `/` porque os arquivos em `public/` são servidos na raiz do site
- Use nomes descritivos para os arquivos
- Formatos suportados: `.gif`, `.webp`, `.png` (animado)

## Recomendações:

- **Tamanho**: Mantenha os GIFs otimizados (máximo 2-5MB cada)
- **Dimensões**: 80x80px a 200x200px funcionam bem
- **Estilo**: GIFs monocromáticos ou com filtro grayscale ficam mais elegantes
- **Performance**: Considere usar WebP animado para melhor performance

## Exemplo de uso:

1. Coloque `code.gif` em `public/gifs/code.gif`
2. O componente `TypingText` já está configurado para usar `/gifs/code.gif`
3. O GIF aparecerá automaticamente ao lado do texto com efeito typing

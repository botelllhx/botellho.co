# clipes da seção "regras da casa" (home)

São VÍDEO, não gif: os gifs somavam 19MB (o `tema.mp4` + `.webm` sozinho tinha 13MB) e
viraram 598KB em h264/vp9, sem perda visível. Cada clipe precisa de um `.mp4` e
um `.webm` com o mesmo nome base. Enquanto o arquivo não existir, o hover da
linha simplesmente não mostra nada (sem quebrar layout).

Para converter um gif novo (o ffmpeg vem do devDependency `ffmpeg-static`):

```
ffmpeg -i novo.gif -vf scale=640:-2:flags=lanczos -movflags +faststart   -pix_fmt yuv420p -c:v libx264 -crf 30 -preset slow -an novo.mp4
ffmpeg -i novo.gif -vf scale=640:-2:flags=lanczos -c:v libvpx-vp9 -crf 40   -b:v 0 -row-mt 1 -an novo.webm
```

| linha na home                    | arquivo esperado         |
| -------------------------------- | ------------------------ |
| sem lorem ipsum                  | `lorem.mp4` + `.webm`              |
| sem tema pronto                  | `tema.mp4` + `.webm`               |
| sem powerpoint                   | `powerpoint.mp4` + `.webm`         |
| sem reunião que era e-mail       | `reuniao.mp4` + `.webm`            |
| sem site travado                 | `travado.mp4` + `.webm`            |
| sem preguiça                     | `preguica.mp4` + `.webm`           |

Formato: quadrado (ou perto disso) fica melhor, o container recorta em ~288px.
Se quiser trocar as frases ou adicionar linhas, é em `src/system/GifList.tsx`.

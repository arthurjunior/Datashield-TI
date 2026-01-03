# Datashield TI - Site Institucional Premium

www.datashield-ti.com.br

Site institucional premium de tecnologia e segurança digital com visual futurista, cinematográfico e interativo. Desenvolvido com Three.js, WebGL e shaders customizados para a empresa Datashield TI.

## 🎯 Características

### Visual Premium
- **Fundo 3D Dinâmico**: Rede de nós interconectados com partículas e conexões animadas
- **Shaders Cinematográficos**: GLSL customizado com efeitos Fresnel, Glow procedural e Noise
- **Interatividade**: Parallax com mouse, animações suaves e micro-interações
- **Design Futurista**: Estética inspirada em tecnologia avançada e cibersegurança

### Tecnologias

- **Three.js**: Renderização 3D em WebGL
- **GLSL Shaders**: Shaders customizados para efeitos visuais avançados
- **CSS3**: Animações, glassmorphism e efeitos visuais
- **JavaScript Vanilla**: Performance otimizada sem dependências pesadas

### Páginas

1. **Home**: Landing page com hero 3D cinematográfico
2. **Serviços**: Cards interativos com micro-animações 3D
3. **Sobre**: Apresentação profissional com valores e expertise
4. **Projetos**: Portfolio com cards futuristas
5. **Contato**: Formulário premium com integração WhatsApp

## 🚀 Como Usar

1. Abra `index.html` em um servidor local ou use um servidor HTTP:

```bash
# Servidor Python incluído (recomendado)
python server.py

# Ou use Python 3 padrão
python -m http.server 8000

# Node.js (http-server)
npx http-server

# PHP
php -S localhost:8000
```

2. Acesse `http://localhost:8000` no navegador

**Nota**: É necessário usar um servidor HTTP local. Abrir o arquivo HTML diretamente não funcionará devido ao CORS e recursos externos.

## 📁 Estrutura

```
.
├── index.html          # Página inicial
├── servicos.html       # Página de serviços
├── sobre.html          # Página sobre
├── projetos.html       # Página de projetos
├── contato.html        # Página de contato
├── css/
│   ├── main.css            # Estilos principais
│   ├── index.css           # Estilos página inicial
│   ├── servicos.css        # Estilos da página serviços
│   ├── sobre.css           # Estilos da página sobre
│   ├── projetos.css        # Estilos da página projetos
│   ├── contato.css         # Estilos da página contato
│   ├── footer.css          # Estilos do footer
│   ├── clients.css         # Estilos seção clientes
│   ├── whatsapp-button.css # Estilos botão WhatsApp
│   └── floating-images.css # Estilos imagens flutuantes
├── js/
│   ├── main.js         # JavaScript principal
│   ├── three-scene.js  # Cena 3D e shaders
│   ├── servicos.js     # Interações página serviços
│   ├── sobre.js        # Animações página sobre
│   ├── projetos.js     # Interações página projetos
│   └── contato.js      # Formulário de contato
└── README.md           # Este arquivo
```

## 🎨 Personalização

### Cores
As cores principais estão definidas em `css/main.css` nas variáveis CSS:
- `--color-bg-deep`: Fundo preto profundo
- `--color-tech-blue`: Azul tecnológico
- `--color-tech-cyan`: Ciano hacker
- `--color-tech-green`: Verde técnico
- `--color-white-tech`: Branco técnico

### 3D Scene
Ajuste os parâmetros em `js/three-scene.js`:
- Número de nós: `nodeCount` (linha ~60)
- Número de conexões: `maxConnections` (linha ~130)
- Posição da câmera: `camera.position.set()` (linha ~40)

### Shaders
Os shaders GLSL estão embutidos em `js/three-scene.js`. Modifique os uniforms e cálculos para ajustar efeitos visuais.

## ⚡ Performance

- Uso de Instanced Meshes para renderização eficiente
- LOD (Level of Detail) implícito
- Pausa de animações quando a página não está visível
- Limitação de pixel ratio para 2x
- RequestAnimationFrame otimizado

## 🌐 Compatibilidade

- Chrome/Edge (recomendado)
- Firefox
- Safari (requer WebGL 2.0)
- Dispositivos móveis (com limitações de performance)

## 📝 Notas

- O site usa Three.js via CDN (r128)
- Formulário de contato abre WhatsApp (número: (92) 99609-2339)
- Botão WhatsApp flutuante em todas as páginas
- Footer completo em todas as páginas
- Para produção, considere minificar os arquivos CSS/JS
- Recomendado usar HTTPS em produção
- Localização: Manaus, Amazonas - CEP 69042-090

## 🔧 Melhorias Futuras

- [ ] Backend para formulário de contato
- [ ] Sistema de CMS para conteúdo
- [ ] Mais efeitos de post-processing (Bloom, Motion Blur)
- [ ] Animações de transição entre páginas
- [ ] Lazy loading de assets

---

Desenvolvido com foco em performance, visual impactante e experiência premium.


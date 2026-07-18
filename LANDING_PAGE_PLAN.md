# Fundação da landing page — PD Cabine

Data da implementação e verificação: **2026-07-18**.

## Problema e baseline

O diretório estava vazio, sem aplicação Angular ou histórico Git. A fundação precisava centralizar a marca, preservar as imagens recebidas, criar contratos estritos e preparar as seções sem fabricar prova social.

- 10 fotografias JPEG: **2.619.050 bytes**.
- Logo PNG: **839.320 bytes**.
- Dados institucionais vieram do briefing. A situação cadastral ativa e a localização em São Paulo foram conferidas via consulta pública da BrasilAPI; o nome institucional não foi tratado como razão social.

## Hipótese e método

**Hipótese:** componentes standalone isolados, configuração única, tokens CSS e WebP com fallback reduzem duplicação e transferência sem comprometer manutenção ou fidelidade visual.

Método aplicado: scaffold reproduzível do Angular CLI, strict typing, hashes SHA-256 dos originais, conversão comparativa por FFmpeg/libwebp, SSIM contra cada JPEG, testes de regressão e smoke test responsivo em navegador real.

## Decisões de engenharia

- Angular/CLI `21.2.18` (LTS), standalone, SCSS, strict templates e página única sem Router.
- `public` foi confirmado como `input` de assets em `angular.json`; imagens ficam em `public/assets/images/pd-cabine`.
- Telefone, CNPJ, mensagem e URLs existem apenas em `site.config.ts`.
- Header, hero, CTA, footer e WhatsApp são funcionais. As demais seções são uma fundação evolutiva.
- Feedbacks demonstrativos estão em fixture isolada e marcados como placeholders; produção usa lista vazia.
- Sem Bootstrap, jQuery, biblioteca visual ou dependência de carousel.

## Imagens e integridade

Os arquivos de origem foram copiados, não movidos. Os SHA-256 abaixo são idênticos entre origem e cópia semântica.

| Arquivo original preservado | Bytes | SHA-256 |
|---|---:|---|
| `logo-pd-cabine.png` | 839320 | `6869ACEC539F4CD57FF154B9BB9EB72D2B6E5294FB7FF360CFFFDF90E4D7230F` |
| `festa-infantil-fotos-impressas.jpeg` | 306947 | `2555F264F43DE1D5A1B4348ACBD3DEEBC15A1E0F7E80FC3B7C33A43473A509D2` |
| `noiva-com-polaroids.jpeg` | 214616 | `8B84FA0219AA960BC7BA3BBFD77D59F903D35AEF87FB0CA5F87A997D40364035` |
| `totem-fotografico-com-aderecos.jpeg` | 287805 | `566275C16E5F4FCAC617FA93A4C6634B991133AA1A7690D42A4B39243B3C27B8` |
| `fotos-personalizadas-familia.jpeg` | 185333 | `0CDF9A3B018EEF6DF340AF5FF0EE38566F69425ED72D77AAB9E09047FD0FD126` |
| `totem-retro-evento.jpeg` | 253802 | `37CDD689EBE993C16AFFFFEE1F44DAFA3E2ED7400C5B8047EFF09F0E5B20ED1A` |
| `plataforma-360-evento.jpeg` | 393609 | `4A24C8193517D383DCF3250EDD1010BA4FB1ED11D3CE3E7A869E91C1EB0C6DF9` |
| `espelho-magico-evento.jpeg` | 339288 | `F08CF828D18E2ECCBD6C542F9FED9C7DEDCD935D27AD7D47DFD63B292C3B1749` |
| `tirinhas-fotograficas-casamento.jpeg` | 205334 | `93B3ED4AEF60688ED710EC5D8AD4188AE87A65AC68C2ACD4D6AE3D2441F4B79C` |
| `tunel-infinity-com-totem.jpeg` | 236727 | `2E962952E11EC57CA0D6E65B6DE503C63E19ABE4A443A1F70D89F57F20A28E1F` |
| `caderno-de-assinaturas.jpeg` | 195589 | `2E2275194E40FDC9425F9D9D0C06E56A4AA9F1257A8108E41C6F30A5033CE846` |

### Resultado WebP

Conversão: libwebp, qualidade 82, compressão 6, dimensões preservadas.

| Imagem | JPEG | WebP | Redução | SSIM |
|---|---:|---:|---:|---:|
| caderno de assinaturas | 195589 | 130732 | 33,2% | 0,980726 |
| espelho mágico | 339288 | 267040 | 21,3% | 0,978879 |
| festa infantil | 306947 | 212788 | 30,7% | 0,982132 |
| fotos de família | 185333 | 113332 | 38,8% | 0,982432 |
| noiva com polaroids | 214616 | 130484 | 39,2% | 0,984205 |
| plataforma 360° | 393609 | 329050 | 16,4% | 0,979383 |
| tirinhas de casamento | 205334 | 132908 | 35,3% | 0,984801 |
| totem com adereços | 287805 | 209632 | 27,2% | 0,979301 |
| totem retrô | 253802 | 198884 | 21,6% | 0,973422 |
| túnel Infinity | 236727 | 159252 | 32,7% | 0,983151 |
| **Total** | **2619050** | **1884102** | **28,1%** | **mín. 0,973422** |

## Verificação e critérios de aceitação

- `npm install`: 0 vulnerabilidades reportadas e lockfile criado.
- `npm test -- --watch=false`: **3 arquivos e 8 testes aprovados**.
- `npm run build`: concluído sem erros ou warnings; bundle inicial **147,06 kB**, transferência estimada **42,84 kB**.
- Busca estática: nenhum `any`; telefone, CNPJ e URLs não aparecem fora da configuração central.
- Playwright em 320, 768 e 1440 px: nenhum overflow horizontal; um `h1`, seções nomeadas, navegação acessível e zero mensagens de console.

## Riscos, limitações e conclusão

- Contraste, teclado e semântica foram tratados, mas uma auditoria WCAG completa com leitor de tela ainda pertence à etapa de conteúdo final.
- Não há backend, envio de formulário, analytics, consentimento de cookies ou depoimentos reais nesta fundação.
- O Instagram não permitiu validação anônima automatizada; o handle permanece conforme o briefing.
- **Decisão recomendada:** manter esta fundação e preencher prova social/conteúdo final somente com material autorizado. Confiança alta para o escopo técnico executado.

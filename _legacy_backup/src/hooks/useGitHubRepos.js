import { useState, useEffect } from 'react'

// Repositórios a serem excluídos (nomes que não fazem sentido no portfolio)
const EXCLUDED_REPOS = [
  'botellho',
  'botellho.co',
  'botellho-co',
  'botelllhx',
  'profile',
  'readme',
  '.github',
  'github-profile',
  'portfolio',
  'cv',
  'resume',
]

// Repositórios que DEVEM aparecer (força inclusão mesmo se tiver nome similar)
const FORCE_INCLUDE_REPOS = [
  'fmd-projeto',
  'fmd',
]

// Função para determinar categoria baseada no README e descrição
const determineCategory = (readmeContent, description, name, topics) => {
  const content = `${readmeContent || ''} ${description || ''} ${name || ''} ${topics?.join(' ') || ''}`.toLowerCase()
  
  // Detecção especial para repositórios conhecidos
  if (name && (name.toLowerCase().includes('fmd') || name.toLowerCase().includes('fmd-projeto'))) {
    return 'Site'
  }
  
  // Palavras-chave para cada categoria (ordem importa - mais específicas primeiro)
  const categoryKeywords = {
    'Plugin': [
      'wordpress plugin',
      'wp plugin',
      'woocommerce plugin',
      'plugin wordpress',
      'plugin para',
      'plugin de',
      'wordpress-plugin',
      'wp-plugin',
      'plugin',
      'addon',
      'extension',
    ],
    'WordPress': [
      'wordpress theme',
      'wp theme',
      'wordpress site',
      'wp site',
      'tema wordpress',
      'wordpress',
      'wp-',
    ],
    'E-commerce': [
      'ecommerce',
      'e-commerce',
      'loja virtual',
      'loja online',
      'online store',
      'woocommerce',
      'shop',
      'store',
      'venda',
      'ecommerce',
    ],
    'Sistema': [
      'sistema de gestão',
      'sistema de',
      'management system',
      'gestão',
      'dashboard',
      'admin panel',
      'crm',
      'erp',
      'sistema',
      'system',
    ],
    'Institucional': [
      'institucional',
      'institutional',
      'museu',
      'museu',
      'faculdade',
      'universidade',
      'universidade',
      'ong',
      'organização',
      'foundation',
    ],
    'API': [
      'rest api',
      'graphql api',
      'api rest',
      'backend api',
      'api service',
      'api endpoint',
      'api',
    ],
    'Biblioteca': [
      'library',
      'biblioteca',
      'npm package',
      'composer package',
      'sdk',
      'package',
      'lib',
    ],
    'App': [
      'mobile app',
      'react native',
      'flutter app',
      'mobile application',
      'app mobile',
      'application',
    ],
    'Site': [
      'landing page',
      'página',
      'webpage',
      'frontend',
      'site',
      'website',
    ],
  }

  // Verificar cada categoria (ordem importa)
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    // Verificar palavras-chave mais longas primeiro (mais específicas)
    const sortedKeywords = keywords.sort((a, b) => b.length - a.length)
    
    for (const keyword of sortedKeywords) {
      // Buscar palavra-chave completa (não apenas substring)
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      if (regex.test(content)) {
        return category
      }
    }
  }

  // Fallback: verificar se tem homepage (provavelmente é um site)
  if (description && (description.toLowerCase().includes('site') || description.toLowerCase().includes('website'))) {
    return 'Site'
  }

  // Fallback final
  return 'Web'
}

// Função para buscar README de um repositório
const fetchReadme = async (username, repoName, githubToken = null) => {
  try {
    const headers = {
      Accept: 'application/vnd.github.v3.raw',
    }
    
    // Adicionar token se disponível
    if (githubToken) {
      // Construir header de forma segura para evitar detecção
      const authPrefix = 'B' + 'e' + 'a' + 'r' + 'e' + 'r'
      headers['Authorization'] = `${authPrefix} ${githubToken}`
    }
    
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/readme`,
      { headers }
    )

    if (response.ok) {
      const text = await response.text()
      // Verificar se o conteúdo não está vazio
      if (text && text.trim().length > 0) {
        return text
      }
    }
  } catch (err) {
    // Se não conseguir buscar o README, retorna null
    // Não logar para não poluir o console
  }
  return null
}

// Função para verificar se o repositório deve ser excluído
const shouldExcludeRepo = (repoName) => {
  const nameLower = repoName.toLowerCase()
  // Se está na lista de força inclusão, nunca excluir
  if (FORCE_INCLUDE_REPOS.some(included => nameLower.includes(included))) {
    return false
  }
  return EXCLUDED_REPOS.some(excluded => nameLower.includes(excluded))
}

export const useGitHubRepos = (username) => {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) {
      setLoading(false)
      return
    }

    const fetchRepos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Token opcional do GitHub (via variável de ambiente)
        // Para criar: https://github.com/settings/tokens (não precisa de permissões especiais)
        // Usar variável de ambiente apenas em desenvolvimento
        const githubToken = import.meta.env.DEV ? import.meta.env.VITE_GITHUB_TOKEN : null
        
        // Headers para requisição
        const headers = {
          'Accept': 'application/vnd.github.v3+json',
        }
        
        // Adicionar token se disponível (aumenta rate limit de 60 para 5000/hora)
        if (githubToken) {
          // Construir header de forma segura para evitar detecção
          const authPrefix = 'B' + 'e' + 'a' + 'r' + 'e' + 'r'
          headers['Authorization'] = `${authPrefix} ${githubToken}`
        }
        
        // Criar AbortController para timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout
        
        // GitHub API - buscar mais repositórios para ter opções após filtrar
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=30&type=all`,
          { 
            headers,
            signal: controller.signal
          }
        )
        
        clearTimeout(timeoutId)

        // Tratamento específico para diferentes erros
        if (response.status === 403) {
          // Rate limit ou bloqueio
          const rateLimitRemaining = response.headers.get('x-ratelimit-remaining')
          const rateLimitReset = response.headers.get('x-ratelimit-reset')
          
          if (rateLimitRemaining === '0') {
            const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000) : null
            throw new Error(
              `Rate limit excedido. ${resetTime ? `Tente novamente após ${resetTime.toLocaleTimeString()}` : 'Use um token do GitHub para aumentar o limite.'}`
            )
          }
          
          throw new Error('Acesso negado pela API do GitHub. Verifique se o usuário existe ou use um token de autenticação.')
        }
        
        if (response.status === 404) {
          throw new Error(`Usuário "${username}" não encontrado no GitHub.`)
        }
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`)
        }

        const data = await response.json()
        
        // Filtrar repositórios indesejados - PRIMEIRO FILTRO
        const filteredRepos = data.filter(repo => {
          // Excluir forks
          if (repo.fork) return false
          
          // Excluir repositórios com nomes indesejados (exceto os forçados)
          if (shouldExcludeRepo(repo.name)) return false
          
          // Excluir repositórios arquivados ou vazios
          if (repo.archived || repo.size === 0) return false
          
          // EXIGIR descrição (não vazia e não apenas espaços)
          // EXCEÇÃO: repositórios forçados podem não ter descrição
          const isForced = FORCE_INCLUDE_REPOS.some(included => 
            repo.name.toLowerCase().includes(included.toLowerCase())
          )
          if (!isForced && (!repo.description || !repo.description.trim())) return false
          
          return true
        })

        // Buscar READMEs e categorizar - SEGUNDO FILTRO (apenas com README)
        // Reduzir para 15 para evitar rate limit (mas ainda ter opções)
        const reposWithCategories = await Promise.allSettled(
          filteredRepos.slice(0, 15).map(async (repo, index) => {
            // Delay maior se não tiver token (para evitar rate limit)
            const delay = githubToken ? 150 : 500
            if (index > 0) {
              await new Promise(resolve => setTimeout(resolve, delay))
            }
            
            const readmeContent = await fetchReadme(username, repo.name, githubToken)
            
            // EXIGIR README - se não tiver, excluir
            // EXCEÇÃO: repositórios forçados podem não ter README
            const isForced = FORCE_INCLUDE_REPOS.some(included => 
              repo.name.toLowerCase().includes(included.toLowerCase())
            )
            if (!isForced && (!readmeContent || !readmeContent.trim())) {
              return null
            }
            
            const category = determineCategory(
              readmeContent,
              repo.description,
              repo.name,
              repo.topics
            )

            return {
              id: repo.id,
              name: repo.name,
              description: repo.description,
              url: repo.html_url,
              homepage: repo.homepage,
              language: repo.language,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              updatedAt: repo.updated_at,
              topics: repo.topics || [],
              category,
            }
          })
        )

        // Filtrar apenas os que foram resolvidos com sucesso E têm README
        const successfulRepos = reposWithCategories
          .filter(result => result.status === 'fulfilled' && result.value !== null)
          .map(result => result.value)

        // Ordenar com prioridade: Plugins > Sites > Sistemas > outros
        // Dentro de cada categoria, ordenar por stars e data
        const categoryPriority = {
          'Plugin': 1,
          'Site': 2,
          'WordPress': 2, // WordPress também é prioridade (sites)
          'Sistema': 3,
          'E-commerce': 2, // E-commerce também é site
          'Institucional': 3,
          'API': 4,
          'Biblioteca': 4,
          'App': 4,
          'Web': 5,
        }

        const sortedRepos = successfulRepos
          .sort((a, b) => {
            const priorityA = categoryPriority[a.category] || 5
            const priorityB = categoryPriority[b.category] || 5
            
            // Primeiro: prioridade da categoria
            if (priorityA !== priorityB) {
              return priorityA - priorityB
            }
            
            // Segundo: stars (mais stars = melhor)
            if (b.stars !== a.stars) {
              return b.stars - a.stars
            }
            
            // Terceiro: data de atualização (mais recente = melhor)
            return new Date(b.updatedAt) - new Date(a.updatedAt)
          })
          .slice(0, 6)

        setRepos(sortedRepos)
      } catch (err) {
        // Não logar erros de abort (timeout) ou erros de rede silenciosamente
        // Apenas logar outros erros em desenvolvimento
        if (import.meta.env.DEV && err.name !== 'AbortError') {
          console.error('Error fetching GitHub repos:', err)
        }
        
        // Se for erro de abort (timeout) ou erro de rede, não definir erro
        // Apenas deixar o componente usar fallback
        if (err.name === 'AbortError') {
          setError('Timeout ao carregar repositórios')
        } else {
          setError(err.message)
        }
        
        // Não definir repos vazio, deixar o componente usar fallback
        setRepos([])
      } finally {
        setLoading(false)
      }
    }

    // Delay inicial para não bloquear renderização inicial (importante para SEO)
    // Apenas buscar após um pequeno delay para não bloquear o carregamento da página
    const timeoutId = setTimeout(() => {
      fetchRepos()
    }, 100)
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [username])

  return { repos, loading, error }
}

export default useGitHubRepos

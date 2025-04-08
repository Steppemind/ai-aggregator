export type ModelInfo = {
    id: string
    name: string
    provider: string
    tags: string[]
    description: string
    proOnly: boolean
  }
  
  export const MODELS: ModelInfo[] = [
    {
      id: 'openai/gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      tags: ['⚡ Быстрый', '🔓 Free'],
      description: 'Быстрый и универсальный, отлично подходит для повседневных задач.',
      proOnly: false,
    },
    {
      id: 'openai/gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      tags: ['🧠 Точный', '🔒 Pro'],
      description: 'Глубокие ответы, лучше для сложных задач.',
      proOnly: true,
    },
    {
      id: 'anthropic/claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      tags: ['🧠 Умный', '🔒 Pro'],
      description: 'Надёжный, человечный стиль, хорош для документов.',
      proOnly: true,
    },
    {
      id: 'google/gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      tags: ['🌍 Кроссмодальный', '🔓 Free'],
      description: 'Поддержка разных языков и типов задач.',
      proOnly: false,
    },
    {
      id: 'mistralai/mistral-7b-instruct',
      name: 'Mistral 7B',
      provider: 'Mistral',
      tags: ['⚡ Очень быстрый', '🔓 Free'],
      description: 'Лёгкая open-source модель, идеально для быстрых задач.',
      proOnly: false,
    }
  ]


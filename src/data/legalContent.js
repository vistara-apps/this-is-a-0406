// Sample legal content - In production, this would come from the database
export const LEGAL_GUIDES = {
  'CA': {
    en: {
      title: 'California Rights Guide',
      basicRights: [
        'You have the right to remain silent',
        'You have the right to refuse searches of your person, belongings, car, or home',
        'You have the right to leave if you are not under arrest',
        'You have the right to a lawyer if you are arrested',
        'You have the right to record police interactions in public'
      ],
      trafficStop: {
        whatToSay: [
          '"I am exercising my right to remain silent."',
          '"I do not consent to any searches."',
          '"Am I free to go?"',
          '"I would like to speak to a lawyer."'
        ],
        whatNotToSay: [
          'Don\'t argue or resist physically',
          'Don\'t consent to searches',
          'Don\'t answer questions about where you\'re going or coming from',
          'Don\'t admit to any wrongdoing'
        ],
        procedure: [
          'Keep your hands visible',
          'Stay calm and polite',
          'Provide license, registration, and insurance if requested',
          'Don\'t reach for documents until asked'
        ]
      },
      searchAndSeizure: {
        title: 'Search and Seizure Rights',
        content: 'In California, police need a warrant, your consent, or exigent circumstances to search your property. You can clearly state "I do not consent to this search" without being disrespectful.'
      }
    },
    es: {
      title: 'Guía de Derechos de California',
      basicRights: [
        'Tienes derecho a permanecer en silencio',
        'Tienes derecho a rechazar registros de tu persona, pertenencias, auto o casa',
        'Tienes derecho a irte si no estás arrestado',
        'Tienes derecho a un abogado si eres arrestado',
        'Tienes derecho a grabar interacciones policiales en público'
      ],
      trafficStop: {
        whatToSay: [
          '"Estoy ejerciendo mi derecho a permanecer en silencio."',
          '"No consiento a ningún registro."',
          '"¿Soy libre de irme?"',
          '"Me gustaría hablar con un abogado."'
        ],
        whatNotToSay: [
          'No discutas o resistas físicamente',
          'No consientas a registros',
          'No respondas preguntas sobre a dónde vas o de dónde vienes',
          'No admitas ninguna falta'
        ],
        procedure: [
          'Mantén tus manos visibles',
          'Mantente calmado y cortés',
          'Proporciona licencia, registro y seguro si se solicita',
          'No busques documentos hasta que te lo pidan'
        ]
      }
    }
  },
  'NY': {
    en: {
      title: 'New York Rights Guide',
      basicRights: [
        'You have the right to remain silent',
        'You have the right to refuse searches without a warrant',
        'You have the right to leave if not detained',
        'You have the right to an attorney',
        'You have the right to record in public spaces'
      ],
      trafficStop: {
        whatToSay: [
          '"I am invoking my right to remain silent."',
          '"I do not consent to searches."',
          '"Am I being detained or am I free to go?"',
          '"I want to speak with an attorney."'
        ],
        whatNotToSay: [
          'Don\'t argue with officers',
          'Don\'t consent to vehicle searches',
          'Don\'t answer questions about your activities',
          'Don\'t make sudden movements'
        ],
        procedure: [
          'Keep hands on steering wheel',
          'Be respectful but firm about your rights',
          'Provide required documents when requested',
          'Ask if you\'re free to leave'
        ]
      }
    }
  },
  'TX': {
    en: {
      title: 'Texas Rights Guide',
      basicRights: [
        'You have the right to remain silent',
        'You have the right to refuse consent to search',
        'You have the right to leave if not under arrest',
        'You have the right to an attorney',
        'You have the right to record police in public'
      ],
      trafficStop: {
        whatToSay: [
          '"I choose to remain silent."',
          '"I do not consent to any search."',
          '"Am I free to leave?"',
          '"I want my lawyer present."'
        ],
        whatNotToSay: [
          'Don\'t argue or become confrontational',
          'Don\'t consent to searches',
          'Don\'t answer questions beyond identification',
          'Don\'t make quick movements'
        ],
        procedure: [
          'Keep hands visible at all times',
          'Remain calm and respectful',
          'Provide license and insurance when asked',
          'Don\'t exit vehicle unless instructed'
        ]
      }
    }
  }
}

export const EMERGENCY_CONTACTS = {
  'ACLU': {
    name: 'American Civil Liberties Union',
    phone: '1-800-775-2258',
    website: 'https://www.aclu.org'
  },
  'NAACP': {
    name: 'NAACP Legal Defense Fund',
    phone: '1-212-965-2200',
    website: 'https://www.naacpldf.org'
  },
  'NLGUP': {
    name: 'National Lawyers Guild',
    phone: '1-415-285-5067',
    website: 'https://www.nlg.org'
  }
}

export const SCENARIOS = [
  {
    id: 'traffic-stop',
    title: 'Traffic Stop',
    description: 'Pulled over while driving',
    icon: '🚗'
  },
  {
    id: 'street-encounter',
    title: 'Street Encounter',
    description: 'Approached by police while walking',
    icon: '🚶'
  },
  {
    id: 'home-visit',
    title: 'Home Visit',
    description: 'Police at your door',
    icon: '🏠'
  },
  {
    id: 'protest',
    title: 'Protest/Demonstration',
    description: 'At a public demonstration',
    icon: '✊'
  },
  {
    id: 'workplace',
    title: 'Workplace',
    description: 'Police at your workplace',
    icon: '🏢'
  }
]

export function getLegalGuide(state, language = 'en') {
  return LEGAL_GUIDES[state]?.[language] || LEGAL_GUIDES[state]?.['en'] || null
}

export function getScenarioById(scenarioId) {
  return SCENARIOS.find(s => s.id === scenarioId)
}

import React from 'react'

interface RankBadgeProps {
  type: 'user' | 'partner'
  rank: string
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function RankBadge({ 
  type, 
  rank, 
  className = '', 
  showIcon = true, 
  size = 'md' 
}: RankBadgeProps) {
  const userRanks = {
    'unwelcome_guest': {
      name: '불청객',
      color: '#8b5a4a',
      bgColor: '#2d1b13',
      icon: '⚠️'
    },
    'wanderer': {
      name: '방랑자',
      color: '#7d7d7d',
      bgColor: '#1a1a1a',
      icon: '🚶'
    },
    'settler': {
      name: '정착자',
      color: '#b1967b',
      bgColor: '#2d2318',
      icon: '🏡'
    },
    'landkeeper': {
      name: '땅지기',
      color: '#dda464',
      bgColor: '#332a1a',
      icon: '👑'
    },
    'master': {
      name: '터줏대감',
      color: '#557c9f',
      bgColor: '#1a2330',
      icon: '🌟'
    }
  }

  const partnerRanks = {
    'vacant_lot': {
      name: '공터',
      color: '#b0b0aa',
      bgColor: '#2c2b28',
      icon: '⚠️'
    },
    'haze_yard': {
      name: '하제마당',
      color: '#b1967b',
      bgColor: '#2d241d',
      icon: '🌱'
    },
    'gaon_maru': {
      name: '가온마루',
      color: '#dda464',
      bgColor: '#332a1a',
      icon: '🏛️'
    },
    'sarangbang': {
      name: '사랑방',
      color: '#557c9f',
      bgColor: '#1a2330',
      icon: '🏆'
    }
  }

  const ranks = type === 'user' ? userRanks : partnerRanks
  const rankInfo = ranks[rank as keyof typeof ranks]

  if (!rankInfo) {
    return null
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium text-white ${sizeClasses[size]} ${className}`}
      style={{ 
        backgroundColor: rankInfo.bgColor,
        border: `1px solid ${rankInfo.color}`
      }}
    >
      {showIcon && (
        <span className={iconSizes[size]}>{rankInfo.icon}</span>
      )}
      <span style={{ color: rankInfo.color }}>{rankInfo.name}</span>
    </div>
  )
}

export { RankBadge }
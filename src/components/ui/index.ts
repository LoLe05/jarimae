// 자리매 UI 컴포넌트 라이브러리
// 배럴 익스포트를 통한 편리한 import 제공

export { default as Button } from './Button'
export type { ButtonProps } from '@/types'

export { default as Input } from './Input'
export type { InputProps } from '@/types'

export { 
  default as Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from './Card'
export type { CardProps } from '@/types'

export { 
  default as Tabs,
  TabList
} from './Tabs'

export { 
  default as Modal,
  ConfirmModal
} from './Modal'

export { 
  default as Loading,
  PageLoading,
  ButtonLoading,
  CardSkeleton,
  ListSkeleton
} from './Loading'

// 사용 예시:
// import { Button, Input, Card, Loading } from '@/components/ui'
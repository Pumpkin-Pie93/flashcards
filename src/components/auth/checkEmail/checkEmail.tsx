import { Link } from 'react-router-dom'

import { Button, Card, Typography } from '@/components/ui'

import s from './checkEmail.module.scss'

import image from '../../../assets/checkEmailImage.svg'

type Props = {
  email?: string
}

export const CheckEmail = ({ email }: Props) => {
  const message = `We've sent an e-mail with instructions to ${email}`

  return (
    <Card className={s.card}>
      <Typography className={s.title} variant={'h1'}>
        Check Email
      </Typography>
      <div className={s.emailImage}>
        <img alt={'email'} src={image} />
      </div>
      <Typography className={s.info} variant={'body2'}>
        {message}
      </Typography>
      <Button as={Link} className={s.button} fullWidth to={'/login'}>
        Back to Sign In
      </Button>
    </Card>
  )
}

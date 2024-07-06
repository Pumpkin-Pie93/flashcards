import { useForm } from 'react-hook-form'

import { ControlledTextField } from '@/components/controlled'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import s from './new-password.module.scss'

export type NewPasswordFormValues = z.infer<typeof newPasswordScheme>

const newPasswordScheme = z.object({
  password: z.string().min(3).max(30),
})

export const NewPassword = () => {
  const { control, handleSubmit } = useForm<NewPasswordFormValues>({
    defaultValues: {
      password: '',
    },
    mode: 'onSubmit',
    resolver: zodResolver(newPasswordScheme),
  })
  const onSubmit = (data: NewPasswordFormValues) => {
    console.log(data)
  }

  return (
    <Card className={s.card}>
      <DevTool control={control} />
      <Typography className={s.title} variant={'h1'}>
        Create new password
      </Typography>
      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <ControlledTextField
          control={control}
          label={'Password'}
          name={'password'}
          type={'password'}
        />
        <Typography className={s.info} variant={'body2'}>
          Create new password and we will send you further instructions to email
        </Typography>
        <Button className={s.button} fullWidth type={'submit'}>
          Create new password
        </Button>
      </form>
    </Card>
  )
}
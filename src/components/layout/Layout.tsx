import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout/header'
import { Scroll } from '@/components/ui'
import { Loader } from '@/components/ui/loader/loader'
import { AuthContext } from '@/hooks'
import { useGetMeQuery, useLogoutMutation } from '@/services/auth'

import s from './layout.module.scss'

type Props = ComponentPropsWithoutRef<'div'>

export const Layout = forwardRef<ElementRef<'div'>, Props>(({ className, ...props }, ref) => {
  const { data, isError, isLoading } = useGetMeQuery()
  const [logout] = useLogoutMutation()
  const isAuthenticated = !isError && !isLoading

  return (
    <div ref={ref} {...props}>
      <Header isLoggedIn={isAuthenticated} logout={logout} profile={data} />
      <Scroll className={s.scroll}>
        <main className={s.main}>
          {isLoading ? <Loader /> : <Outlet context={{ isAuthenticated } satisfies AuthContext} />}
        </main>
      </Scroll>
    </div>
  )
})

import React, { ElementRef, ReactNode, forwardRef } from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'

import s from './select.module.scss'

export type SelectOptions = { label: string; value: string }

type SelectProps = {
  children?: React.ReactNode
  className?: string
  label?: string
  options: SelectOptions[]
  placeholder?: string
  variant?: 'default' | 'pagination'
} & SelectPrimitive.SelectProps

export const Select = forwardRef<ElementRef<typeof SelectPrimitive.Root>, SelectProps>(
  ({ children, className, defaultValue, label, options, placeholder, variant, ...rest }, ref) => {
    return (
      <>
        {variant !== 'pagination' && label && <label className={s.label}>{label}</label>}
        <SelectPrimitive.Root defaultValue={defaultValue} {...rest}>
          <SelectPrimitive.Trigger className={s.selectTrigger} ref={ref}>
            <SelectPrimitive.Value placeholder={placeholder ?? options[0].label} />
            <SelectPrimitive.Icon className={s.icon}></SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Content className={s.selectContent} position={'popper'}>
            {options?.map(el => {
              return (
                <SelectItem key={el.value} value={String(el.value)}>
                  {el.label}
                </SelectItem>
              )
            })}
          </SelectPrimitive.Content>
        </SelectPrimitive.Root>
      </>
    )
  }
)

type SelectItemProps = {
  children?: ReactNode
  disabled?: boolean
  value: string
}

const SelectItem = forwardRef<ElementRef<typeof SelectPrimitive.Item>, SelectItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <SelectPrimitive.Item className={s.selectItem} {...props} ref={ref}>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    )
  }
)

import { ChangeEvent, useState } from 'react'

import { IconButton } from '@/components/ui'

import defaultAva from '../../../assets/images/no-image.png'

type Props = {
  fullWidth?: boolean
  onClick?: (cover: string) => void
  variant?: 'primary' | 'secondary'
}

export const InputTypeFile = ({ fullWidth = true, onClick, variant = 'primary' }: Props) => {
  const [ava, setAva] = useState(defaultAva)
  const [isAvaBroken, setIsAvaBroken] = useState(false)

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0]

      if (file.size < 4000000) {
        convertFileToBase64(file, (file64: string) => {
          setAva(file64)
          onClick?.(file64)
          // setAva('111')
        })
      } else {
        console.error('Error: ', 'Файл слишком большого размера')
      }
    }
  }

  const convertFileToBase64 = (file: File, callBack: (value: string) => void) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      const file64 = reader.result as string

      callBack(file64)
    }
    reader.readAsDataURL(file)
  }

  const errorHandler = () => {
    setIsAvaBroken(true)
    alert('Кривая картинка')
  }

  return (
    <div>
      {ava && (
        <img
          alt={'ava'}
          onError={errorHandler}
          src={isAvaBroken ? defaultAva : ava}
          style={{ height: '118px', objectFit: 'cover', width: '100%' }}
        />
      )}
      <label>
        <input onChange={uploadHandler} style={{ display: 'none' }} type={'file'} />
        <IconButton
          as={'span'}
          fullWidth={fullWidth}
          height={'16'}
          iconId={'imageIcon'}
          variant={variant}
          viewBox={'0 0 24 24'}
          width={'16'}
        >
          Upload image
        </IconButton>
      </label>
    </div>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { ControlledTextField } from '@/components/controlled'
import { Button, Modal, Scroll } from '@/components/ui'
import { InputTypeFile } from '@/components/ui/InputTypeFile/InputTypeFile'
import { useUpdateCardMutation } from '@/services/cards/cardsApi'
import { CardResponse } from '@/services/cards/cardsApi.types'
import { useCreateCardInDeckMutation } from '@/services/decks'
import { base64ToBlob } from '@/utils/base64ToBlob'
import { z } from 'zod'

import s from './createCardModal.module.scss'

type Props = {
  defaultCardValue?: CardResponse
  onOpenChange: (open: boolean) => void
  open: boolean
  title?: string
}

const newCardSchema = z.object({
  answer: z.string().min(3),
  question: z.string().min(3),
})

type FormValues = z.infer<typeof newCardSchema>

export const CreateCardModal = ({
  defaultCardValue,
  onOpenChange,
  open = false,
  title = 'Creating a new Card',
}: Props) => {
  const { deckId } = useParams()
  const [createCard] = useCreateCardInDeckMutation()
  const [updateCard] = useUpdateCardMutation()
  const [questionImg, setQuestionImg] = useState<null | string>(
    defaultCardValue?.questionImg || null
  )

  const [answerImg, setAnswerImg] = useState<null | string>(defaultCardValue?.answerImg || null)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      answer: defaultCardValue?.answer || '',
      question: defaultCardValue?.question || '',
    },
  })

  const createCardHandler = async (data: FormValues) => {
    const contentType = 'image/*'
    let blobAnswer
    let blobQuestion

    if (answerImg !== defaultCardValue?.answerImg) {
      blobAnswer = base64ToBlob(answerImg ?? '', contentType)
    }
    if (questionImg !== defaultCardValue?.questionImg) {
      blobQuestion = base64ToBlob(questionImg ?? '', contentType)
    }

    const formData = new FormData()

    formData.append('answer', data.answer || '')
    formData.append('question', data.question || '')
    if (blobQuestion) {
      formData.append('questionImg', blobQuestion)
    }
    if (blobAnswer) {
      formData.append('answerImg', blobAnswer)
    }
    try {
      if (deckId) {
        if (defaultCardValue) {
          await updateCard({ formData, id: defaultCardValue?.id }).unwrap()
          reset()
          setQuestionImg(null)
          setAnswerImg(null)
          onOpenChange(false)
        } else {
          await createCard({ formData, id: deckId }).unwrap()
          reset()
          setQuestionImg(null)
          setAnswerImg(null)
          onOpenChange(false)
        }
      }
    } catch (error) {
      alert('Error in form data')
      reset()
      setQuestionImg(null)
      setAnswerImg(null)
      onOpenChange(false)
      // if (typeof( error)) {
      //   alert(error?.data?.errorMessages[0].message)
      // } else {
      //   alert('Error in form data')
      //   onOpenChange(false)
      // }
    }
  }

  const answerCoverHandler = (cover: string) => {
    setAnswerImg(cover)
  }
  const questionCoverHandler = (cover: string) => {
    setQuestionImg(cover)
  }

  return (
    <Modal className={s.wrap} onOpenChange={onOpenChange} open={open} title={title}>
      <Scroll style={{ left: '25px' }}>
        <form
          onSubmit={handleSubmit(createCardHandler)}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <ControlledTextField
            aria-describedby={'format'}
            control={control}
            label={'Question?'}
            name={'question'}
            placeholder={defaultCardValue?.questionImg}
          />
          <InputTypeFile
            className={s.input}
            defaultCover={defaultCardValue?.questionImg}
            fullWidth
            onClick={questionCoverHandler}
            variant={'secondary'}
          />
          <ControlledTextField
            aria-describedby={'format'}
            control={control}
            label={'Answer?'}
            name={'answer'}
            placeholder={defaultCardValue?.answer}
          />
          <InputTypeFile
            className={s.input}
            defaultCover={defaultCardValue?.answerImg}
            fullWidth
            onClick={answerCoverHandler}
            variant={'secondary'}
          />
          <div className={s.footer}>
            <Button onClick={() => onOpenChange(false)} type={'button'} variant={'secondary'}>
              Cansel
            </Button>
            <Button type={'submit'}>{defaultCardValue ? 'Update card' : 'Add new card'}</Button>
          </div>
        </form>
      </Scroll>
    </Modal>
  )
}

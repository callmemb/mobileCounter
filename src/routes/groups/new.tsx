import { createFileRoute, useNavigate } from '@tanstack/react-router'
import PageTemplate from '../../components/pageTemplate/component'
import ShortcutButton from '../../components/pageTemplate/components/shortcuts/shortcutButton'
import { ArrowLeft, CheckCircleOutline, Restore } from '@mui/icons-material'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRef } from 'react'
import { store } from '../../store'
import { NewCounterGroup, newCounterGroupValidator } from '../../definitions'
import StackLayoutForFields from '../../components/form/stackLayoutForFields'
import TextInput from '../../components/form/textInput'

export const Route = createFileRoute('/groups/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const formRef = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NewCounterGroup>({
    resolver: zodResolver(newCounterGroupValidator),
  })
  const onSubmit = async (data: NewCounterGroup) => {
    const { errorMessage } = await store.upsertCounterGroup(data)
    if (errorMessage) {
      alert(errorMessage)
    }
    navigate({ to: '..' })
  }

  return (
    <PageTemplate
      label="Add Group"
      leftOptions={[
        <ShortcutButton
          key="back"
          id={'back'}
          icon={<ArrowLeft />}
          color="warning"
          onClick={() => {
            navigate({ to: '..' })
          }}
        >
          Cancel
        </ShortcutButton>,
      ]}
      rightOptions={[
        <ShortcutButton
          key="reset"
          id={'reset'}
          icon={<Restore />}
          color="warning"
          onClick={() => {
            reset()
          }}
        >
          Reset
        </ShortcutButton>,

        <ShortcutButton
          key="submit"
          id={'submit'}
          disabled={!isValid || Object.keys(errors).length !== 0}
          icon={<CheckCircleOutline />}
          onClick={() => formRef.current?.requestSubmit()}
        >
          Submit
        </ShortcutButton>,
      ]}
    >
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <StackLayoutForFields>
          <TextInput
            label="Label"
            {...register('label')}
            errorMessage={errors?.label?.message?.toString()}
          />
        </StackLayoutForFields>
      </form>
    </PageTemplate>
  )
}

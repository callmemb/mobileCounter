import { createFileRoute, useNavigate } from '@tanstack/react-router'
import PageTemplate from '../components/pageTemplate/component'
import ShortcutButton from '../components/pageTemplate/components/shortcuts/shortcutButton'
import { ArrowBack } from '@mui/icons-material'
import { Box } from '@mui/material'

export const Route = createFileRoute('/404')({
  component: RouteComponent,
})

export default function RouteComponent() {
  const navigate = useNavigate()

  return (
    <PageTemplate
      staticOptions={[
        <ShortcutButton
          key="back"
          id={'back'}
          icon={<ArrowBack />}
          color="error"
          onClick={() => {
            navigate({ to: '/' })
          }}
        >
          Back
        </ShortcutButton>,
      ]}
    >
      <Box sx={{ textAlign: 'center' }}>404</Box>
    </PageTemplate>
  )
}

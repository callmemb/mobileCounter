import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test/2')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /test/2!'
}

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import PageTemplate from '../../components/pageTemplate/component'
import ShortcutButton from '../../components/pageTemplate/components/shortcuts/shortcutButton'
import { ArrowLeft } from '@mui/icons-material'
import { Stack } from '@mui/material'

export const Route = createFileRoute('/test/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  return (
    <PageTemplate
      label={'Test page'}
      menuOptions={[
        <ShortcutButton
          key="test2"
          id={'test2'}
          icon={'T'}
          color="info"
          onClick={() => navigate({ to: '/test/2' })}
        >
          short
        </ShortcutButton>,
        <ShortcutButton
          key="s1"
          id={'9'}
          icon={'a'}
          onClick={() => console.log('9')}
        >
          short
        </ShortcutButton>,
        <ShortcutButton
          key="s2"
          id={'10'}
          icon={'a'}
          onClick={() => console.log('10')}
        >
          buttons
        </ShortcutButton>,
      ]}
      leftOptions={[
        <ShortcutButton
          key="back"
          id={'back'}
          icon={<ArrowLeft />}
          color="warning"
          onClick={() => {
            navigate({ to: '/' })
          }}
        >
          Back
        </ShortcutButton>,
        <ShortcutButton
          key="l1"
          id={'1'}
          icon={'♠'}
          onClick={() => console.log('1')}
        >
          quick
        </ShortcutButton>,
        <ShortcutButton
          key="l2"
          id={'2'}
          icon={'♣'}
          onClick={() => console.log('2')}
        >
          jump
        </ShortcutButton>,
        <ShortcutButton
          key="l3"
          id={'3'}
          icon={'♥'}
          onClick={() => console.log('3')}
        >
          settings
        </ShortcutButton>,
        <ShortcutButton
          key="l4"
          id={'4'}
          icon={'♦'}
          onClick={() => console.log('4')}
        >
          run
        </ShortcutButton>,
        <ShortcutButton
          key="l5"
          id={'l5'}
          icon={'★'}
          onClick={() => console.log('l5')}
        >
          options
        </ShortcutButton>,
        <ShortcutButton
          key="l6"
          id={'l6'}
          icon={'☆'}
          onClick={() => console.log('l6')}
        >
          tools
        </ShortcutButton>,
        <ShortcutButton
          key="l7"
          id={'l7'}
          icon={'⚡'}
          onClick={() => console.log('l7')}
        >
          actions
        </ShortcutButton>,
        <ShortcutButton
          key="l8"
          id={'l8'}
          icon={'✿'}
          onClick={() => console.log('l8')}
        >
          play
        </ShortcutButton>,
        <ShortcutButton
          key="l9"
          id={'l9'}
          icon={'✤'}
          onClick={() => console.log('l9')}
        >
          control
        </ShortcutButton>,
        <ShortcutButton
          key="l10"
          id={'l10'}
          icon={'♪'}
          onClick={() => console.log('l10')}
        >
          music
        </ShortcutButton>,
        <ShortcutButton
          key="l11"
          id={'l11'}
          icon={'☼'}
          onClick={() => console.log('l11')}
        >
          sun
        </ShortcutButton>,
        <ShortcutButton
          key="l12"
          id={'l12'}
          icon={'☺'}
          onClick={() => console.log('l12')}
        >
          smile
        </ShortcutButton>,
        <ShortcutButton
          key="l13"
          id={'l13'}
          icon={'⚽'}
          onClick={() => console.log('l13')}
        >
          sport
        </ShortcutButton>,
        <ShortcutButton
          key="l14"
          id={'l14'}
          icon={'⚱'}
          onClick={() => console.log('l14')}
        >
          vase
        </ShortcutButton>,
        <ShortcutButton
          key="l15"
          id={'l15'}
          icon={'⛄'}
          onClick={() => console.log('l15')}
        >
          snow
        </ShortcutButton>,
        <ShortcutButton
          key="l16"
          id={'l16'}
          icon={'⛅'}
          onClick={() => console.log('l16')}
        >
          clouds
        </ShortcutButton>,
        <ShortcutButton
          key="l17"
          id={'l17'}
          icon={'⛎'}
          onClick={() => console.log('l17')}
        >
          stars
        </ShortcutButton>,
        <ShortcutButton
          key="l18"
          id={'l18'}
          icon={'⛵'}
          onClick={() => console.log('l18')}
        >
          sail
        </ShortcutButton>,
        <ShortcutButton
          key="l19"
          id={'l19'}
          icon={'⛰'}
          onClick={() => console.log('l19')}
        >
          mount
        </ShortcutButton>,
        <ShortcutButton
          key="l20"
          id={'l20'}
          icon={'⛺'}
          onClick={() => console.log('l20')}
        >
          camp
        </ShortcutButton>,
        <ShortcutButton
          key="l21"
          id={'l21'}
          icon={'⛽'}
          onClick={() => console.log('l21')}
        >
          fuel
        </ShortcutButton>,
        <ShortcutButton
          key="l22"
          id={'l22'}
          icon={'✨'}
          onClick={() => console.log('l22')}
        >
          spark
        </ShortcutButton>,
      ]}
      rightOptions={[
        <ShortcutButton
          key="r1"
          id={'5'}
          icon={'☘'}
          onClick={() => console.log('5')}
        >
          luck
        </ShortcutButton>,
        <ShortcutButton
          key="r2"
          id={'6'}
          icon={'✎'}
          onClick={() => console.log('6')}
        >
          edit
        </ShortcutButton>,
        <ShortcutButton
          key="r3"
          id={'7'}
          icon={'⚓'}
          onClick={() => console.log('7')}
        >
          anchor
        </ShortcutButton>,
        <ShortcutButton
          key="r4"
          id={'8'}
          icon={'✈'}
          onClick={() => console.log('8')}
        >
          fly
        </ShortcutButton>,
        <ShortcutButton
          key="r5"
          id={'r5'}
          icon={'⚔'}
          onClick={() => console.log('r5')}
        >
          battle
        </ShortcutButton>,
        <ShortcutButton
          key="r6"
          id={'r6'}
          icon={'☮'}
          onClick={() => console.log('r6')}
        >
          peace
        </ShortcutButton>,
        <ShortcutButton
          key="r7"
          id={'r7'}
          icon={'⚛'}
          onClick={() => console.log('r7')}
        >
          atom
        </ShortcutButton>,
        <ShortcutButton
          key="r8"
          id={'r8'}
          icon={'☯'}
          onClick={() => console.log('r8')}
        >
          balance
        </ShortcutButton>,
        <ShortcutButton
          key="r9"
          id={'r9'}
          icon={'☪'}
          onClick={() => console.log('r9')}
        >
          moon
        </ShortcutButton>,
        <ShortcutButton
          key="r10"
          id={'r10'}
          icon={'✝'}
          onClick={() => console.log('r10')}
        >
          cross
        </ShortcutButton>,
        <ShortcutButton
          key="r11"
          id={'r11'}
          icon={'⚜'}
          onClick={() => console.log('r11')}
        >
          royal
        </ShortcutButton>,
        <ShortcutButton
          key="r12"
          id={'r12'}
          icon={'❀'}
          onClick={() => console.log('r12')}
        >
          flower
        </ShortcutButton>,
        <ShortcutButton
          key="r13"
          id={'r13'}
          icon={'⚡'}
          onClick={() => console.log('r13')}
        >
          power
        </ShortcutButton>,
        <ShortcutButton
          key="r14"
          id={'r14'}
          icon={'⚘'}
          onClick={() => console.log('r14')}
        >
          plant
        </ShortcutButton>,
        <ShortcutButton
          key="r15"
          id={'r15'}
          icon={'⚖'}
          onClick={() => console.log('r15')}
        >
          scale
        </ShortcutButton>,
        <ShortcutButton
          key="r16"
          id={'r16'}
          icon={'☁'}
          onClick={() => console.log('r16')}
        >
          cloud
        </ShortcutButton>,
        <ShortcutButton
          key="r17"
          id={'r17'}
          icon={'⚒'}
          onClick={() => console.log('r17')}
        >
          tools
        </ShortcutButton>,
        <ShortcutButton
          key="r18"
          id={'r18'}
          icon={'⚕'}
          onClick={() => console.log('r18')}
        >
          health
        </ShortcutButton>,
        <ShortcutButton
          key="r19"
          id={'r19'}
          icon={'⚗'}
          onClick={() => console.log('r19')}
        >
          flask
        </ShortcutButton>,
        <ShortcutButton
          key="r20"
          id={'r20'}
          icon={'⚙'}
          onClick={() => console.log('r20')}
        >
          gear
        </ShortcutButton>,
        <ShortcutButton
          key="r21"
          id={'r21'}
          icon={'⚛'}
          onClick={() => console.log('r21')}
        >
          atom
        </ShortcutButton>,
        <ShortcutButton
          key="r22"
          id={'r22'}
          icon={'⚪'}
          onClick={() => console.log('r22')}
        >
          circle
        </ShortcutButton>,
      ]}
    >
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        {Array.from({ length: 500 }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </Stack>
    </PageTemplate>
  )
}

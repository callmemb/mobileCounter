import PageTemplate from "./components/pageTemplate/component";
import ShortcutButton from "./components/pageTemplate/components/shortcuts/shortcutButton";

function App() {
  return (
    <PageTemplate
      label={"Counters"}
      staticOptions={[
        <ShortcutButton key="s1" id={"9"} icon={"a"} onClick={console.log}>
          short
        </ShortcutButton>,
        <ShortcutButton key="s2" id={"10"} icon={"a"} onClick={console.log}>
          buttons
        </ShortcutButton>,
      ]}
      leftOptions={[
        <ShortcutButton key="l1" id={"1"} icon={"♠"} onClick={console.log}>
          quick
        </ShortcutButton>,
        <ShortcutButton key="l2" id={"2"} icon={"♣"} onClick={console.log}>
          jump
        </ShortcutButton>,
        <ShortcutButton key="l3" id={"3"} icon={"♥"} onClick={console.log}>
          settings
        </ShortcutButton>,
        <ShortcutButton key="l4" id={"4"} icon={"♦"} onClick={console.log}>
          run
        </ShortcutButton>,
        <ShortcutButton key="l5" id={"l5"} icon={"★"} onClick={console.log}>
          options
        </ShortcutButton>,
        <ShortcutButton key="l6" id={"l6"} icon={"☆"} onClick={console.log}>
          tools
        </ShortcutButton>,
        <ShortcutButton key="l7" id={"l7"} icon={"⚡"} onClick={console.log}>
          actions
        </ShortcutButton>,
        <ShortcutButton key="l8" id={"l8"} icon={"✿"} onClick={console.log}>
          play
        </ShortcutButton>,
        <ShortcutButton key="l9" id={"l9"} icon={"✤"} onClick={console.log}>
          control
        </ShortcutButton>,
        <ShortcutButton key="l10" id={"l10"} icon={"♪"} onClick={console.log}>
          music
        </ShortcutButton>,
        <ShortcutButton key="l11" id={"l11"} icon={"☼"} onClick={console.log}>
          sun
        </ShortcutButton>,
        <ShortcutButton key="l12" id={"l12"} icon={"☺"} onClick={console.log}>
          smile
        </ShortcutButton>,
        <ShortcutButton key="l13" id={"l13"} icon={"⚽"} onClick={console.log}>
          sport
        </ShortcutButton>,
        <ShortcutButton key="l14" id={"l14"} icon={"⚱"} onClick={console.log}>
          vase
        </ShortcutButton>,
        <ShortcutButton key="l15" id={"l15"} icon={"⛄"} onClick={console.log}>
          snow
        </ShortcutButton>,
        <ShortcutButton key="l16" id={"l16"} icon={"⛅"} onClick={console.log}>
          clouds
        </ShortcutButton>,
        <ShortcutButton key="l17" id={"l17"} icon={"⛎"} onClick={console.log}>
          stars
        </ShortcutButton>,
        <ShortcutButton key="l18" id={"l18"} icon={"⛵"} onClick={console.log}>
          sail
        </ShortcutButton>,
        <ShortcutButton key="l19" id={"l19"} icon={"⛰"} onClick={console.log}>
          mount
        </ShortcutButton>,
        <ShortcutButton key="l20" id={"l20"} icon={"⛺"} onClick={console.log}>
          camp
        </ShortcutButton>,
        <ShortcutButton key="l21" id={"l21"} icon={"⛽"} onClick={console.log}>
          fuel
        </ShortcutButton>,
        <ShortcutButton key="l22" id={"l22"} icon={"✨"} onClick={console.log}>
          spark
        </ShortcutButton>,
      ]}
      rightOptions={[
        <ShortcutButton key="r1" id={"5"} icon={"☘"} onClick={console.log}>
          luck
        </ShortcutButton>,
        <ShortcutButton key="r2" id={"6"} icon={"✎"} onClick={console.log}>
          edit
        </ShortcutButton>,
        <ShortcutButton key="r3" id={"7"} icon={"⚓"} onClick={console.log}>
          anchor
        </ShortcutButton>,
        <ShortcutButton key="r4" id={"8"} icon={"✈"} onClick={console.log}>
          fly
        </ShortcutButton>,
        <ShortcutButton key="r5" id={"r5"} icon={"⚔"} onClick={console.log}>
          battle
        </ShortcutButton>,
        <ShortcutButton key="r6" id={"r6"} icon={"☮"} onClick={console.log}>
          peace
        </ShortcutButton>,
        <ShortcutButton key="r7" id={"r7"} icon={"⚛"} onClick={console.log}>
          atom
        </ShortcutButton>,
        <ShortcutButton key="r8" id={"r8"} icon={"☯"} onClick={console.log}>
          balance
        </ShortcutButton>,
        <ShortcutButton key="r9" id={"r9"} icon={"☪"} onClick={console.log}>
          moon
        </ShortcutButton>,
        <ShortcutButton key="r10" id={"r10"} icon={"✝"} onClick={console.log}>
          cross
        </ShortcutButton>,
        <ShortcutButton key="r11" id={"r11"} icon={"⚜"} onClick={console.log}>
          royal
        </ShortcutButton>,
        <ShortcutButton key="r12" id={"r12"} icon={"❀"} onClick={console.log}>
          flower
        </ShortcutButton>,
        <ShortcutButton key="r13" id={"r13"} icon={"⚡"} onClick={console.log}>
          power
        </ShortcutButton>,
        <ShortcutButton key="r14" id={"r14"} icon={"⚘"} onClick={console.log}>
          plant
        </ShortcutButton>,
        <ShortcutButton key="r15" id={"r15"} icon={"⚖"} onClick={console.log}>
          scale
        </ShortcutButton>,
        <ShortcutButton key="r16" id={"r16"} icon={"☁"} onClick={console.log}>
          cloud
        </ShortcutButton>,
        <ShortcutButton key="r17" id={"r17"} icon={"⚒"} onClick={console.log}>
          tools
        </ShortcutButton>,
        <ShortcutButton key="r18" id={"r18"} icon={"⚕"} onClick={console.log}>
          health
        </ShortcutButton>,
        <ShortcutButton key="r19" id={"r19"} icon={"⚗"} onClick={console.log}>
          flask
        </ShortcutButton>,
        <ShortcutButton key="r20" id={"r20"} icon={"⚙"} onClick={console.log}>
          gear
        </ShortcutButton>,
        <ShortcutButton key="r21" id={"r21"} icon={"⚛"} onClick={console.log}>
          atom
        </ShortcutButton>,
        <ShortcutButton key="r22" id={"r22"} icon={"⚪"} onClick={console.log}>
          circle
        </ShortcutButton>,
      ]}
    >
      content
    </PageTemplate>
  );
}

export default App;

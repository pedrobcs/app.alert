'use client';

import { KeyButton } from './KeyButton';

export type KeypadActions = {
  append: (s: string) => void;
  backspace: () => void;
  clear: () => void;
  clearAll: () => void;
  toggleSign: () => void;
  setRise: () => void;
  setRun: () => void;
  setPitch: () => void;
  calcPitch: () => void;
  calcRise: () => void;
  calcRun: () => void;
  calcDiag: () => void;
  calcConv: () => void;
  calcStairs: () => void;
};

export function Keypad({ actions }: { actions: KeypadActions }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <KeyButton label="C" variant="ctl" ariaLabel="Clear" onPress={actions.clear} />
      <KeyButton label="AC" variant="ctl" ariaLabel="Clear all" onPress={actions.clearAll} />
      <KeyButton label="+/-" variant="ctl" ariaLabel="Toggle sign" onPress={actions.toggleSign} />
      <KeyButton label="⌫" variant="ctl" ariaLabel="Backspace" onPress={actions.backspace} />

      <KeyButton label="Set Rise" variant="fn" onPress={actions.setRise} />
      <KeyButton label="Set Run" variant="fn" onPress={actions.setRun} />
      <KeyButton label="Set Pitch" variant="fn" onPress={actions.setPitch} />
      <KeyButton label="Diag" variant="fn" onPress={actions.calcDiag} />

      <KeyButton label="7" onPress={() => actions.append('7')} />
      <KeyButton label="8" onPress={() => actions.append('8')} />
      <KeyButton label="9" onPress={() => actions.append('9')} />
      <KeyButton label="Conv" variant="fn" onPress={actions.calcConv} />

      <KeyButton label="4" onPress={() => actions.append('4')} />
      <KeyButton label="5" onPress={() => actions.append('5')} />
      <KeyButton label="6" onPress={() => actions.append('6')} />
      <KeyButton label="Pitch" variant="fn" onPress={actions.calcPitch} />

      <KeyButton label="1" onPress={() => actions.append('1')} />
      <KeyButton label="2" onPress={() => actions.append('2')} />
      <KeyButton label="3" onPress={() => actions.append('3')} />
      <KeyButton label="Rise" variant="fn" onPress={actions.calcRise} />

      <KeyButton label="0" onPress={() => actions.append('0')} />
      <KeyButton label="." onPress={() => actions.append('.')} />
      <KeyButton label="/" onPress={() => actions.append('/')} />
      <KeyButton label="Run" variant="fn" onPress={actions.calcRun} />

      <KeyButton label="Stair" variant="fn" onPress={actions.calcStairs} />
      <div className="col-span-3">
        <KeyButton
          label="="
          variant="wide"
          ariaLabel="Equals (no-op in MVP)"
          onPress={actions.calcPitch}
        />
      </div>
    </div>
  );
}

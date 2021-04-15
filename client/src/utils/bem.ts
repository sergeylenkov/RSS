
export function bem(block: string) {
  const _block = block;

  return {
    block: () => {
      return _block;
    },
    element: (name: string, modifier?: string) => {
      if (modifier) {
        return `${_block}__${name}_${modifier}`;
      }

      return `${_block}__${name}`;
    }
  }
}
class Bem {
  private _block: string;
  private _elementSeparator = '__';
  private _modifierSeparator = '_';
  private _modifiers: string[] = [];

  constructor(block: string) {
    this._block = block;
    this._modifiers = [];
  }

  getElement(name: string): Bem {
    return new Bem(`${this._block}${this._elementSeparator}${name}`);
  }

  addModifier(name?: string): Bem {
    if (name) {
      this._modifiers.push(name);
    }

    return this;
  }

  build(): string {
    const modifiers = this._modifiers.map(modifier => {
      return `${this._modifierSeparator}${modifier}`;
    });

    const classes = modifiers.map(modifier => {
      return `${this._block}${modifier}`;
    })

    return [this._block, ...classes].join(' ');
  }

  toString(): string {
    return this.build();
  }
}

export { Bem };
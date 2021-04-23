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
    this._modifiers = [];
    return new Bem(`${this._block}${this._elementSeparator}${name}`);
  }

  addModifier(name?: string): Bem {
    if (name) {
      this._modifiers.push(name);
    }

    return this;
  }

  toString(): string {
    return this._build();
  }

  _build(): string {
    const modifiers = this._modifiers.map(modifier => {
      return `${this._modifierSeparator}${modifier}`;
    });

    const classes = modifiers.map(modifier => {
      return `${this._block}${modifier}`;
    })

    return [this._block, ...classes].join(' ');
  }
}

export { Bem };
/**
 * Utility class for steganography with zero-width characters.
 *
 * @credits https://github.com/lorossi/zero-width-steganography
 */
class ZeroWidth {
  private characterMap: Record<string, string>;
  private spaceMap: Record<string, string>;
  private ciphertextCharacters: Set<string>;

  constructor() {
    this.characterMap = {
      0: '\u200B', // ZERO WIDTH SPACE
      1: '\uFEFF', // ZERO WIDTH NO-BREAK SPACE
    };
    this.spaceMap = {
      '\u200B': '0',
      '\uFEFF': '1',
    };

    this.ciphertextCharacters = new Set(Object.keys(this.spaceMap));
  }

  private _spaceEncode(clear: string): string {
    if (clear.length === 0)
      return '';

    const binary = clear.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    return [...binary].map(b => this.characterMap[b]).join('');
  }

  private _spaceDecode(encoded: string): string {
    if (encoded.length === 0)
      return '';

    const binary = [...encoded].map(e => this.spaceMap[e]).join('');

    let decoded = '';
    for (let i = 0; i < binary.length; i += 8)
      decoded += String.fromCharCode(Number.parseInt(binary.slice(i, i + 8), 2));

    return decoded;
  }

  zeroEncode(source: string, clear: string): string {
    const encoded = this._spaceEncode(clear);
    return source + encoded;
  }

  zeroDecode(source: string): string | null {
    const encoded = [...source].filter(s => this.ciphertextCharacters.has(s)).join('');
    const decoded = this._spaceDecode(encoded);
    if (decoded.length === 0)
      return null;
    return decoded;
  }

  cleanString(source: string): string {
    return [...source].filter(s => !this.ciphertextCharacters.has(s)).join('');
  }
}

// test code

const zeroWidth = new ZeroWidth();
const clear = '@candlelit';
const encoded = zeroWidth.zeroEncode('用作学长团会议', clear);
console.log(encoded);
console.log(zeroWidth.zeroDecode(encoded));

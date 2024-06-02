export default function encryptText(text) {
  // Definir los mapeos de reemplazo
  const replacements = {
    'a': 'U1', 'e': 'U2', 'i': 'U3', 'o': 'U4', 'u': 'U5',
    'b': 'm1', 'c': 'm2', 'd': 'm3', 'f': 'm4', 'g': 'm5',
    'h': 'm6', 'j': 'm7', 'k': 'm8', 'l': 'm9', 'm': 'm10',
    'n': 'm11', 'ñ': 'm12', 'p': 'm13', 'q': 'm14', 'r': 'm15',
    's': 'm16', 't': 'm17', 'v': 'm18', 'w': 'm19', 'x': 'm20',
    'y': 'm21', 'z': 'm22', 'A': 'U1', 'E': 'U2', 'I': 'U3',
    'O': 'U4', 'U': 'U5', 'B': 'g1', 'C': 'g2', 'D': 'g3',
    'F': 'g4', 'G': 'g5', 'H': 'g6', 'J': 'g7', 'K': 'g8',
    'L': 'g9', 'M': 'g10', 'N': 'g11', 'Ñ': 'g12', 'P': 'g13',
    'Q': 'g14', 'R': 'g15', 'S': 'g16', 'T': 'g17', 'V': 'g18',
    'W': 'g19', 'X': 'g20', 'Y': 'g21', 'Z': 'g22'
  };

  let encryptedText = '';

  for (let char of text) {
    if (replacements.hasOwnProperty(char)) {
      encryptedText += replacements[char];
    } else {
      encryptedText += char;
    }
  }

  return encryptedText;
}



  
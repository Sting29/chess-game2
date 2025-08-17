// Simple test for FEN parsing
// Run with: node src/test-fen-parsing.js

const testFenParsing = () => {
  const fenPosition = "E6C/WWWW1WWW/8/8/8/2W1W3/WWW1WWW1/R7";

  console.log("Testing FEN position:", fenPosition);
  console.log("Expected board layout:");
  console.log("8: E _ _ _ _ _ C _  (Exit on a8, Checkpoint on g8)");
  console.log("7: W W W W _ W W W  (Walls)");
  console.log("6: _ _ _ _ _ _ _ _  (Empty)");
  console.log("5: _ _ _ _ _ _ _ _  (Empty)");
  console.log("4: _ _ _ _ _ _ _ _  (Empty)");
  console.log("3: _ _ W _ W _ _ _  (Walls on c3, e3)");
  console.log("2: W W W _ W W W _  (Walls)");
  console.log("1: R _ _ _ _ _ _ _  (White Rook on a1)");
  console.log("   a b c d e f g h");

  // Manual parsing simulation
  const ranks = fenPosition.split("/");
  console.log("\nParsed ranks:", ranks);

  for (let i = 0; i < ranks.length; i++) {
    const rank = 8 - i; // FEN starts from rank 8
    const rankData = ranks[i];
    console.log(`Rank ${rank}: "${rankData}"`);

    let file = 0;
    for (const char of rankData) {
      if (/\d/.test(char)) {
        const emptySquares = parseInt(char);
        console.log(`  Files ${file}-${file + emptySquares - 1}: empty`);
        file += emptySquares;
      } else {
        const square = String.fromCharCode(97 + file) + rank; // a-h + 1-8
        console.log(`  ${square}: ${char}`);
        file++;
      }
    }
  }
};

testFenParsing();

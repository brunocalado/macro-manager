var macroNames = ["Whisper", "Whisper", "Whisper", "Whisper", "Whisper", "Whisper", "Whisper", "Whisper", "Whisper", "Whisper"];

var startingPositionInHotbar = 41;
var endPositionInHotbar = 50;

if (startingPositionInHotbar > 0 && endPositionInHotbar < 51 && startingPositionInHotbar <= endPositionInHotbar && macroNames.length > endPositionInHotbar - startingPositionInHotbar) {
  
  var hotbarNumber = Array(endPositionInHotbar - startingPositionInHotbar + 1).fill().map((_, idx) => startingPositionInHotbar + idx)
  
  var newHotbar = {
    [hotbarNumber[0]]: game.macros.getName(macroNames[0]).data._id
  };
  
  if (macroNames.length > 1) {
    for (let i = 1; i < hotbarNumber.length; i++) {
      newHotbar[hotbarNumber[i]] = game.macros.getName(macroNames[i]).data._id;
    }
  }
  
  await game.user.update({
    hotbar: newHotbar
  });

}// end if
// STRINGS
String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// NUMBERS
function clamp(num, min, max){
  return Math.min(Math.max(num, min), max);
}

// COLORS
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function generateId() {
  let id = String(Date.now()).hashCode();
  return Math.abs(parseInt(id));
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function updateVersion(){
  logWarning('Checking for updates...');

  $.ajax(
    {
      url: 'backend/update.php',
      success: function(data){
        let result = data.split('Already up to date');
        if(result == undefined || result == null || String(result) == ''){
          logError('An error occured while updating.');
        }else if(result.length > 2){
          logWarning('Already latest version.');
        }else{
          location.reload(true);
        }
      },
      error: function(error){
        logError('An error occured executing  ' + transformObj['name'] + ' transform on ' + affectedNode.title + ' - ' + affectedNode.type.name );
      }
    });
}
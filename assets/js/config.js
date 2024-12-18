$(document).ready(function () {
  
  if (typeof Twitch !== 'undefined' && Twitch.ext) {
    Twitch.ext.onAuthorized((auth) => {
      $('#save-key').addEventListener('click', () => {
        if (isBroadcaster) {
          Twitch.ext.configuration.set('broadcaster', '1', JSON.stringify({ apiKey: $('#udxApiKeyInput').value }));
        } else {
          console.error('not-broadcaster');
        }
      })
    })
  } else {
    console.error('Twitch object is not defined');
  }

})
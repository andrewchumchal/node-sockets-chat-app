
let socket = io();

let scrollToBottom = ()=>{
  // Selectors
  let messages = jQuery('#messages')
  let newMessage = messages.children('li:last-child');
  // Heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMsgHeight = newMessage.innerHeight();
  let lastMsgHeight = newMessage.prev().innerHeight();
  // set a var for debugging
  let calc = clientHeight + scrollTop + newMsgHeight + lastMsgHeight + 100;
  console.log(calc, ' >= ',scrollHeight);
  
  if (calc >= scrollHeight){
    console.log('Should Scroll');
    messages.scrollTop(scrollHeight);
  }
};
        
socket.on('connect', function () {
  console.log('Connected to server');

});

socket.on('disconnect', function () {
  console.log('Disconnected from Server')
})

// MESSAGES Listeners
socket.on('newMessage', (message) => {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  console.log(formattedTime);

  let template = jQuery('#message-template').html();
  let html = Mustache.render(template,{
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  console.log(formattedTime);

  let template = jQuery('#location-message-template').html();
  let html = Mustache.render(template,{
    from: message.from,
    text: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();

});

// MESSAGE Senders
jQuery('#message-form').on('submit', (event) => {
  event.preventDefault();
  let element = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: element.val()
  }, () => {
    console.log("Ack");
    element.val('');
  });
});


let locationbutton = jQuery('#sendLocation');

locationbutton.on('click', () => {
  console.log('Button was pressed');
  if(!navigator.geolocation){
    return alert('Geolaction not supported by your browser');
  }
  let originalButtonText = locationbutton.text();
  locationbutton.text('Getting Location');
  locationbutton.attr('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((pos) =>{
    console.log(pos);
    locationbutton.text('Sending Location');
    socket.emit('createLocationMessage', {
      lat: pos.coords.latitude,
      long: pos.coords.longitude
    });
    locationbutton.removeAttr('disabled');
    locationbutton.text(originalButtonText);
  }, (error) => {
    locationbutton.removeAttr('disabled');
    locationbutton.text(originalButtonText);
    alert('Unable to get location');
  });

});

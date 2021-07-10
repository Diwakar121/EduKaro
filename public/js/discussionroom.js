const socket = io();

$('#chat').hide()

console.log($('.name').attr('id'));
var roomName=$('.roomName').attr('id');
var user = $('.name').attr('id');

$('#enterBtn').click(() => {
    socket.emit('enter', {
        room:roomName,
        name:user
    })

    $('#enterBtn').hide();
    $('#chat').show();
})



$('#send-btn').click(() => {
    
    let message=$('#inp').val();
    socket.emit('send_msg', {
        room:roomName,
        msg:message
    })
    $('#list').append(`<li> <strong>me</strong> : ${message}</li>`)
    $('#inp').val("");
    $('.emojionearea-editor').text("");
})

socket.on('rcvd_msg', (data) => {
    console.log(data);
    $('#list').append(`<li> <strong>${data.name}</strong> : ${data.msg}</li>`)
})
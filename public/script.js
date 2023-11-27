const socket = io('/');
let myvideoStream;
var chatDisabled = false
let globalUserName;
let videoArr = 0
let count = 0;
const peers = []
const videoGrid = document.getElementById('video-grid');
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3036'

})
const myVideo = document.createElement('video');
myVideo.muted = true;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myvideoStream = stream;
    addVideoStream(myVideo, stream);


    peer.on('call', (call) => {
        globalUserName = 'Pratyush'
        if (peers.includes(call.peer) == false) {
            peers.push(call.peer)
        }

        if (peers.length <= 1) {

            console.log(peers)
            console.log(peers.length)
            call.answer(stream); // Answer the call with an A/V stream.
            const video = document.createElement('video')
            call.on('stream', (stream) => {
                addVideoStream(video, stream)

            });
        }
        else {
            chatDisabled = true
            window.location = '/error'
            alert('Not allowed')
        }
    })

    socket.on('user-connect', (userid) => {



        globalUserName = 'Pratyush'

        connectToNewUser(userid, stream);
    }





    )
    socket.on('createMessage', data => {
        if (count == 0) {

            makeTag(data, false)

            count++;
        }
        count = 0;
    })
})
    .catch((err) => {
        console.log(err)
    })
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)


})
socket.emit('join-room', ROOM_ID);

const muteUnmute = () => {
    const track = myvideoStream.getAudioTracks()[0].enabled
    if (track) {
        myvideoStream.getAudioTracks()[0].enabled = false
        setUnmuteButton()

    }
    else {
        myvideoStream.getAudioTracks()[0].enabled = true
        setMuteButton()
    }
}
const setMuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone"></i>
    <span>Unmute</span>
  `
    document.querySelector('.main__mute_button').innerHTML = html;

}


const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const videoPlayStop = () => {
    const track = myvideoStream.getVideoTracks()[0].enabled
    console.log(track)
    if (track) {
        myvideoStream.getVideoTracks()[0].enabled = false
        setVideoPlay()

    }
    else {
        myvideoStream.getVideoTracks()[0].enabled = true

        setVideoStop()

    }
}

const setVideoStop = () => {
    const html = `
        <i class="fas fa-video"></i>
          <span>Play Video</span>
        `
    document.querySelector('.main__video_button').innerHTML = html;
}



const setVideoPlay = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Pause Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}





const connectToNewUser = (userid, stream) => {
    const call = peer.call(userid, stream)
    const video = document.createElement('video')
    call.on('stream', (stream) => {
        addVideoStream(video, stream)
    })
    call.on('close', () => {
        video.remove()
    })

}
const addVideoStream = (video, stream) => {
    video.srcObject = stream;

    video.onloadedmetadata = (event) => {
        video.play();

    }
    if (videoArr < 2) {
        videoGrid.appendChild(video);
        videoArr++;
        console.log(videoGrid.childElementCount)
    }
}
const chats = () => {
    if (chatDisabled) {
        return
    }
    else {
        var text = document.getElementById('text').value;
        var NewUser = sessionStorage.getItem('name');
        if (text != '') {
            socket.emit("chat-message", [NewUser, text, socket.id])

            if (localStorage.getItem('value') == null) {
                localStorage.setItem('value', '[]');
            }
        }
    }

    var old_data = JSON.parse(localStorage.getItem('value'));
    console.log(old_data)

    old_data.push([NewUser, text, socket.id]);
    localStorage.setItem('value', JSON.stringify(old_data))


}

const closemeet = () => {
    window.top.close()
    console.log('x')

}


const getData = () => {
    if (data == undefined) {
        var data = JSON.parse(localStorage.getItem('value'));
    }
    if (data != null) {
        for (v = 0; v < data.length; v++) {
            x = data[v]
            if (x != undefined) {
                makeTag(x, true)
            }
        }

    }
    if (sessionStorage.getItem('name') == null) {
        var name = window.prompt()

        createText = document.createTextNode(name)
        var h = document.getElementById('ChatHead')

        h.append(createText)
        sessionStorage.setItem('name', name)


    }

}
const toggleChat = () => {

    var toggle1 = document.getElementsByClassName('main_right')[0]
    var toggle2 = document.getElementsByClassName('main_left')[0]
    if (toggle1.style.display == 'none') {
        toggle1.style.display = '';
        toggle2.style.flex = 0.8;
    }
    else {
        toggle1.style.display = 'none';
        toggle2.style.flex = 1.0;
    }

}
const makeTag = (x, flag) => {
    var VarTag;
    if (flag == true) {
        var name = sessionStorage.getItem('name');
        if (name == x[0]) {
            VarTag = 'sender'
        }
        else {
            VarTag = 'reciever'
        }

    }

    else {
        if (x[2] == socket.id) {
            VarTag = 'sender'
            //console.log(localStorage.getItem('value'))
        }
        else {
            VarTag = 'reciever'
        }

    }
    var container = document.createElement('div')
    var UserTag = document.createElement('div')
    //var MsgTag = document.createElement('span')
    var TextBox = document.createElement('span')

    container.setAttribute("class", "chatclass")
    var MainBodyId = document.getElementById('main_bodyId')
    MainBodyId.prepend(container);
    container.prepend(UserTag);

    UserTag.setAttribute("class", VarTag)
    UserTag.append(TextBox);
    //  MsgTag.setAttribute("class","sender")
    TextBox.innerHTML = x[1];
    //MsgTag.innerHTML = x[1];
}  

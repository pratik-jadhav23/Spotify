let currentSong = new Audio()
let previousData
let globalSongDivVar
let globalAllFoldersNames = []

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getAllFolderNames() {
    // let allFolders = await fetch("http://127.0.0.1:5500/songs")
    // let response = await allFolders.text()
    // let allFoldersNames = []
    // // console.log('allfolders',response);
    // let div = document.createElement("div")
    // div.innerHTML = response
    // let as = div.getElementsByTagName("a")
    // // console.log('as = ',as);
    // Array.from(as).forEach(e => {
    //     // console.log('e = ',e,e.href.startsWith("http://127.0.0.1:5500/songs/"));
    //     if (e.href.startsWith("http://127.0.0.1:5500/songs/")) allFoldersNames.push(e.title)
    // })
    // // console.log('allfoldernames = ', allFoldersNames);
    // // setting globally allFoldersNames
    // globalAllFoldersNames = allFoldersNames

    // Array.from(allFoldersNames).forEach(e => {
    //     let html = `<div class="${e}" id="${e}">`
    //     document.querySelector(".librarySongs").innerHTML = document.querySelector(".librarySongs").innerHTML + html
    // })

}

async function getSongs() {


    // previouscode-------------------------------------------------------------------------------------------
    // let allSongs = await fetch("http://127.0.0.1:5500/songs/all")
    let allSongs = await fetch("/songs/all")
    let response = await allSongs.text();
    // console.log('', response);
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    // console.log('as = ',as[1].href);
    let songsObj = { songs: [], songsNames: [] }
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        console.log('element = ',element);
        if (element.href.endsWith(".mp3")) {
            // console.log('element.href = ',"/songs/"+element.href.split("/songs/")[1].replaceAll("%20", " "));
            songsObj.songs.push("/songs/"+element.href.split("/songs/")[1].replaceAll("%20", " "))
            // console.log('element.title = ',element.innerText);
            songsObj.songsNames.push(element.innerText)
        }
    }
    // console.log('songsobj = ',songsObj);

    // songsObj.songs.map(item => {
    //     console.log('item = ', item.split("http://127.0.0.1:5500")[1]);
    // })

    for (let index = 0; index < songsObj.songs.length; index++) {
        let html = `<div class="song  df" id="song">
                        <div class="songImg ">
                            <img src="/songs/all/apnaBanaLe.jpg" alt="songImg">
                            <div class="playSongButton dfaic">
                                <img id="playSongButton" src="play.svg" alt="play">
                            </div>
                        </div>
                        <div class="songName ">
                            <h4><a href="${songsObj.songs[index]}"></a>${songsObj.songsNames[index]}</h4>
                            <p>Artist Names</p>
                        </div>
                    </div>`
        document.querySelector(".allTimeHits").innerHTML = document.querySelector(".allTimeHits").innerHTML + html
    }
    // ------------------------------------------------------------------------------------------------------

    return songsObj

}

async function loadSongs(allFoldersNames) {
    console.log('allfoldernames = ', allFoldersNames);
    let count = 0
    Array.from(allFoldersNames).forEach(async e => {
        // count = count+1
        // console.log('e= ', e);
        let allSongs = await fetch(`/songs/${e}`)
        response = await allSongs.text();
        // console.log('', response);
        let div = document.createElement("div")
        div.innerHTML = response
        let as = div.getElementsByTagName("a")
        let songsObj = { songs: [], songsNames: [] }
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songsObj.songs.push(element.href.split("http://127.0.0.1:5500")[1])
                songsObj.songsNames.push(element.title)
            }
        }
        // console.log('songsobg = ',songsObj);
        for (let index = 0; index < songsObj.songs.length; index++) {
            let html = `<div class="song  df" id="song">
                        <div class="songImg ">
                            <img src="/songs/all/apnaBanaLe.jpg" alt="songImg">
                            <div class="playSongButton dfaic">
                                <img id="playSongButton" src="play.svg" alt="play">
                            </div>
                        </div>
                        <div class="songName ">
                            <h4><a href="${songsObj.songs[index]}"></a>${songsObj.songsNames[index]}</h4>
                            <p>Artist Names</p>
                        </div>
                    </div>`
            document.querySelector(`.${e}`).innerHTML = document.querySelector(`.${e}`).innerHTML + html
        }
        // console.log('count = ',count);
        if (count > 0) document.querySelector(`.${e}`).style.display = "none";
        count = count + 1
    })
    return allFoldersNames
}

async function createSubArtists() {
    let imageSRC = ["https://i.scdn.co/image/ab676161000051740261696c5df3be99da6ed3f3", "https://i.scdn.co/image/ab67616100005174b19af0ea736c6228d6eb539c", "https://i.scdn.co/image/ab67616100005174a038d7d87f8577bbb9686bd3", "https://i.scdn.co/image/ab67616100005174fc7c542c04b5f7dc8f1b1c16", "https://i.scdn.co/image/ab67616100005174fb13d10be20fdcb5a670f551"]
    let artistName = ["Argit Singh", "A.R. Rahman", "Sachin-Jigar", "Anirudh Ravichander", "Vishal Mishra"]
    for (let index = 0; index < imageSRC.length - 1; index++) {
        let html = `<div class="subArtists">
                        <div class="subArtistsImage">
                            <img src="${imageSRC[index]}" alt="image">
                        </div>
                        <div id="subArtistsData">
                            <h4>${artistName[index]}</h4>
                            <p>Artist</p>
                        </div>
                    </div>`
        document.querySelector(".panel").innerHTML = document.querySelector(".panel").innerHTML + html
    }
}

const playMusic = (song, folderName, e, previousData) => {
    if (previousData == e) {
        if (currentSong.paused) {
            currentSong.play()
            playbarPlay.src = "pause.svg"
            e.getElementsByTagName('img')[1].src = "pause.svg"
        }
        else {
            currentSong.pause()
            playbarPlay.src = "play.svg"
            e.getElementsByTagName('img')[1].src = "play.svg"
        }
    }
    else {
        currentSong.src = `/songs/${folderName}/` + song
        currentSong.play()
        playbarPlay.src = "pause.svg"
        e.getElementsByTagName('img')[1].src = "pause.svg"
        // e.getElementsByTagName('img')[1].style.opacity = "1";
    }
}

function playSongs() {
    let event = document.querySelectorAll(".song")
    // console.log('event = ', event);
    Array.from(event).forEach(e => {
        e.addEventListener("click", (element) => {
            if (previousData) {
                previousData.style.backgroundColor = "transparent"
                previousData.getElementsByTagName('img')[1].src = "play.svg"
                // previousData.getElementsByTagName('img')[1].style.opacity = "0"; 
            }

            e.style.backgroundColor = "#393939"
            // e.getElementsByTagName('img')[1].style.opacity = "1";
            let songName = e.querySelector(".songName").getElementsByTagName("h4")[0].innerText.trim()
            document.querySelector(".playbarLeft").innerHTML = `<marquee scrolldelay="140" behavior="" direction="" class="playbarLeftMarquee">${songName}</marquee>`
            globalSongDivVar = e
            let folderName = e.getElementsByTagName("a")[0].href.split("/")[4]
            // console.log('e = ',e.getElementsByTagName("a")[0].href.split("/")[4]);
            console.log('songname = ',songName);
            playMusic(songName, folderName, e, previousData);
            previousData = e
        })
    })

}

function albumLoad(globalAllFoldersNames) {
    let event = document.querySelectorAll(".subArtists")
    // console.log('event = ', event);
    Array.from(event).forEach(e => {
        e.addEventListener("click", () => {

        })
    })
}

async function main() {
    await createSubArtists();
    let songsObj = await getSongs();
    // console.log('songsObj getsongs = ',songsObj.songs);
    // songsObj.songs.map(item => {
    //     console.log('item = ', item.split("http://127.0.0.1:5500")[1]);
    // })
    // loadSongs(globalAllFoldersNames)
    playSongs();
    albumLoad(globalAllFoldersNames);

    //playbarPlay, next, previous
    playbarPlay.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playbarPlay.src = "pause.svg"
            globalSongDivVar.getElementsByTagName('img')[1].src = "pause.svg"
        }
        else {
            currentSong.pause()
            playbarPlay.src = "play.svg"
            globalSongDivVar.getElementsByTagName('img')[1].src = "play.svg"
        }

    })

    //next
    next.addEventListener("click", () => {
        // if(currentSong.src) console.log('',currentSong.src.split("/"));
        // else console.log('nothing');
    })


    //seekbar time
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".currentSongTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}`
        document.querySelector(".currentSongTotalTime").innerHTML = `${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".seekbarCircle").style.left = (currentSong.currentTime / currentSong.duration) * 96 + "%";
        if (currentSong.currentTime == currentSong.duration) {
            playbarPlay.src = "play.svg"
            globalSongDivVar.getElementsByTagName('img')[1].src = "play.svg"
        }
    })

    seekbarMain.addEventListener("click", (e) => {
        // console.log('',e,e.offsetX);
        seekbarCircle.style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 98 + "%";
        currentSong.currentTime = (currentSong.duration * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100
    })

}

main();
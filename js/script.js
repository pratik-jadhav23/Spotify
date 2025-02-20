let currentSong = new Audio()
currentSong.volume = 1
let songsObj
let previousData
let globalSongDivVar
let globalSongDivVarIndex
let globalAllFoldersNames = []
let currentPlayedAlbum = { "name": "Your Library" }
let previousPlayedAlbum
let currentPlayedSong = {}

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

async function getAllAlbums() {
    let allFolders = await fetch("songs/popularArtists")
    let response = await allFolders.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    for (let i = 1; i < as.length; i++) {
        if (as[i].href.includes("popularArtists/")) globalAllFoldersNames.push({ folderName: "popularArtists/" + as[i].innerText, artistNames: as[i].innerText })
        // globalAllFoldersNames.push({ folderName: "popularArtists/" + as[i].innerHTML, artistNames: as[i].innerHTML })
    }
}

async function getSongs(folderName, playlistName) {
    // console.log('fname = ', folderName);
    let allSongs = await fetch(`/songs/${folderName}`)
    let response = await allSongs.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songsObj = { songs: [], songsNames: [] }
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songsObj.songs.push("/songs/" + element.href.split("/songs/")[1].replaceAll("%20", " "))
            songsObj.songsNames.push(element.innerText)
        }
    }
    document.querySelector(".playlistName").innerText = playlistName


    for (let index = 0; index < songsObj.songs.length; index++) {
        let html = `<div class="song  df">
                        <div class="songImg ">
                            <img src="/songs/all/apnaBanaLe.jpg" alt="songImg">
                            <div class="playSongButton dfaic">
                                <img id="playSongButton" src="svgs/playbarPlay.svg" alt="play">
                            </div>
                        </div>
                        <div class="songName ">
                            <h4><a href="${songsObj.songs[index]}"></a>${songsObj.songsNames[index]}</h4>
                            <p>Artist Names</p>
                        </div>
                    </div>`

        document.querySelector(".allSongs").innerHTML += html
    }

    return songsObj

}

async function createSubArtists() {
    let imageSRC = ["https://i.scdn.co/image/ab67616100005174b19af0ea736c6228d6eb539c", "https://i.scdn.co/image/ab67616100005174fc7c542c04b5f7dc8f1b1c16", "https://i.scdn.co/image/ab676161000051740261696c5df3be99da6ed3f3", "https://i.scdn.co/image/ab67616100005174cb6926f44f620555ba444fca", "https://i.scdn.co/image/ab67616100005174a038d7d87f8577bbb9686bd3"]
    let artistName = ["A.R. Rahman", "Anirudh Ravichander", "Argit Singh", "Pritam", "Sachin-Jigar"]
    for (let index = 0; index < imageSRC.length; index++) {
        let html = `<div class="subArtists rounded" data-folder="${globalAllFoldersNames[index].folderName}">
                        <div class="play">
                            <img src="svgs/play.svg" alt="play">
                        </div>
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

const playMusic = (songName, folderName, e, previousData) => {
    currentPlayedSong = { songName, folderName, e, previousData }
    if (previousData == e) {
        if (currentSong.paused) {
            currentSong.play()
            playbarPlay.src = "svgs/pause.svg"
            e.getElementsByTagName('img')[1].src = "svgs/pause.svg"
        }
        else {
            currentSong.pause()
            playbarPlay.src = "svgs/playbarPlay.svg"
            e.getElementsByTagName('img')[1].src = "svgs/playbarPlay.svg"
        }
    }
    else {
        currentSong.src = `/songs/${folderName}/` + songName
        currentSong.play()
        if (previousData) {
            previousData.style.backgroundColor = "transparent"
            previousData.getElementsByTagName('img')[1].src = "svgs/playbarPlay.svg"
            previousData.getElementsByTagName('img')[1].style.opacity = "";
        }
        playbarPlay.src = "svgs/pause.svg"
        e.getElementsByTagName('img')[1].src = "svgs/pause.svg"
        e.style.backgroundColor = "#393939"
        e.getElementsByTagName('img')[1].style.opacity = "1";
        document.querySelector(".playbarLeft").innerHTML = `<marquee scrolldelay="140" behavior="" direction="" class="playbarLeftMarquee">${songName}</marquee>`
    }
    // previousPlayedAlbum = document.querySelector(".playlistName").innerText
}

async function playSongs() {
    let event = document.querySelectorAll(".song")
    Array.from(event).forEach((e, index) => {
        e.addEventListener("click", () => {
            globalSongDivVarIndex = index
            let songName = e.querySelector(".songName").getElementsByTagName("h4")[0].innerText.trim()
            globalSongDivVar = e
            let folderName = e.getElementsByTagName("a")[0].href.split("/")[4]
            if (folderName == "popularArtists") folderName = folderName + "/" + e.getElementsByTagName("a")[0].href.split("/")[5]
            playMusic(songName, folderName, e, previousData);
            previousData = e
            previousPlayedAlbum = document.querySelector(".playlistName").innerText
        })
    })

}

function albumLoad() {
    let event = document.querySelectorAll(".subArtists")
    let previousAlbumData
    Array.from(event).forEach((e, index) => {
        e.addEventListener("click", async (item) => {
            if (document.querySelector(".playlistName").innerText != e.getElementsByTagName("h4")[0].innerText) {

                if (previousAlbumData) {
                    previousAlbumData.style.backgroundColor = ""
                    previousAlbumData.children[0].style.opacity = ""
                }

                document.querySelector(`.allSongs`).innerHTML = ""
                let tempFolderName = item.currentTarget.dataset.folder
                await getSongs(item.currentTarget.dataset.folder, e.getElementsByTagName("h4")[0].innerText);
                currentPlayedAlbum = { "name": document.querySelector(".playlistName").innerText, "e": e }
                let event = document.querySelectorAll(".song")
                playMusic(songsObj.songsNames[0], tempFolderName, event[0], previousData)
                previousData = event[0]
                e.style.backgroundColor = "#393939"
                e.children[0].style.opacity = 1
                previousAlbumData = e
                document.querySelector(".home").style.backgroundColor = "transparent"
                await playSongs();
            }
        })
    })
}

async function main() {
    await getAllAlbums();
    await createSubArtists();
    await getSongs("all", "Your Library");
    albumLoad();
    await playSongs();
    let previousVolume



    //playbarPlay Button
    playbarPlay.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            document.querySelector(".playbarPlay").title = "Pause"
            playbarPlay.src = "svgs/pause.svg"
            globalSongDivVar.getElementsByTagName('img')[1].src = "svgs/pause.svg"
        }
        else {
            document.querySelector(".playbarPlay").title = "Play"
            // console.log('title = ',document.querySelector(".playbarPlay").title);
            currentSong.pause()
            playbarPlay.src = "svgs/playbarPlay.svg"
            globalSongDivVar.getElementsByTagName('img')[1].src = "svgs/playbarPlay.svg"
        }
    })

    //next
    next.addEventListener("click", () => {
        // let previousPlayedAlbum = document.querySelector(".playlistName").innerText
        console.log("previousPlayedAlbum = ", previousPlayedAlbum, "currentPlayedAlbum = ", currentPlayedAlbum.name)
        if (document.querySelector(".playlistName").innerText != "Searched Songs" && currentPlayedAlbum.name == previousPlayedAlbum) {
            let currentSongSrc = currentSong.src.split("/")[currentSong.src.split("/").length - 1]
            if (currentSongSrc.includes("%20")) {
                currentSongSrc = currentSongSrc.replace(/%20/g, " ")
            }
            let index = songsObj.songsNames.indexOf(currentSongSrc)
            let folderName = currentSong.src.split("/")[4]
            if (folderName == "popularArtists") folderName = folderName + "/" + currentSong.src.split("/")[5]
            index += 1
            globalSongDivVarIndex += 1
            if (globalSongDivVarIndex == songsObj.songsNames.length) {
                index = 0
                globalSongDivVarIndex = 0
            }
            let event = document.querySelectorAll(".song")
            playMusic(songsObj.songsNames[index], folderName, event[globalSongDivVarIndex], previousData)
            // console.log('', currentSongSrc, songsObj);
            previousData = event[globalSongDivVarIndex]
        }
    })

    //previous
    previous.addEventListener("click", () => {
        // let previousPlayedAlbum = document.querySelector(".playlistName").innerText
        if (document.querySelector(".playlistName").innerText != "Searched Songs" && currentPlayedAlbum.name == previousPlayedAlbum) {
            let currentSongSrc = currentSong.src.split("/")[currentSong.src.split("/").length - 1]
            if (currentSongSrc.includes("%20")) {
                currentSongSrc = currentSongSrc.replace(/%20/g, " ")
            }
            let index = songsObj.songsNames.indexOf(currentSongSrc)
            let folderName = currentSong.src.split("/")[4]
            if (folderName == "popularArtists") folderName = folderName + "/" + currentSong.src.split("/")[5]
            index -= 1
            globalSongDivVarIndex -= 1
            if (globalSongDivVarIndex == -1) {
                index = songsObj.songsNames.length - 1
                globalSongDivVarIndex = songsObj.songsNames.length - 1
            }
            // let event = document.querySelectorAll("." + "sub" + `${globalCurrClass}`)
            let event = document.querySelectorAll(".song")
            playMusic(songsObj.songsNames[index], folderName, event[globalSongDivVarIndex], previousData)
            previousData = event[globalSongDivVarIndex]
        }
    })


    //seekbar time
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".currentSongTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}`
        document.querySelector(".currentSongTotalTime").innerHTML = `${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".seekbarCircle").style.left = (currentSong.currentTime / currentSong.duration) * 96 + "%";
        if (currentSong.currentTime == currentSong.duration) {
            playbarPlay.src = "svgs/playbarPlay.svg"
            globalSongDivVar.getElementsByTagName('img')[1].src = "svgs/playbarPlay.svg"
            if (document.querySelector(".repeatSvg").style.fill === "rgb(31, 222, 101)") playMusic(currentPlayedSong.songName, currentPlayedSong.folderName, currentPlayedSong.e, currentPlayedSong.previousData)
        }
    })

    seekbarMain.addEventListener("click", (e) => {
        seekbarCircle.style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 98 + "%";
        currentSong.currentTime = (currentSong.duration * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100
    })

    //Setting volume range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    //home click
    document.querySelector(".home").addEventListener("click", async (e) => {
        document.querySelector(".home").style.backgroundColor = "#393939"
        if (document.querySelector(".playlistName").innerText != "Your Library") {
            document.querySelector(`.allSongs`).innerHTML = ""
            await getSongs("all", "Your Library");
            await playSongs();
            currentPlayedAlbum.e.style.backgroundColor = ""
            currentPlayedAlbum.e.children[0].style.opacity = ""
            currentPlayedAlbum = { "name": document.querySelector(".playlistName").innerText }
            // document.querySelector(".home").style.backgroundColor = "#393939"

        }
        
    })

    //Search
    searchInput.addEventListener("click", async () => {
        if (document.querySelector(".playlistName").innerText != "Your Library") {
            document.querySelector(`.allSongs`).innerHTML = ""
            await getSongs("all", "Your Library")
            playSongs()
            document.querySelector(".home").style.backgroundColor = "#393939"

        }
        if (currentPlayedAlbum.e) {
            currentPlayedAlbum.e.style.backgroundColor = ""
            currentPlayedAlbum.e.children[0].style.opacity = ""
        }
    })

    searchInput.addEventListener("keydown", async (event) => {
        if (event.key === 'Enter') {
            searchCommonFunction()
            searchInput.value = ""
            document.querySelector(".playlistName").innerText = "Searched Songs"
            playSongs()
            document.querySelector(".home").style.backgroundColor = "transparent"
        }
    })

    function searchCommonFunction() {
        if (searchInput.value.length != 0) {
            let searchInputValue = searchInput.value.replace(/[^a-zA-Z0-9]/g, '').toLocaleLowerCase()
            let e = document.querySelectorAll(".song")
            let e_songsNamesArray = []
            Array.from(e).forEach((item) => {
                e_songsNamesArray.push(item.getElementsByTagName("h4")[0].innerText.replace(/[^a-zA-Z0-9]/g, '').toLocaleLowerCase())
            })
            let indexs = findBestMatch(searchInputValue, e_songsNamesArray)
            if (indexs != "no matches found") {
                document.querySelector(".allSongs").innerHTML = ""
                for (let i = 0; i < indexs.length; i++) {
                    document.querySelector(".allSongs").innerHTML += `${e[indexs[i]].outerHTML}`
                }

            }
            else document.querySelector(".allSongs").innerHTML = `<div style="padding-top: 18px;">${indexs}</div>`
        }

    }

    function findBestMatch(str, arr) {
        let indexs = []
        for (let index = 0; index < arr.length; index++) {
            if (arr[index].startsWith(str)) indexs.push(index)
        }
        return indexs.length === 0 ? "no matches found" : indexs
    }

    function searchXmark() {
        searchDisplay.innerHTML += `<div class="xmark"><img src="svgs/xmark.svg" class="invert cursorPointer" alt="xmark"></div>`
        playSongs()
        document.querySelector(".xmark").getElementsByTagName("img")[0].addEventListener("click", () => {
            searchDisplay.style.display = "none"
            searchDisplay.innerHTML = ""
            searchInput.value = ""
            leftBottom.style.opacity = right.style.opacity = "1"
            leftBottom.style.pointerEvents = right.style.pointerEvents = "auto"
        })
    }

    searchButton.addEventListener("click", () => {
        if (searchInput.value.length != 0) {
            // leftBottom.style.opacity = right.style.opacity = "0.44"
            // leftBottom.style.pointerEvents = right.style.pointerEvents = "none"
            searchCommonFunction()
            searchInput.value = ""
            document.querySelector(".playlistName").innerText = "Searched Songs"
            playSongs()
            document.querySelector(".home").style.backgroundColor = "transparent"
        }
    })

    // repeat mode
    document.querySelector(".repeatSvg").addEventListener("click", () => {
        // console.log('repeat clicked',document.querySelector(".repeatSvg").style)
        let e = document.querySelector(".repeatSvg")
        e.style.fill === "rgb(255, 255, 255)" || e.style.fill === "" ? e.style.fill = "rgb(31, 222, 101)" : e.style.fill = "rgb(255, 255, 255)"
    })

    //Volume Mute
    volume.addEventListener("click", () => {

        // console.log('vol clicked',volume.src);
        if (volume.src.endsWith("svgs/volume.svg")) {
            volume.src = "svgs/volumeXmark.svg"
            previousVolume = currentSong.volume
            // console.log('prev vol = ',previousVolume);
            currentSong.volume = 0
        }
        else {
            volume.src = "svgs/volume.svg"
            // console.log('',previousVolume);
            currentSong.volume = previousVolume
        }
    })

    // setting left with bars.svg
    document.querySelector(".bars").addEventListener("click",()=>{
        // console.log('bars clicked');
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".leftSidePanelClose").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-130%"
    })


}

main();
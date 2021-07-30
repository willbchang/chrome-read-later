// https://javascript.info/size-and-scroll-window
class ScrollPosition {
    constructor(scrolled) {
        this.scrolled = scrolled
    }

    setTop() {
        window.scrollTo({top: this.top, behavior: 'smooth'})
    }

    get top() {
        return this.scrolled.height ? this.dynamicTop : window.pageYOffset
    }

    get dynamicTop() {
        return this.scrolled.top / this.scrolled.height * this.height
    }

    get height() {
        return Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        )
    }

    get bottom() {
        return window.scrollY + window.innerHeight
    }
}

class VideoPosition {
    constructor(played) {
        this.played = played
        this.video = document.getElementsByTagName('video')[0] || {}
    }

    setCurrentTime() {
        this.video.currentTime = this.played.currentTime
    }

    get currentTime() {
        return this.video?.currentTime || 0
    }

    get duration () {
        return this.video?.duration || 1
    }
}

class PDFPosition {
    constructor(read) {
        this.read = read
        this.pdf = document.getElementById('pageNumber') || {}
    }

    get currentPageNumber() {
        return this.pdf.value || 0
    }

    get totalPageNumber() {
        return this.pdf.max || 1
    }

    setCurrentPage() {
        PDFViewerApplication.pdfViewer.currentPageNumber = this.read.currentPageNumber
    }
}

export function getPosition() {
    const scroll = new ScrollPosition({})
    const video = new VideoPosition({})
    const pdf = new PDFPosition({})
    console.log(pdf)
    return {
        scroll: {
            top:    scroll.top,
            bottom: scroll.bottom,
            height: scroll.height,
        },
        video: {
            currentTime: video.currentTime,
            duration:    video.duration,
        },
        pdf: {
            currentPageNumber: pdf.currentPageNumber,
            totalPageNumber:   pdf.totalPageNumber,
        }
    }
}

export function setPosition(position) {
    const scroll = new ScrollPosition(position.scroll)
    const video = new VideoPosition(position.video)
    scroll.setTop()
    video.setCurrentTime()
}

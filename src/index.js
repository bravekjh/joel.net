import Rx                  from 'rx-lite'
import { map,
         get,
         set,
         compose,
         execute }         from './lib/functional'
import { multiply }        from './lib/functional-math'
import { $,
         addEventListener,
         hideElement,
         insertAfter }     from './lib/functional-dom'
import { always }          from './lib/combinators'
import { imageToHexagon }  from './hexagon'

console.clear()

// TODO: move a bunch of this shit to it's own service
const TABLET_WIDTH = 767
const mapImageToHexagon = map(imageToHexagon)
const images = $('img[data-transform="hexagon"]')
const getDimensions = dom => ({ width: dom.outerWidth, height: dom.outerHeight })
const head = $('.head')[0]
const getProfileImageHeight = ({ width }) => width <= TABLET_WIDTH ? width * .8 : 500
const setHeaderHeight = height => head.style.height = height + 'px'
const setHeaderHeightFromImageHeight =
    execute(
        compose(
            setHeaderHeight,
            multiply(.6),
            getProfileImageHeight))
const moveProfileImageUp = container => image => px => {
    image.style.top = -px + 'px'
    container.style.height = px + 'px'
    return px
}
const setProfileImageTop = data => compose(
        moveProfileImageUp($('.profile__container')[0])($('.profile__image')[0]),
        multiply(.5),
        getProfileImageHeight
    )(data)
const setHeaderAndProfileImagePosition =
    compose(setProfileImageTop, setHeaderHeightFromImageHeight)

mapImageToHexagon(images)

const windowResizeObservable =
    Rx.Observable.fromEvent(window, 'DOMContentLoaded')
    .merge(Rx.Observable.fromEvent(window, 'resize'))
    .map(_ => getDimensions(window))
    .subscribeOnNext(setHeaderAndProfileImagePosition)

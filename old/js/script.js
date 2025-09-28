const domContentLoad = function() {
    const $exampleBoxItemEl = document.querySelectorAll('.example-item__box-el');

    $exampleBoxItemEl.forEach(el => el.onmouseover = onMouseOverExample);
}

const onMouseOverExample = function (event) {
    const hoverId = event.target.dataset.id;
    const $parent = event.target.parentElement;
    const $boxElems = $parent.children;
    const $images = $parent.parentElement.firstElementChild.children;

    changeActiveIndex($images, hoverId);
    changeActiveIndex($boxElems, hoverId);
}

const changeActiveIndex = function(htmlCollection, index) {
    for (let $html of htmlCollection) {
        if ($html.dataset.id === index) {
            $html.classList.add('active');
        } else {
            $html.classList.remove('active');
        }
    }
}

document.addEventListener("DOMContentLoaded", domContentLoad);
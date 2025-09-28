function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}

document.addEventListener("DOMContentLoaded", function () {
    let params = {};

    let initParams = function(){
        params = {
            'counters': {
                28: 0,
                29: 0,
                30: 0,
                31: 0,
                32: 0,
                33: 0,
                34: 0,
                35: 0,
                36: 0,
                37: 0,
                38: 0,
                39: 0,
                40: 0,
                41: 0,
                42: 0,
                43: 0,
                44: 0,
                45: 0,
            },
            'logs': ''
        }
    }

    let init = function () {
        initParams();
        loadData(); // загрузка из сейва
        loadDataHtml();
        loadLogs();
        updateTotal();
        bindEvents();
    }

    let bindEvents = function () {
        let btnPlus = document.querySelectorAll('.counter-inputs .button-plus');
        let btnMinus = document.querySelectorAll('.counter-inputs .button-minus');
        let btnClear = document.querySelector('.js-clear');

        btnPlus.forEach(btn => btn.addEventListener('click', onClickPlus));
        btnMinus.forEach(btn => btn.addEventListener('click', onClickMinus));
        btnClear.addEventListener('click', clearData);
    }

    let loadDataHtml = function () {
        for (const k in params.counters) {
            if (!Object.hasOwn(params.counters, k)) continue;

            const count = params.counters[k];

            let $box = document.querySelector(`.counter-wrapp .box[data-nsize='${k}']`);
            let $input = $box.querySelector('.input');

            $input.innerHTML = count;
        }
    }

    let onClickPlus = function (e) {
        let $box = e.target.closest('.box');
        let $input = $box.querySelector('.input');
        let nsize = $box.dataset.nsize;
        let time = formatDate(new Date());

        params.counters[nsize] += 1;

        $input.innerHTML = params.counters[nsize];
        addLogs(`${time} -> Плюс[${nsize}] - стало ${params.counters[nsize]}`);
        updateTotal();
        saveData();
    }

    let onClickMinus = function (e) {
        let $box = e.target.closest('.box');
        let $input = $box.querySelector('.input');
        let nsize = $box.dataset.nsize;
        let time = formatDate(new Date());

        params.counters[nsize] -= 1;
        if (params.counters[nsize] < 0) {
            params.counters[nsize] = 0;
        }

        $input.innerHTML = params.counters[nsize];
        addLogs(`${time} -> Минус[${nsize}] - стало ${params.counters[nsize]}`);
        updateTotal();
        saveData();
    }

    let updateTotal = function () {
        for (const k in params.counters) {
            if (!Object.hasOwn(params.counters, k)) continue;

            const count = params.counters[k];

            let $totalItem = document.querySelector(`.total-item[data-nsize='${k}']`);
            let $totalItemCount = $totalItem.querySelector('.total-item-count');

            $totalItemCount.innerHTML = count;
        }
    }

    let addLogs = function (text) {
        let $content = document.querySelector('.logs-content');
        let innerText = text + '\n' + $content.innerHTML;

        $content.innerHTML = innerText;
        params.logs = $content.innerHTML;
    }

    let loadLogs = function () {
        let $content = document.querySelector('.logs-content');
        $content.innerHTML = params.logs;
    }

    let saveData = function () {
        window.localStorage.setItem('params', JSON.stringify(params));
    }

    let loadData = function () {
        let loadParam = JSON.parse(window.localStorage.getItem('params'));

        if (loadParam) {
            params = loadParam;
        } else {
            initParams();
        }
    }

    let clearData = function () {
        const result = confirm('Очистить данные?');
        if (result) {
            window.localStorage.clear();

            loadData(); // загрузка из сейва
            loadDataHtml();
            loadLogs();
            updateTotal();
        }
    }

    init();
});

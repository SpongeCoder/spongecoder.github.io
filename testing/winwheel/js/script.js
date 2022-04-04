window.addEventListener('load', function() {        
    let theWheel = new Winwheel({
        canvasId: 'winwheel-canvas',
        numSegments: 14,     
        outerRadius: 230,
        innerRadius: 5,
        textFontSize: 30,
        textAlignment: 'outer',
        textOrientation: 'curved',
        textFontFamily: 'Roboto',
        strokeStyle: '#988A89',
        segments:  
        [
            {strokeStyle: '#ffffff', fillStyle: '#B24B46', text: 'ЕЩЁ\nОДИН\nШАНС', textFillStyle: '#ffffff', textFontSize: 20, textOrientation: 'horizontal', textFontWeight: 'normal', value: 'reset'},
            {strokeStyle: '#ffffff', fillStyle: '#CDBEB9', text: '10%', textFillStyle: '#2E4A34', value: 10},
            {strokeStyle: '#ffffff', fillStyle: '#FFC27F', text: '15%', textFillStyle: '#2E4A34', value: 15},
            {strokeStyle: '#ffffff', fillStyle: '#FFFFFF', text: '7%', textFillStyle: '#2E4A34', value: 7},
            {strokeStyle: '#ffffff', fillStyle: '#B24B46', text: 'ЕЩЁ\nОДИН\nШАНС', textFillStyle: '#ffffff', textFontSize: 20, textOrientation: 'horizontal', textFontWeight: 'normal', value: 'reset'},
            {strokeStyle: '#ffffff', fillStyle: '#2E4A34', text: '12%', textFillStyle: '#ffffff', value: 12},
            {strokeStyle: '#ffffff', fillStyle: '#FFFFFF', text: '7%', textFillStyle: '#2E4A34', value: 7},
            {strokeStyle: '#ffffff', fillStyle: '#CDBEB9', text: '10%', textFillStyle: '#2E4A34', value: 10},
            {strokeStyle: '#ffffff', fillStyle: '#B24B46', text: '20%', textFillStyle: '#ffffff', value: 20},
            {strokeStyle: '#ffffff', fillStyle: '#2E4A34', text: '12%', textFillStyle: '#ffffff', value: 12},
            {strokeStyle: '#ffffff', fillStyle: '#CDBEB9', text: '10%', textFillStyle: '#2E4A34', value: 10},
            {strokeStyle: '#ffffff', fillStyle: '#FFFFFF', text: '7%', textFillStyle: '#2E4A34', value: 7},
            {strokeStyle: '#ffffff', fillStyle: '#FFC27F', text: '15%', textFillStyle: '#2E4A34', value: 15},
            {strokeStyle: '#ffffff', fillStyle: '#2E4A34', text: '12%', textFillStyle: '#ffffff', value: 12},
        ],
        animation:
        {
            callbackFinished: cbPrize,
            type: 'spinToStop',
            duration: 5,
            spins: 4,
        }
    }, true);

    let isSpin = false;
    let startBtn = document.getElementById('winwheel-start-spin');

    startBtn?.addEventListener('click', () => {
        if (isSpin) return;

        isSpin = true;
        theWheel.stopAnimation(false);
        theWheel.rotationAngle = -12.5;
        theWheel.startAnimation();
    });

    // fucking hack for font and angle
    let $wheelDiv = document.getElementById('winwheel');
    setTimeout(()=>{
        $wheelDiv.style.opacity = '1';
    
        theWheel.stopAnimation(false);
        theWheel.rotationAngle = -12.5;
        theWheel.draw();
    }, 150);

    /* TODO: доделать кэлбэк */
    function cbPrize(segment)
    {   
        isSpin = false;

        console.log('segment', segment, segment.text)
        console.log(segment.value)
    }            

})
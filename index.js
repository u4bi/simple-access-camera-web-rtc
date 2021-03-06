var video,
    feed,
    feedContext,
    effect,
    effectContext;


    /*  UserMedia 가져오기
        클라이언트의 브라우저에서 사용 가능한지 판별 */
    navigator.getMedia = ( 
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
    );


    if(navigator.getMedia) console.log('지원되는 브라우저');


    /*  메서드 호출하여 콜백 받기
        getUserMedia (스트림 옵션, 연결 성공, 연결 오류) */
    navigator.getMedia({
        video : {

            /*  getUserMedia 비디오 옵션 알아보기
                https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia 
            */
            width: 800 , // 카메라 해상도 설정 
            height: 600 ,
            /* 최소 해상도 설정 */
            // width : {
            //     min : 1800
            // },
            frameRate: { // 프레임 속도
                ideal : 10,
                max : 15
            }
            /* 전면 및 후면 카메라 */
            // , facingMode: 'user'
            // , facingMode: 'environment'
        },
        audio : true
    }, success, function(e){
        console.log('err ', e);

    });





function success(e){
    // console.log('success ', e);

    /*  비디오 스트림하기
        비디오 DOM의 소스를 스트림으로 설정
        */
    video = document.getElementById ('cam');
    video.src = window.URL.createObjectURL(e);
    video.play();


    feed = document.getElementById('feed');
    feedContext = feed.getContext('2d');


    effect = document.getElementById('effect');
    effectContext = effect.getContext('2d');


    render();
};





/*  비디오 캡쳐하기
    캔버스 DOM에 비디오를 그려준다 */
function photo(){
    var 
        capture = document.getElementById('capture'),
        context = capture.getContext('2d');

    // 컨텍스트를 가져왔으면 비디오 이미지를 그린다.

    context.drawImage(video, 0, 0, capture.width, capture.height);

} 





/*  비디오 스트림하기 
    https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
*/
function render(){ 
    requestAnimationFrame(render);
    // console.log('render');

    feedContext.drawImage(video, 0, 0, feed.width, feed.height);
    
    renderEffect();

}





/* 스트리밍 되는 비디오에 효과주기
*/
function renderEffect(){
    var 
        imageData = feedContext.getImageData(0, 0, effect.width, effect.height);
    
    imageData.data = add(0, 0, 255); // blue
    
    effectContext.putImageData(imageData, 0, 0);
    // feedContext.putImageData(imageData, 0, 0);


    function add(r, g, b){
        /*  RGB CODE
            https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Colors/Color_picker_tool
        */

        var 
            data = imageData.data;

        for(var i=0, l=data.length; i < l; i += 4){
            
            data[i]     += r;  // R
            data[i + 1] += g;  // G
            data[i + 2] += b;  // B
        }
        return data;                    
    }

}
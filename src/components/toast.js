function show() {
  const loader = document.querySelector('.uiLoadingBlock')
  if (loader) {
    loader.setAttribute('class', 'uiLoadingBlock show')
    return 
  }
  const html_str = `<style>${css()}</style><div class="uiLoadingCnt">
                        <i class="uiLoadingBright"></i>
                    </div>`
  const div = document.createElement('div');
  div.setAttribute('class', 'uiLoadingBlock show')
  div.innerHTML = html_str
  document.body.appendChild(div)
}

function hide() {
  const loader = document.querySelector('.uiLoadingBlock')
  if (!loader) return
  loader.setAttribute('class', 'uiLoadingBlock')
}

function css() {
  return `.loading{
	display: flex;
	box-pack: center;
	box-align: center;
	text-align: center;
	height: 40px;
}
.uiLoading{
	width: 20px;
	height: 20px;
	display: block;
	background: url("../assets/img/loading_sprite.png");
	background-size: auto 20px;
  animation: am-rotate 1s steps(12) infinite;

}
.uiLoadingBright{
    width: 37px;
    height: 37px;
    display: block;
    background-image: url("data:image/png;base64,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");
    background-size: auto 37px;
    animation: am-rotate2 1s steps(12) infinite;

}
.loading .uiLoading{margin: 10px;}
.uiLoadingBlock{
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100000;
    display:flex;
    align-items: center;
    justify-content: center;
    box-orient: horizontal;
    box-pack: center;
    box-align: center;
    background: rgba(0,0,0,.4);
    background: rgba(0,0,0,0);
    display:none;
    
}

.uiLoadingBlock .uiLoadingCnt{
    width: 86px;
    height: 86px;
    display: flex;
    text-align: center;
    align-items: center;
    background: rgba(0,0,0,.65);
    border-radius: 6px;
    color: #fff;
    
}
.uiLoadingBlock .uiLoadingBright{
    margin:0 auto
}

.uiLoadingBlock.show{
    display: flex;
}

@-webkit-keyframes am-rotate {
    from {
    	background-position: 0 0;
    }

    to {
        background-position: -240px 0;
    }
}
@-webkit-keyframes am-rotate2 {
    from {
    	background-position: 0 0;
    }

    to {
        background-position: -444px 0;
    }
}`
}

export default {
  show,
  hide
}
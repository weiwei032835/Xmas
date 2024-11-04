//片段 fnBase64ToBlob(b64Data, contentType, sliceSize) (base64字串, 檔案類型, 片段大小)
//有data:image/png;base64,的話切檔頭 myBase64.split(',')[1]
function fnBase64ToBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

//片段 亂數
function fnRandom(argMin, argMax) {
    return Math.round(argMin + Math.random() * (argMax - argMin));
};


$(function () {

	//主選單 nav============================
	$(".nav button").on("click", function () {
		let iNo = $(this).index();
		// current
		$(".nav button").removeClass("current").eq(iNo).addClass("current");
		$(".menu").hide().eq(iNo).show().addClass("active");
	});

	//主選單 初始 (選背景色)
	$(".nav button").eq(0).trigger("click");

	//.menu 次選單 =========================
	$(".menu ul li").on("click", function () {
		// current
		$(this).siblings().removeClass("current");
		$(this).addClass("current");
	});
 
	//畫布 初始寬高 =========================
	let oldFabricW = 414;
	let oldFabricH = 414;

	//畫布 
	let myFabric_1 = new fabric.Canvas("myCanvas_1", {
		width: oldFabricW, //寬高
		height: oldFabricH, //寬高
		backgroundColor: "#8f2626", //背景色
		selection: false, //能拖拉框選
		preserveObjectStacking:true, //維持圖層順序，選到不會移上來
	});

	//畫布 rwd
	$(window).on("resize", function () {
        let galleryW = $(".gallery").innerWidth();
        let galleryH = galleryW * 1; // 4:3

        //更新畫布尺寸
        myFabric_1.setDimensions({
            width: galleryW,
            height: galleryH,
        });

        //每次縮小的比率
        let tmpRatio = galleryW / oldFabricW;

        //所有子元件
        var sonArr = myFabric_1.getObjects();
        sonArr.forEach((item) => {
            item.set({
                left: item.left * tmpRatio,
                top: item.top * tmpRatio,
                scaleX: item.scaleX * tmpRatio,
                scaleY: item.scaleY * tmpRatio,
            });
        });

        //寫入畫布寬 (舊寬=新寬)
        oldFabricW = galleryW;
        myFabric_1.renderAll();
    });

	//畫布 觸發 rwd
	$(window).trigger("resize");

	//背景色 更換 ===================
	$(".menu.bg li").on("click", function () {
		myFabric_1.backgroundColor = $(this).data("cr");
		myFabric_1.requestRenderAll(); //需重新渲染
	});

	//主題 初始 ===========================
	let myTheme = null;
	fabric.util.loadImage("images/theme_0.png", function (argImg) {
		myTheme = new fabric.Image(argImg, {
			width: argImg.width,
			height: argImg.height,
			selectable: false, //不能選取
		});
		myFabric_1.add(myTheme);
		myTheme.scaleToWidth(myFabric_1.width);
		myFabric_1.centerObject(myTheme); //置中
		fnSendToBack(); //主題 邊框 到最下面
	});

	//主題 自行上傳圖片
	$(".menu.theme li").eq(0).on("click", function () {
		//裁圖模組 寬828px 正方形
		fnFabricCrop({ genWidth: 828, ratio: 1 }, function (argBlobSrc) {
			fabric.util.loadImage(argBlobSrc, function (argImg) {
				myTheme.setElement(argImg);
				myTheme.scaleToWidth(myFabric_1.width);
				myFabric_1.centerObject(myTheme); //置中
				fnSendToBack(); //主題 邊框 到最下面
				myFabric_1.renderAll();
				$(".menu.theme li").eq(0).css({backgroundImage:`url(${argBlobSrc})`});
			});
		});
	});


	//主題 更換
	$(".menu.theme li").slice(1).on("click", function () {
		let tmpUrl = $(this).data("theme-url");
		fabric.util.loadImage(`images/${tmpUrl}`, function (argImg) {
			myTheme.setElement(argImg);
			myTheme.scaleToWidth(myFabric_1.width);
			myFabric_1.centerObject(myTheme); //置中
			fnSendToBack(); //主題 邊框 到最下面
			myFabric_1.renderAll();
		});
	});

	//邊框 初始 =================================== 
	let myFrame = null;
	fabric.util.loadImage("images/frame_3.png", function (argImg) {
		myFrame = new fabric.Image(argImg, {
			width: argImg.width,
			height: argImg.height,
			hasControls:false, //不能編輯
			selectable:false,//是否被選取
			perPixelTargetFind:true, //點穿透明 png svg
			padding: 0,
		});
		myFabric_1.add(myFrame);
		myFrame.scaleToWidth(myFabric_1.width);
		myFabric_1.centerObject(myFrame); //置中
		fnSendToBack(); //主題 邊框 到最下面
	});

	//邊框 更換
	$(".menu.frame li").on("click", function () {
		let tmpUrl = $(this).data("frame-url");

		fabric.util.loadImage(`images/${tmpUrl}`, function (argImg) {
			myFrame.setElement(argImg);
			myFabric_1.renderAll();
			fnSendToBack(); //主題 邊框 到最下面
		});
	});

	//裝飾 =========================
	$(".menu.deco li").on("click", function () {
		let tmpUrl = $(this).data("deco-url");
		fabric.util.loadImage(`images/${tmpUrl}`, function (argImg) {
			let tmpDeco = new fabric.Image(argImg, {
				width: argImg.width,
				height: argImg.height,
				perPixelTargetFind: true, //點穿透明
				padding: 0,
			});

			tmpDeco.set({
				left: fnRandom(0, myFabric_1.width * 0.8),
				top: fnRandom(0, myFabric_1.height * 0.8),
			});

			//把手控制點 等比
			tmpDeco.setControlsVisibility({
				mt: false,
				mb: false,
				ml: false,
				mr: false,
				//deleteControl: false, //把手刪除
			});

			myFabric_1.add(tmpDeco);
			tmpDeco.scaleToWidth(myFabric_1.width * 0.2);

			//加刪除icon
			tmpDeco.controls.deleteControl = fnAddDelIcon();
			//加旋轉icon
			tmpDeco.controls.mtr = fnAddRotateIcon();
			myFabric_1.setActiveObject(tmpDeco); //設為選取
			fnSendToBack(); //主題 邊框 到最下面
		});
	});

	

	//祝福 =========================
	$(".menu.wish li").on("click", function () {
		let tmpUrl = $(this).data("wish-url");
		fabric.util.loadImage(`images/${tmpUrl}`, function (argImg) {
			let tmpWish = new fabric.Image(argImg, {
				width: argImg.width,
				height: argImg.height,
				perPixelTargetFind: true, //點穿透明
				padding: 0,
			});

			//初始位置
			tmpWish.set({
				left: fnRandom(0, myFabric_1.width * 0.8),
				top: fnRandom(0, myFabric_1.height * 0.8),
			});

			//把手控制點 等比
			tmpWish.setControlsVisibility({
				mt: false,
				mb: false,
				ml: false,
				mr: false,
				//deleteControl: false, //把手刪除
			});

			myFabric_1.add(tmpWish);
			tmpWish.scaleToWidth(myFabric_1.width * 0.4);
			//加刪除icon
			tmpWish.controls.deleteControl = fnAddDelIcon();
			//加旋轉icon
			tmpWish.controls.mtr = fnAddRotateIcon();
			myFabric_1.setActiveObject(tmpWish); //設為選取
			fnSendToBack(); //主題 邊框 到最下面
		});
	});

	//祝福 初始
	$(".menu.wish li").eq(3).trigger("click");


	//主題 邊框 到最下面(圖片元件非同步。造成順序不正確)
	function fnSendToBack(){

		if(myFrame){
			//console.log("邊框 往後");
			myFrame.sendBackwards();
		}

		if(myTheme){
			//console.log("主題 往後");
			myTheme.sendBackwards();
		}
		
		myFabric_1.renderAll();
		
	}
	

	//截圖 並打開對話窗 =================================
	$(".btn_gen").click(function (e) {
		let tmpDataUrl = myFabric_1.toDataURL({
			width: myFabric_1.width,
			height: myFabric_1.height,
			left: 0,
			top: 0,
			format: "jpeg",
			quality: 0.9,
			multiplier: 828 / myFabric_1.width, //縮放倍數
		});

		//轉blob
		let tmpBlob = fnBase64ToBlob(tmpDataUrl.split(",")[1], "image/png");
		let tmpSrc = URL.createObjectURL(tmpBlob); //建立blob連結

		//對話窗
		$(".dialog_download").show();

		//下載圖片
		$(".dialog_download a.btn_download img").attr({ src: tmpSrc });
		$(".dialog_download a.btn_download").attr({ href: tmpSrc });
	});

	//關閉對話窗
	$(".dialog_download .btn_close").click(function () {
		$(".dialog_download").hide();
	});
});
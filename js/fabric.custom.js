//編輯框的樣式
fabric.Object.prototype.set({
	//hasControls:false, //不能編輯
	//selectable:false,//是否被選取
	borderColor: "rgba(255,255,255,.7)", //編輯框色
	borderOpacityWhenMoving:.2, //編輯框 移動中 透明度
	borderScaleFactor:2, //編輯框寬
	borderDashArray: [10, 5], //編輯框虛線
	padding:0,//編輯框內距
	transparentCorners: false, //false 編輯把手才能填滿
	cornerColor:"#000",//編輯把手
	cornerStrokeColor: "#fff", // 控制點邊框色
	cornerSize:10, //編輯把手,
	//cornerStyle: "circle" //編輯把手 圓形
});

/*
新增 Del Rotate 圖標 (拷貝出獨立的 controls prototype)
調用方式：
xxx.controls = fabric.util.object.clone(fabric.Object.prototype.controls);
xxx.controls.deleteControl = fnAddDelIcon();
xxx.controls.mtr = fnAddRotateIcon();
*/
//新增 Del icon 圖標
function fnAddDelIcon() {
	return new fabric.Control({
		x: 0.5,
		y: -0.5,
		offsetY: -39,
		offsetX: -5,
		cursorStyle: "pointer",
		cornerSize: 20,
		//刪除圖標
		render: function (ctx, left, top, styleOverride, fabricObject) {
			if (!this.getVisibility(fabricObject)) return;
			var deleteImg = document.createElement("img");
			deleteImg.src = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3C!-- Created with Inkscape (http://www.inkscape.org/) --%3E%3Csvg xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' version='1.0' width='512' height='512' id='svg2'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D%0A%3C/style%3E%3Cg%3E%3Cpath d='M256.21,477c-58.76,0-114.01-22.88-155.56-64.44S36.21,315.76,36.21,257c0-58.76,22.88-114.01,64.44-155.56 S197.44,37,256.21,37s114.01,22.88,155.56,64.44c41.55,41.55,64.44,96.8,64.44,155.56c0,58.76-22.88,114.01-64.44,155.56 S314.97,477,256.21,477z'/%3E%3Cpath class='st0' d='M256.21,67c50.75,0,98.46,19.76,134.35,55.65c35.89,35.89,55.65,83.6,55.65,134.35s-19.76,98.46-55.65,134.35 C354.67,427.24,306.96,447,256.21,447s-98.46-19.76-134.35-55.65C85.97,355.46,66.21,307.75,66.21,257s19.76-98.46,55.65-134.35 C157.74,86.76,205.46,67,256.21,67 M256.21,7c-138.07,0-250,111.93-250,250s111.93,250,250,250s250-111.93,250-250 S394.28,7,256.21,7L256.21,7z'/%3E%3C/g%3E%3Cg%3E%3Cpolygon class='st0' points='339.64,139.64 256.21,223.06 172.78,139.64 138.84,173.57 222.27,257 138.84,340.43 172.78,374.36 256.21,290.94 339.64,374.36 373.57,340.43 290.15,257 373.57,173.57 '/%3E%3C/g%3E%3C/svg%3E";
			var size = this.cornerSize;
			ctx.save();
			ctx.translate(left, top);
			ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
			ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
			ctx.restore();
		},
		//刪除當前
		mouseUpHandler: function (eventData, transform) {
			let ta = transform.target;
			let taCanvas = ta.canvas;
			taCanvas.remove(ta);
			taCanvas.requestRenderAll();
		},
	});
}

//新增 Rotate icon 圖標
function fnAddRotateIcon() {
	
	return new fabric.Control({
		x: 0,
		y: -0.5,
		offsetY: -40,
		cursorStyle: 'crosshair',
		actionHandler: fabric.controlsUtils.rotationWithSnapping,
		actionName: 'rotate',
		
		render: function (ctx, left, top, styleOverride, fabricObject) {
			var img = document.createElement('img');
			img.src = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3C!-- Created with Inkscape (http://www.inkscape.org/) --%3E%3Csvg xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' version='1.0' width='512' height='512' id='svg2'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D .st1%7Bfill:none;%7D%0A%3C/style%3E%3Cg%3E%3Cpath d='M256.21,477c-58.76,0-114.01-22.88-155.56-64.44S36.21,315.76,36.21,257c0-58.76,22.88-114.01,64.44-155.56 S197.44,37,256.21,37s114.01,22.88,155.56,64.44c41.55,41.55,64.44,96.8,64.44,155.56c0,58.76-22.88,114.01-64.44,155.56 S314.97,477,256.21,477z'/%3E%3Cpath class='st0' d='M256.21,67c50.75,0,98.46,19.76,134.35,55.65c35.89,35.89,55.65,83.6,55.65,134.35s-19.76,98.46-55.65,134.35 C354.67,427.24,306.96,447,256.21,447s-98.46-19.76-134.35-55.65C85.97,355.46,66.21,307.75,66.21,257s19.76-98.46,55.65-134.35 C157.74,86.76,205.46,67,256.21,67 M256.21,7c-138.07,0-250,111.93-250,250s111.93,250,250,250s250-111.93,250-250 S394.28,7,256.21,7L256.21,7z'/%3E%3C/g%3E%3Cg%3E%3Cpath class='st1' d='M-138,95'/%3E%3C/g%3E%3Cpath class='st0' d='M357,160c-26.65-32.22-58.86-44.76-101-44.76c-37.63,0-73.01,14.65-99.62,41.26s-41.26,61.99-41.26,99.62 s14.65,73.01,41.26,99.62C182.99,382.35,218.37,397,256,397v-34.5c-58.66,0-106.38-47.72-106.38-106.38S197.34,149.74,256,149.74 c27.64,0,55.37,12.47,75,31.26l-35,31l105,26l-15-107L357,160z'/%3E%3C/svg%3E";
			var size = this.cornerSize;
			ctx.save();
			
			
			ctx.translate(left, top);
			ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
			ctx.drawImage(img, -size / 2, -size / 2, size, size);
			ctx.restore();
		},
		cornerSize: 20,
		withConnection: true,
		
	});
}

//編輯把手 刪除功能
fabric.Textbox.prototype.controls.deleteControl = fabric.Object.prototype.controls.deleteControl = new fabric.Control({
	x: -.5, // 位于对象的最左边
    y: -.5, // 位于对象的最上边
    offsetX: 0, // 可选的水平微调
    offsetY: 0, // 可选的垂直微调
	cursorStyle: "pointer",
	cornerSize: 24,
	//刪除圖標
	render: function (ctx, left, top, styleOverride, fabricObject) {
		if (!this.getVisibility(fabricObject)) return;
		var deleteImg = document.createElement("img");
		deleteImg.src = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3C!-- Created with Inkscape (http://www.inkscape.org/) --%3E%3Csvg xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' version='1.0' width='512' height='512' id='svg2'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D%0A%3C/style%3E%3Cg%3E%3Cpath d='M256.21,477c-58.76,0-114.01-22.88-155.56-64.44S36.21,315.76,36.21,257c0-58.76,22.88-114.01,64.44-155.56 S197.44,37,256.21,37s114.01,22.88,155.56,64.44c41.55,41.55,64.44,96.8,64.44,155.56c0,58.76-22.88,114.01-64.44,155.56 S314.97,477,256.21,477z'/%3E%3Cpath class='st0' d='M256.21,67c50.75,0,98.46,19.76,134.35,55.65c35.89,35.89,55.65,83.6,55.65,134.35s-19.76,98.46-55.65,134.35 C354.67,427.24,306.96,447,256.21,447s-98.46-19.76-134.35-55.65C85.97,355.46,66.21,307.75,66.21,257s19.76-98.46,55.65-134.35 C157.74,86.76,205.46,67,256.21,67 M256.21,7c-138.07,0-250,111.93-250,250s111.93,250,250,250s250-111.93,250-250 S394.28,7,256.21,7L256.21,7z'/%3E%3C/g%3E%3Cg%3E%3Cpolygon class='st0' points='339.64,139.64 256.21,223.06 172.78,139.64 138.84,173.57 222.27,257 138.84,340.43 172.78,374.36 256.21,290.94 339.64,374.36 373.57,340.43 290.15,257 373.57,173.57 '/%3E%3C/g%3E%3C/svg%3E";
		var size = this.cornerSize;
		ctx.save();
		ctx.translate(left, top);
		ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
		ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
		ctx.restore();
	}, 
	//刪除當前
	mouseUpHandler:function (eventData, transform) { 
		let ta = transform.target;
		let taCanvas = ta.canvas;
		taCanvas.remove(ta);
		taCanvas.requestRenderAll();
	},
});





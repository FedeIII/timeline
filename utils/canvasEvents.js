export default class CanvasEvents {
  static writeMessage(context, message) {
    context.font = "18pt Calibri";
    context.fillStyle = "black";
    context.fillText(message, 10, 25);
  }

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.drawStage = undefined;
    this.listening = false;

    // desktop flags
    this.mousePos = null;
    this.mouseDown = false;
    this.mouseUp = false;
    this.mouseOver = false;
    this.mouseMove = false;

    // mobile flags
    this.touchPos = null;
    this.touchStart = false;
    this.touchMove = false;
    this.touchEnd = false;

    // Region Events
    this.currentRegion = null;
    this.regionIndex = 0;
    this.lastRegionIndex = -1;
    this.mouseOverRegionIndex = -1;
  }

  getContext() {
    return this.context;
  }

  getCanvas() {
    return this.canvas;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getCanvasPos() {
    let obj = this.getCanvas();
    let top = 0;
    let left = 0;
    while (obj.tagName != "BODY") {
      top += obj.offsetTop;
      left += obj.offsetLeft;
      obj = obj.offsetParent;
    }
    return {
      top: top,
      left: left
    };
  }

  setDrawStage(func) {
    this.drawStage = func;
    this.listen();
  }

  reset(evt) {
    if (!evt) {
      evt = window.event;
    }

    this.setMousePosition(evt);
    this.setTouchPosition(evt);
    this.regionIndex = 0;

    if (!this.animating && this.drawStage !== undefined) {
      this.drawStage();
    }

    // desktop flags
    this.mouseOver = false;
    this.mouseMove = false;
    this.mouseDown = false;
    this.mouseUp = false;

    // mobile touch flags
    this.touchStart = false;
    this.touchMove = false;
    this.touchEnd = false;
  }

  listen() {
    const that = this;

    if (this.drawStage !== undefined) {
      this.drawStage();
    }

    // desktop events
    this.canvas.addEventListener("mousedown", evt => {
      that.mouseDown = true;
      that.reset(evt);
    }, false);

    this.canvas.addEventListener("mousemove", evt => {
      that.reset(evt);
    }, false);

    this.canvas.addEventListener("mouseup", evt => {
      that.mouseUp = true;
      that.reset(evt);
    }, false);

    this.canvas.addEventListener("mouseover", evt => {
      that.reset(evt);
    }, false);

    this.canvas.addEventListener("mouseout", evt => {
      that.mousePos = null;
    }, false);

    // mobile events
    this.canvas.addEventListener("touchstart", evt => {
      evt.preventDefault();
      that.touchStart = true;
      that.reset(evt);
    }, false);

    this.canvas.addEventListener("touchmove", evt => {
      evt.preventDefault();
      that.reset(evt);
    }, false);

    this.canvas.addEventListener("touchend", evt => {
      evt.preventDefault();
      that.touchEnd = true;
      that.reset(evt);
    }, false);
  }

  getMousePos(evt) {
    return this.mousePos;
  }

  getTouchPos(evt) {
    return this.touchPos;
  }

  setMousePosition(evt) {
    const mouseX = evt.clientX - this.getCanvasPos().left + window.pageXOffset;
    const mouseY = evt.clientY - this.getCanvasPos().top + window.pageYOffset;
    this.mousePos = {
      x: mouseX,
      y: mouseY
    };
  }

  setTouchPosition(evt) {
    if (evt.touches !== undefined && evt.touches.length == 1) { // Only deal with one finger
      const touch = evt.touches[0]; // Get the information for finger #1
      const touchX = touch.pageX - this.getCanvasPos().left + window.pageXOffset;
      const touchY = touch.pageY - this.getCanvasPos().top + window.pageYOffset;

      this.touchPos = {
        x: touchX,
        y: touchY
      };
    }
  }

  beginRegion() {
    this.currentRegion = {};
    this.regionIndex++;
  }

  addRegionEventListener(type, func) {
    let event = (type.indexOf('touch') == -1) ? `on${type}` : type;
    this.currentRegion[event] = func;
  }

  removeRegionEventListener(type) {
    let event = (type.indexOf('touch') == -1) ? `on${type}` : type;
    delete this.currentRegion[event]
  }

  closeRegion() {
    const pos = this.touchPos || this.mousePos;

    if (pos !== null && this.context.isPointInPath(pos.x, pos.y)) {
      if (this.lastRegionIndex != this.regionIndex) {
        this.lastRegionIndex = this.regionIndex;
      }

      // handle onmousedown
      if (this.mouseDown && this.currentRegion.onmousedown !== undefined) {
        this.currentRegion.onmousedown();
        this.mouseDown = false;
      }

      // handle onmouseup
      else if (this.mouseUp && this.currentRegion.onmouseup !== undefined) {
        this.currentRegion.onmouseup();
        this.mouseUp = false;
      }

      // handle onmouseover
      else if (!this.mouseOver && this.regionIndex != this.mouseOverRegionIndex && this.currentRegion.onmouseover !== undefined) {
        this.currentRegion.onmouseover();
        this.mouseOver = true;
        this.mouseOverRegionIndex = this.regionIndex;
      }

      // handle onmousemove
      else if (!this.mouseMove && this.currentRegion.onmousemove !== undefined) {
        this.currentRegion.onmousemove();
        this.mouseMove = true;
      }

      // handle touchstart
      if (this.touchStart && this.currentRegion.touchstart !== undefined) {
        this.currentRegion.touchstart();
        this.touchStart = false;
      }

      // handle touchend
      if (this.touchEnd && this.currentRegion.touchend !== undefined) {
        this.currentRegion.touchend();
        this.touchEnd = false;
      }

      // handle touchmove
      if (!this.touchMove && this.currentRegion.touchmove !== undefined) {
        this.currentRegion.touchmove();
        this.touchMove = true;
      }

    }
    else if (this.regionIndex == this.lastRegionIndex) {
      this.lastRegionIndex = -1;
      this.mouseOverRegionIndex = -1;

      // handle mouseout condition
      if (this.currentRegion.onmouseout !== undefined) {
        this.currentRegion.onmouseout();
      }
    }
  }
}


export let Toast = {
    LENGTH_LONG: 3.5,
    LENGTH_SHORT: 2,
    CENTER: 0,
    TOP: 1,
    TOP_LEFT: 2,
    LEFT: 3,
    BOTTOM_LEFT: 4,
    BOTTOM: 5,
    BOTTOM_RIGHT: 6,
    RIGHT: 7,
    TOP_RIGHT: 8,      
    makeText(text, duration) {
        let _text;
        let _duration;
        let _gravity;
        let _x = 0;
        let _y = 0;
        let ToastObject = function (tText, tDuration) {
            _text = tText;
            _duration = tDuration;
            //
            this.setGravity = function (gravity, x, y) {
                _gravity = gravity;
                _x = x;
                _y = y;
            }
            //
            this.show = function () {
                // 加载背景纹理
                if (Toast.bgSpriteFrame === undefined) {
                    self = this;
                    (function () {
                        cc.loader.load({ 'uuid': 'b43ff3c2-02bb-4874-81f7-f2dea6970f18' },
                            function (error, result) {
                                if (error) {
                                    cc.error(error);
                                    return;
                                }
                                Toast.bgSpriteFrame = new cc.SpriteFrame(result);
                                Toast.bgSpriteFrame.insetTop = 3;
                                Toast.bgSpriteFrame.insetBottom = 3;
                                Toast.bgSpriteFrame.insetLeft = 4;
                                Toast.bgSpriteFrame.insetRight = 4;
                                //加载完再调用
                                self.show();
                            })
                    })();
                    return;
                }
                // canvas
                var canvas = cc.director.getScene().getComponentInChildren(cc.Canvas);
                var width = canvas.node.width;
                var height = canvas.node.height;
                if (_duration === undefined) {
                    _duration = LENGTH_SHORT;
                }
                // 背景图片设置
                let bgNode = new cc.Node(); 
                
                let bgSprite = bgNode.addComponent(cc.Sprite);
                bgNode.color = cc.color(0,0,0,200);
                bgNode.opacity=200;
                bgSprite.type = cc.Sprite.Type.SLICED;  
                let bgLayout = bgNode.addComponent(cc.Layout);
                bgLayout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
    
                // Lable文本格式设置
                let textNode = new cc.Node();
                let textLabel = textNode.addComponent(cc.Label);
                textLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                textLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
                textLabel.fontSize = 18;
                textLabel.string = _text;
    
                //背景图片与文本内容的间距
                let hPadding = textLabel.fontSize / 4;
                let vPadding = 1;
                bgLayout.paddingLeft = hPadding;
                bgLayout.paddingRight = hPadding;
                bgLayout.paddingTop = vPadding;
                bgLayout.paddingBottom = vPadding;
    
                // 当文本宽度过长时，设置为自动换行格式
                if (_text.length * textLabel.fontSize > width / 3) {
                    textNode.width = width / 3;
                    textLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
                }
    
                bgNode.addChild(textNode);
                if (Toast.bgSpriteFrame) {
                    bgSprite.spriteFrame = Toast.bgSpriteFrame;
                }
                var pos=cc.p(0,0);
                // gravity 设置Toast显示的位置
                if (_gravity == Toast.CENTER) {
                    pos.y = 0;
                    pos.x = 0;
                } else if (_gravity == Toast.TOP) {
                    pos.y = pos.y + (height / 5) * 2;
                } else if (_gravity == Toast.TOP_LEFT) {
                    pos.y = pos.y + (height / 5) * 2;
                    pos.x = pos.x + (width / 5);
                } else if (_gravity == Toast.LEFT) {
                    pos.x = pos.x + (width / 5);
                } else if (_gravity == Toast.BOTTOM_LEFT) {
                    pos.y = pos.y - (height / 5) * 2;
                    pos.x = pos.x + (width / 5);
                } else if (_gravity == Toast.BOTTOM) {
                    pos.y = pos.y - (height / 5) * 2;
                } else if (_gravity == Toast.BOTTOM_RIGHT) {
                    pos.y = pos.y - (height / 5) * 2;
                    pos.x = pos.x - (width / 5);
                } else if (_gravity == Toast.RIGHT) {
                    pos.x = pos.x - (width / 5);
                } else if (_gravity == Toast.TOP_RIGHT) {
                    pos.y = pos.y + (height / 5) * 2;
                    pos.x = pos.x - (width / 5);
                } else {
                    // 默认情况 BOTTOM
                    pos.y = pos.y - (height / 5) * 2;
                }
                pos.x = pos.x + _x;
                pos.y =pos.y + _y; 
                bgNode.y=-width/2;
                canvas.node.addChild(bgNode);
    
                let finished = cc.callFunc(function (target) {
                    bgNode.destroy();
                }, self);
                let action = cc.sequence(cc.moveTo(0.5,cc.p(pos.x,pos.y)),cc.moveBy(_duration,cc.p(0,0)),cc.fadeOut(0.3), finished);
                bgNode.runAction(action);
            }
        }
    
        return new ToastObject(text, duration);
    },
    showText (text, duration) {
        Toast.makeText(text, duration).show();
    }
}
 
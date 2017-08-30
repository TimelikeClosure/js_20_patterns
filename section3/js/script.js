(function(win, $){
    function clone(src,out){
        for(var attr in src.prototype){
            out.prototype[attr] = src.prototype[attr];
        }
    }
    function Circle(){
        this.item = $('<div class="circle"></div>');
    }
    Circle.prototype.color = function(clr){
        this.item.css('background', clr);
    };

    Circle.prototype.move = function(left, top){
                this.item.css('left',left);
                this.item.css('top',top);
    };

    Circle.prototype.get = function(){
        return this.item;
    };

    function Rect(){
        this.item = $('<div class="rect"></div>');
    }
    clone(Circle, Rect);


    function RedCircleBuilder(){
        this.item = new Circle();
        this.init();
    }
    RedCircleBuilder.prototype.init = function() {
        //NOTHING
    };

    RedCircleBuilder.prototype.get = function() {
        return this.item;
    };

    function BlueCircleBuilder(){
        this.item = new Circle();

        this.init();
    }

    BlueCircleBuilder.prototype.init = function() {
        this.item.color("blue");

        var rect = new Rect();
                rect.color("yellow");
                rect.move(40,40);

        this.item.get().append(rect.get());
    };
    BlueCircleBuilder.prototype.get = function() {
        return this.item;
    };


    var ShapeFactory = function(){
            this.types = {};
            this.create = function(type){
                return new this.types[type]().get();
            };

            this.register = function(type, cls){
                if(cls.prototype.init && cls.prototype.get){
                        this.types[type] = cls;
                }
            }
    };


    var ShapeGeneratorSingleton = (function(){
        var instance;

        function init(){
            var _aShape = [],
                _stage,
                _sf = new ShapeFactory();

            function registerShape(name, cls){
                _sf.register(name, cls);
            }

            function setStage(stage){
                _stage = stage;
            }

            function create(left, top,type){
                var shape = _sf.create(type);
                shape.move(left, top);
                return shape;
            }

            function add(shape){
                _stage.append(shape.get());
                _aShape.push(shape);
            }

            function index(){
                return _aShape.length;
            }

            return {
                index:index,
                create:create,
                add:add,
                register: registerShape,
                setStage: setStage
            };
        }

        return {
            getInstance: function(){
                if(!instance){
                    instance = init();
                }

                return instance;
            }
        }

    })();

    $(win.document).ready(function(){
        var sg = ShapeGeneratorSingleton.getInstance();
        sg.register('red', RedCircleBuilder);
        sg.register('blue', BlueCircleBuilder);
        var stage = $('.advert');
        sg.setStage(stage);
        stage.click(function(e){
            var circle = sg.create(e.pageX-25, e.pageY-25,"red");
            sg.add(circle);
        });

        $(document).keypress(function(e){
            if(e.key==='a'){
                var circle = sg.create(
                    Math.floor(Math.random()*600),
                    Math.floor(Math.random()*600),
                    "blue"
                );
                sg.add(circle);
            }
        });
    });

})(window, jQuery);
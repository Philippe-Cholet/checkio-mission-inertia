//Dont change it
requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function inertiaCanvas(dom, input, data) {

            if (! data || ! data.ext) {
                return
            }

            $(dom.parentNode).find(".answer").remove()

            const result = data.ext.result
            const output = data.out
            const result_addon_00 = data.ext.result_addon[0]
            const result_addon_01 = data.ext.result_addon[1]

            const [grid, start] = input
            const width = grid[0].length
            const height = grid.length

            /*----------------------------------------------*
             *
             * too big
             *
             *----------------------------------------------*/
            if (width >= 30) {
                $(dom).addClass('output').prepend(
                    '<div>' + result_addon_00 + '</div>').css(
                        {'border': '0','display': 'block',})
                return
            }

            /*----------------------------------------------*
             *
             * paper
             *
             *----------------------------------------------*/
            let max_width = 350
            const os = 10
            const SIZE = (max_width - os*2) / Math.max(4, width)
            max_width = Math.min(350, SIZE*width+os*2)
            const paper = Raphael(dom, max_width, SIZE*height+os*2, 0, 0)

            /*----------------------------------------------*
             *
             * message
             *
             *----------------------------------------------*/
            if (! result) {
                $(dom).addClass('output').prepend(
                    '<div>' + result_addon_00 + '</div>').css(
                        {'border': '0','display': 'block',})
            }

            /*----------------------------------------------*
             *
             * attr
             *
             *----------------------------------------------*/
            const attr = {
                grid: {
                    empty: {
                        'stroke': '#2080B8',
                    },
                    block: {
                        'stroke': '#2080B8',
                        'fill': '#8FC7ED',
                    },
                    rough: {
                        'stroke': '#2080B8',
                    },
                },
                bomb: {
                    'fill': 'black',
                },
                gem: {
                    'stroke-width': ((5/width)*3)+'px',
                    'fill': 'orange',
                },
                rough: {
                    'stroke-width': ((5/width)*3)+'px',
                    'stroke-linecap': 'round',
                },
                you: {
                    face: {
                        'stroke-width': 5/width+'px',
                        'fill': '#faba00',
                    },
                    eye: {
                        'stroke-width': 5/width+'px',
                        'fill': 'black',
                    },
                    mouth: {
                        'stroke-width': 5/width+'px',
                    },
                },
            }

            /*----------------------------------------------*
             *
             * gem
             *
             *----------------------------------------------*/
            const gem = 'M 0 0 l 12 -12 l 24 0 l 12 12 l -24 24 z'

            /*----------------------------------------------*
             *
             * bomb
             *
             *----------------------------------------------*/
            function bomb(scale) {
                const b_set = paper.set()
                b_set.push(paper.circle(os+(32)*scale,
                    os+(39)*scale, 19*scale).attr(attr.bomb))
                b_set.push(paper.rect(os+(28)*scale, 
                    os+(15)*scale, 8*scale, 5*scale).attr(attr.bomb))
                b_set.push(paper.rect(os+(31)*scale, 
                    os+(9)*scale, 2*scale, 5*scale).attr(attr.bomb))
                return b_set
            }

            /*----------------------------------------------*
             *
             * you
             *
             *----------------------------------------------*/
            function you(scale) {
                const y_set = paper.set()
                y_set.push(paper.circle(os+32*scale,
                    os+33*scale, 21*scale).attr(attr.you.face))
                y_set.push(paper.circle(os+25*scale, 
                    os+29*scale, 2*scale).attr(attr.you.eye))
                y_set.push(paper.circle(os+39*scale, 
                    os+29*scale, 2*scale).attr(attr.you.eye))
                y_set.push(paper.path(['m', os+24*scale, 
                    os+40*scale, 'a', 8*scale, 
                    5*scale, 0, 0, 0, 16*scale, 0]).attr(attr.you.mouth))
                return y_set
            }

            /*----------------------------------------------*
             *
             * rough
             *
             *----------------------------------------------*/
            function rough(scale) {
                const r_set = paper.set()
                r_set.push(paper.path(['m', os+22*scale, 
                    os+22*scale, 'l', 22*scale, 0]).attr(attr.rough))
                r_set.push(paper.path(['m', os+22*scale, 
                    os+32*scale, 'l', 22*scale, 0]).attr(attr.rough))
                r_set.push(paper.path(['m', os+22*scale, 
                    os+42*scale, 'l', 22*scale, 0]).attr(attr.rough))
                return r_set
            }

            /*----------------------------------------------*
             *
             * draw grid
             *
             *----------------------------------------------*/
            const SCALE = width/5
            const gems = {}
            let token = null

            for (let r = 0; r < height; r += 1) {
                for (let c = 0; c < width; c += 1) {
                    const cell = paper.rect(SIZE*c+os, 
                        SIZE*r+os, SIZE, SIZE)
                    if (grid[r][c] === 'X') {
                        cell.attr(attr.grid.block)
                    } else {
                        cell.attr(attr.grid.empty)
                    }

                    if (grid[r][c] === '$') {
                        const g = paper.path(gem).attr(
                            attr.gem).translate(os-24, os-6).scale(
                                1/SCALE, 1/SCALE).translate(
                                    (SIZE/2)*SCALE, (SIZE/2)*SCALE)
                        g.translate(c*SIZE*SCALE, r*SIZE*SCALE).attr(
                            attr.gem)
                        gems[r*100+c] = g

                    } else if (grid[r][c] === '*') {
                        bomb(1/SCALE).translate(c*SIZE, r*SIZE)

                    } else if (grid[r][c] === '.') {
                        rough(1/SCALE).translate(c*SIZE, r*SIZE)

                    }
                }
            }

            token = you(1/SCALE).translate(start[1]*SIZE, start[0]*SIZE)

            /*----------------------------------------------*
             *
             * move
             *
             *----------------------------------------------*/
            const moves = result_addon_01

            let [y, x] = start
            let i = 0

            function your_move() {
                if (i === moves.length) {
                    return
                }

                const [r, c] = moves[i]
                const [dy, dx] = [r-y, c-x]

                let dist = 0
                if (dy*dx !== 0) {
                    dist = Math.sqrt(dy**2+dx**2)
                } else {
                    dist = dy !== 0 ? Math.abs(dy) : Math.abs(dx)
                }

                // get gem
                let [cy, cx] = [y, x]
                while (! (cy === r && cx === c)) {
                    cy += dy === 0 ? 0 : dy / Math.abs(dy)
                    cx += dx === 0 ? 0 : dx / Math.abs(dx)
                    if (gems[cy*100+cx]) {
                        gems[cy*100+cx].animate(
                            {fill: '#dfe8f7', stroke: '#dfe8f7',}, 
                            500*dist*(5/width))
                    }
                }

                i += 1
                y = r
                x = c

                // move you
                token.animate(
                    {'transform': "t " + (c*SIZE) + "," + (r*SIZE) }, 
                    400*dist*(5/width), 
                    your_move
                )
            }

            // start run
            your_move()
        }

        var $tryit;

        var io = new extIO({
            multipleArguments: true,
            functions: {
                python: 'inertia',
                js: 'inertia'
            },
            animation: function($expl, data){
                inertiaCanvas(
                    $expl[0],
                    data.in,
                    data,
                );
            }
        });
        io.start();
    }
);

$(function() {

    var Cube = {

        /**
         * @var Element     Cube container
         */
        $cube: $('#cube'),

        /**
         * @var Element     Scramble button
         */
        $scramble: $('#scramble'),

        /**
         * @var Elements    Collection of sticker divs
         */
        $stickers: $('#cube').find('div[data-sticker]'),

        /**
         * @var Elements    Collection of center stickers
         */
        $centers: $('#cube').find('div[data-center]'),

        /**
         * @var boolean     Determines if the cube is currently being turned
         */
        is_turning: false,

        /**
         * @var integer     The number of moves used to scramble the cube
         */
        scramble_depth: 30,

        /**
         * @var boolean     Determines if the cube has been scrambled or not
         */
        is_scrambled: false,

        /**
         * @var array       The queue of turns waiting to be executed
         */
        queue: [],

        /**
         * @var float       The start time of the scramble
         */
        start_time: 0,

        /**
         * Load the stickers and keep track of their original position.
         */
        init: function() {
            var self = this;

            this.$stickers.each(function() {
                var origin = $(this)
                    .css('font-family')
                    .slice(1, -1);

                $(this)
                    .data('origin', origin)
                    .data('color', $(this).css('background-color'));
            });

            $(document).keypress(function(e) {
                if (e.keyCode == 32 && !self.is_scrambled) {
                    self.scramble();
                    return;
                }

                self.handleKeypress(e);
            });

            this.$cube.find('div[data-face="F"], div[data-face="U"]').swipe({
                swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                    self.handleSwipe($(this), direction);
                }
            });

            this.$scramble.on('click', function() {
                self.scramble();
            })

        },

        /**
         * Determines if the cube is solved
         */
        is_solved: function() {
            if (this.queue.length > 0) return false;

            var is_solved = true,
                faces = this.findAllFaces();

            this.$centers.each(function() {
                var $faces = faces[$(this).data('center')],
                    color = $faces.first().data('color');

                $faces.each(function() {
                    if ($(this).data('color') != color) {
                        is_solved = false;
                        return false;
                    }
                    if (!is_solved) return false;
                });
            });

            this.is_scrambled = !is_solved;
            return is_solved;
        },

        /**
         * Translate keypress events into cube movements
         *
         * @param   event
         */
        handleKeypress: function(e) {
            if ($('.sweet-alert').is(':visible') || !this.is_scrambled) return;

            // Figure out which key we're dealing with
            e.preventDefault();
            var key = String.fromCharCode(event.keyCode).toLowerCase();

            // Face and slice turns (U, l, F, R, B, D, M, E, and S)
            if (key == 'j') this.queue.push('U');
            else if (key == 'f') this.queue.push('U!');
            else if (key == 'd') this.queue.push('L');
            else if (key == 'e') this.queue.push('L!');
            else if (key == 'h') this.queue.push('F');
            else if (key == 'g') this.queue.push('F!');
            else if (key == 'i') this.queue.push('R');
            else if (key == 'k') this.queue.push('R!');
            else if (key == 'q') this.queue.push('B');
            else if (key == 'p') this.queue.push('B!');
            else if (key == 's') this.queue.push('D');
            else if (key == 'l') this.queue.push('D!');
            else if (key == 'b') this.queue.push('M');
            else if (key == 'y') this.queue.push('M!');
            else if (key == 'o') this.queue.push('S');
            else if (key == 'w') this.queue.push('S!');
            else if (key == 'z') this.queue.push('E');
            else if (key == '.') this.queue.push('E!');

            // Cube rotations (X, Y, and Z)
            else if (key == 'u' || key == 't') this.queue.push('X');
            else if (key == 'v' || key == 'n') this.queue.push('X!');
            else if (key == ';') this.queue.push('Y');
            else if (key == 'a') this.queue.push('Y!');
            else if (key == ',') this.queue.push('Z');
            else if (key == 'x') this.queue.push('Z!');

            // Unknown input, do nothing
            else return;

            // Execute the turn
            this.nextTurn();
        },

        /**
         * Translate swipe events into cube movements
         *
         * @param   Element     $sticker
         * @param   string      The direction of the swipe (up, down, left, right)
         */
        handleSwipe: function($sticker, direction) {
            if ($('.sweet-alert').is(':visible') || !this.is_scrambled) return;

            var sticker     = $sticker.data('sticker'),
                left        = direction == 'left',
                right       = direction == 'right',
                up          = direction == 'up',
                down        = direction == 'down',
                vertical    = up || down,
                horizontal  = left || right;

            // Face and slice turns (U, l, F, R, B, D, M, E, and S)
            if ($.inArray(sticker, ['FLU', 'FU', 'FUR']) !== -1 && horizontal) this.queue.push(left ? 'U' : 'U!');
            else if ($.inArray(sticker, ['FDL', 'FD', 'FRD']) !== -1 && horizontal) this.queue.push(left ? 'D!' : 'D');
            else if ($.inArray(sticker, ['UBR', 'UR', 'URF', 'FUR', 'FR', 'FRD']) !== -1 && vertical) this.queue.push(up ? 'R' : 'R!');
            else if ($.inArray(sticker, ['ULB', 'UL', 'UFL', 'FLU', 'FL', 'FDL']) !== -1 && vertical) this.queue.push(up ? 'L!' : 'L');
            else if ($.inArray(sticker, ['UFL', 'UF', 'URF']) !== -1 && horizontal) this.queue.push(left ? 'F!' : 'F');
            else if ($.inArray(sticker, ['ULB', 'UB', 'UBR']) !== -1 && horizontal) this.queue.push(left ? 'B' : 'B!');
            else if ($.inArray(sticker, ['UB', 'UF', 'FU', 'FD']) !== -1 && vertical) this.queue.push(up ? 'M!' : 'M');
            else if ($.inArray(sticker, ['FL', 'FR']) !== -1 && horizontal) this.queue.push(left ? 'E!' : 'E');
            else if ($.inArray(sticker, ['UL', 'UR']) !== -1 && horizontal) this.queue.push(left ? 'S!' : 'S');

            // Cube rotations (X, Y, and Z)
            else if (sticker == 'F') {
                if (up) this.queue.push('X');
                else if (down) this.queue.push('X!');
                else if (left) this.queue.push('Y');
                else if (right) this.queue.push('Y!');
            } else if (sticker == 'U') {
                if (up) this.queue.push('X');
                else if (down) this.queue.push('X!');
                else if (right) this.queue.push('Z');
                else if (left) this.queue.push('Z!');
            }

            // Unknown input, do nothing
            else return;

            // Execute the turn
            this.nextTurn();
        },

        /**
         * Scrambles the cube
         */
        scramble: function()
        {
            // Only scramble the cube if we have no pending turns
            if (this.queue.length == 0 && !this.is_turning) {
                var i = 0,
                    previous = false,
                    faces = ['U', 'L', 'F', 'R', 'B', 'D', 'M', 'E', 'X', 'Y'];

                while (i < this.scramble_depth) {
                    var face        = faces[Math.floor(Math.random()*faces.length)],
                        direction   = Math.random() < .5;

                    if (!previous || previous != face) {
                        var turn = direction ? face : face + '!';

                        // Add the turn to the que
                        this.queue.push(turn);

                        // Keep track of the face we just turned
                        previous = face;
                        if (face != 'X' && face != 'Y') {
                            i++;
                        }
                    }
                }

                this.queue.push('CLOCK');

                // Start executing the scramble
                this.$scramble.prop('disabled', true);
                this.is_scrambled = true;
                this.nextTurn();
            }
        },

        /**
         * Fired when the cube is solved
         */
        solved: function()
        {
            // Stop the clock and calculate the solve time
            var solve_time = ((new Date).getTime() - this.start_time) / 1000;

            this.is_scrambled = false;
            this.$scramble.prop('disabled', false);

            swal({
                title: 'Solved in ' + Math.floor(solve_time) + ' seconds!',
                text: 'Want to submit your solve?',
                type: 'input',
                showCancelButton: true,
                closeOnConfirm: false,
                inputPlaceholder: 'Enter your name...',
                animation: 'slide-from-top',
            }, function(inputValue){
                if (inputValue !== false) {
                    if (inputValue === '') {
                        swal.showInputError('Please enter your name.');
                        return false
                    }
                    swal('Thanks for playing!', 'Your solve has been submitted.', 'success');
                }

                $.request('cube::onSubmitSolve', {
                    data: {
                        name: inputValue || '',
                        time: solve_time,
                    },
                    update: {
                        'cube::scoreboard': '#scoreboard',
                    }
                });
            });
        },

        /**
         * Executes the next turn in the queue
         */
        nextTurn: function() {
            // Only process the next turn if the cube is at rest
            if (this.is_turning) return;

            var turn = this.queue.shift();

            if (turn) {

                // Start the clock
                if (turn == 'CLOCK') {
                    var d = new Date();
                    this.start_time = d.getTime();
                }

                // Pass the turn to a handler, and set toggle the turning status
                // to prevent conflicting turns from firing at the same time.
                else {
                    face        = turn.charAt(0),
                    direction   = turn.length == 1;
                    if (typeof this['turn' + face] == 'function') {
                        this.is_turning = true;
                        this['turn' + face](direction);
                    }
                }
            }
        },

        /**
         * Return all sticks on all faces
         */
        findAllFaces: function() {
            return {
                U: this.findStickers('U'),
                L: this.findStickers('L'),
                F: this.findStickers('F'),
                R: this.findStickers('R'),
                B: this.findStickers('B'),
                D: this.findStickers('D'),
            }
        },

        /**
         * Finds stickers by an array of sticker IDs
         *
         * @param   array|string    The stickers being selected
         */
        findStickers: function(stickers) {
            if (typeof stickers == 'string') {
                return this.$cube.find('div[data-face="' + stickers + '"]');
            } else if (typeof stickers == 'object') {
                for(var selectors = [], i = 0, n = stickers.length; i < n; i += 1)  {
                    selectors.push('div[data-sticker="' + stickers[i] + '"]');
                }
                return this.$cube.find(selectors.join());
            }
        },

        /**
         * Turns a collection of stickers around an axis
         *
         * @param               Collection of sticker divs being rotated
         * @param   string      Axis to rotate the stickers around
         * @param   integer     Transform rotation value
         */
        executeTurn: function($stickers, axis, rotation) {
            var expression  = new RegExp('rotate' + axis + '\\((-)?[0-9]+(deg)?\\)'),
                destination = 'rotate' + axis + '(' + rotation + 'deg)';

            $stickers.css('transition', '').each(function() {
                $(this).css('transform', $(this).data('origin').replace(expression, destination));
            });
        },

        /**
         * Update sticker colors
         *
         * @param   string      Determines which center to bind callback to
         * @param   object      Map of sticker sources and targets
         * @param   boolean     Determines how to read the map
         */
        updateStickers: function(face, map, is_clockwise) {
            var self = this;

            // If we're updating for a counter-clockwise turn, invert the map
            // so it can be read backwards.
            if (!is_clockwise) {
                var inverted = {};
                for (var sticker in map) {
                    if(map.hasOwnProperty(sticker)) {
                        inverted[map[sticker]] = sticker;
                    }
                }

                map = inverted;
            }

            // Select the stickers being updated
            var selectors = [], $stickers;
            for (var sticker in map) {
                selectors.push(sticker);
            }
            $stickers = this.findStickers(selectors);

            // Bind a callback to the center sticker
            this.$cube.find('div[data-sticker="' + face + '"]').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
                $(this).off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');

                // Re-paint all of the stickers with their new color
                $stickers.each(function() {
                    var $target = self.$cube.find('div[data-sticker="' + map[$(this).data('sticker')] + '"]');
                    $target.css({
                       'transition': 'none',
                       'transform': '',
                       'background-color': $(this).data('color'),
                    });
                }).each(function() {
                    $(this).data('color', $(this).css('background-color'));
                });

                self.is_turning = false;

                // If the cube is not solved, proceed to the next move
                if (!self.is_solved()) self.nextTurn();

                // Otherwise fire the solved method
                else self.solved();
            });
        },

        /**
         * Turn functions
         *
         * @param   boolean     Determines which direction to turn the face
         */
        turnU: function(direction) {
            // Select the stickers being effected by this turn
            var $U = this.findStickers('U'),
                $L = this.findStickers(['LBU', 'LU', 'LUF']),
                $F = this.findStickers(['FLU', 'FU', 'FUR']),
                $R = this.findStickers(['RFU', 'RU', 'RUB']),
                $B = this.findStickers(['BRU', 'BU', 'BUL']),

                // These maps are used to track the movement of stickers. Once
                // a sticker is transitioned, it is reset and will assume the color
                // of the sticker that is taking it's place. By default, this map
                // contains the updates for a clockwise turn. If the turn  is
                // counter clockwise, we'll simply read the map backwards.
                map = {
                    'U': 'U',
                    'UB': 'UR', 'UR': 'UF', 'UF': 'UL', 'UL': 'UB',
                    'BU': 'RU', 'RU': 'FU', 'FU': 'LU', 'LU': 'BU',
                    'ULB': 'UBR', 'UBR': 'URF', 'URF': 'UFL', 'UFL': 'ULB',
                    'BUL': 'RUB', 'RUB': 'FUR', 'FUR': 'LUF', 'LUF': 'BUL',
                    'BRU': 'RFU', 'RFU': 'FLU', 'FLU': 'LBU', 'LBU': 'BRU',
                };

            // Tell the CSS transitions to do their thing
            this.executeTurn($U, 'Z', direction ? 90 : -90);
            this.executeTurn($L, 'Y', direction ? -180 : 0);
            this.executeTurn($F, 'Y', direction ? -90 : 90);
            this.executeTurn($R, 'Y', direction ? 0 : 180);
            this.executeTurn($B, 'Y', direction ? 90 : 270);

            // Update the sticker colors
            this.updateStickers('U', map, direction);
        },

        turnL: function(direction) {
            var $L = this.findStickers('L'),
                $U = this.findStickers(['ULB','UL','UFL']),
                $F = this.findStickers(['FLU','FL','FDL']),
                $D = this.findStickers(['DLF','DL','DBL']),
                $B = this.findStickers(['BLD','BL','BUL']),
                map = {
                    'L': 'L',
                    'LU': 'LF', 'LF': 'LD', 'LD': 'LB', 'LB': 'LU',
                    'UL': 'FL', 'FL': 'DL', 'DL': 'BL', 'BL': 'UL',
                    'LBU': 'LUF', 'LUF': 'LFD', 'LFD': 'LDB', 'LDB': 'LBU',
                    'UFL': 'FDL', 'FDL': 'DBL', 'DBL': 'BUL', 'BUL': 'UFL',
                    'ULB': 'FLU', 'FLU': 'DLF', 'DLF': 'BLD', 'BLD': 'ULB',
                };

            this.executeTurn($L, 'Z', direction ? 90 : -90);
            this.executeTurn($U, 'X', direction ? 0 : 180);
            this.executeTurn($F, 'X', direction ? -90 : 90);
            this.executeTurn($D, 'X', direction ? -180 : 0);
            this.executeTurn($B, 'X', direction ? 90 : -90);

            this.updateStickers('L', map, direction);
        },

        turnF: function(direction) {
            var $F = this.findStickers('F'),
                $U = this.findStickers(['UFL','UF','URF']),
                $R = this.findStickers(['RFU','RF','RDF']),
                $D = this.findStickers(['DFR','DF','DLF']),
                $L = this.findStickers(['LFD','LF','LUF']),
                map = {
                    'F': 'F',
                    'FU': 'FR', 'FR': 'FD', 'FD': 'FL', 'FL': 'FU',
                    'UF': 'RF', 'RF': 'DF', 'DF': 'LF', 'LF': 'UF',
                    'FLU': 'FUR', 'FUR': 'FRD', 'FRD': 'FDL', 'FDL': 'FLU',
                    'UFL': 'RFU', 'RFU': 'DFR', 'DFR': 'LFD', 'LFD': 'UFL',
                    'URF': 'RDF', 'RDF': 'DLF', 'DLF': 'LUF', 'LUF': 'URF',
                };

            this.executeTurn($F, 'Z', direction ? 90 : -90);
            this.executeTurn($U, 'Y', direction ? 90 : -90);
            this.executeTurn($R, 'X', direction ? -90 : 90);
            this.executeTurn($D, 'Y', direction ? -90 : 90);
            this.executeTurn($L, 'X', direction ? 90 : -90);

            this.updateStickers('F', map, direction);
        },

        turnR: function(direction) {
            var $R = this.findStickers('R'),
                $U = this.findStickers(['URF','UR','UBR']),
                $B = this.findStickers(['BRU','BR','BDR']),
                $D = this.findStickers(['DRB','DR','DFR']),
                $F = this.findStickers(['FRD','FR','FUR']),
                map = {
                    'R': 'R',
                    'RU': 'RB', 'RB': 'RD', 'RD': 'RF', 'RF': 'RU',
                    'UR': 'BR', 'BR': 'DR', 'DR': 'FR', 'FR': 'UR',
                    'RFU': 'RUB', 'RUB': 'RBD', 'RBD': 'RDF', 'RDF': 'RFU',
                    'URF': 'BRU', 'BRU': 'DRB', 'DRB': 'FRD', 'FRD': 'URF',
                    'UBR': 'BDR', 'BDR': 'DFR', 'DFR': 'FUR', 'FUR': 'UBR',
                };

            this.executeTurn($R, 'Z', direction ? 90 : -90);
            this.executeTurn($U, 'X', direction ? 180 : 0);
            this.executeTurn($B, 'X', direction ? -90 : 90);
            this.executeTurn($D, 'X', direction ? 0 : -180);
            this.executeTurn($F, 'X', direction ? 90 : -90);

            this.updateStickers('R', map, direction);
        },

        turnB: function(direction) {
            var $B = this.findStickers('B'),
                $U = this.findStickers(['ULB','UB','UBR']),
                $L = this.findStickers(['LBU','LB','LDB']),
                $R = this.findStickers(['RUB','RB','RBD']),
                $D = this.findStickers(['DBL','DB','DRB']),
                map = {
                    'B': 'B',
                    'BU': 'BL', 'BL': 'BD', 'BD': 'BR', 'BR': 'BU',
                    'UB': 'LB', 'LB': 'DB', 'DB': 'RB', 'RB': 'UB',
                    'BRU': 'BUL', 'BUL': 'BLD', 'BLD': 'BDR', 'BDR': 'BRU',
                    'UBR': 'LBU', 'LBU': 'DBL', 'DBL': 'RBD', 'RBD': 'UBR',
                    'ULB': 'LDB', 'LDB': 'DRB', 'DRB': 'RUB', 'RUB': 'ULB',
                };

            this.executeTurn($B, 'Z', direction ? 90 : -90);
            this.executeTurn($U, 'Y', direction ? -90 : 90);
            this.executeTurn($L, 'X', direction ? -90 : 90);
            this.executeTurn($R, 'X', direction ? 90 : -90);
            this.executeTurn($D, 'Y', direction ? 90 : -90);

            this.updateStickers('B', map, direction);
        },

        turnD: function(direction) {
            var $D = this.findStickers('D'),
                $F = this.findStickers(['FDL','FD','FRD']),
                $R = this.findStickers(['RDF','RD','RBD']),
                $B = this.findStickers(['BDR','BD','BLD']),
                $L = this.findStickers(['LDB','LD','LFD']),
                map = {
                    'D': 'D',
                    'DF': 'DR', 'DR': 'DB', 'DB': 'DL', 'DL': 'DF',
                    'FD': 'RD', 'RD': 'BD', 'BD': 'LD', 'LD': 'FD',
                    'DLF': 'DFR', 'DFR': 'DRB', 'DRB': 'DBL', 'DBL': 'DLF',
                    'FDL': 'RDF', 'RDF': 'BDR', 'BDR': 'LDB', 'LDB': 'FDL',
                    'FRD': 'RBD', 'RBD': 'BLD', 'BLD': 'LFD', 'LFD': 'FRD',
                };

            this.executeTurn($D, 'Z', direction ? 90 : -90);
            this.executeTurn($F, 'Y', direction ? 90 : -90);
            this.executeTurn($R, 'Y', direction ? 180 : 0);
            this.executeTurn($B, 'Y', direction ? 270 : 90);
            this.executeTurn($L, 'Y', direction ? 0 : -180);

            this.updateStickers('D', map, direction);
        },

        turnM: function(direction) {
            var $U = this.findStickers(['UB','U','UF']),
                $F = this.findStickers(['FU','F','FD']),
                $D = this.findStickers(['DF','D','DB']),
                $B = this.findStickers(['BD','B','BU']),
                map = {
                    'U': 'F', 'F': 'D', 'D': 'B', 'B': 'U',
                    'UB': 'FU', 'FU': 'DF', 'DF': 'BD', 'BD': 'UB',
                    'UF': 'FD', 'FD': 'DB', 'DB': 'BU', 'BU': 'UF',
                };

            this.executeTurn($U, 'X', direction ? 0 : 180);
            this.executeTurn($F, 'X', direction ? -90 : 90);
            this.executeTurn($D, 'X', direction ? -180 : 0);
            this.executeTurn($B, 'X', direction ? 90 : -90);

            this.updateStickers('D', map, direction);
        },

        turnE: function(direction) {
            var $L = this.findStickers(['LB','L','LF']),
                $F = this.findStickers(['FL','F','FR']),
                $R = this.findStickers(['RF','R','RB']),
                $B = this.findStickers(['BR','B','BL']),
                map = {
                    'L': 'F', 'F': 'R', 'R': 'B', 'B': 'L',
                    'LB': 'FL', 'FL': 'RF', 'RF': 'BR', 'BR': 'LB',
                    'LF': 'FR', 'FR': 'RB', 'RB': 'BL', 'BL': 'LF',
                };

            this.executeTurn($L, 'Y', direction ? 0 : -180);
            this.executeTurn($F, 'Y', direction ? 90 : -90);
            this.executeTurn($R, 'Y', direction ? 180 : 0);
            this.executeTurn($B, 'Y', direction ? 270 : 90);

            this.updateStickers('L', map, direction);
        },

        turnS: function(direction) {
            var $U = this.findStickers(['UL', 'U', 'UR']),
                $R = this.findStickers(['RU', 'R', 'RD']),
                $D = this.findStickers(['DR', 'D', 'DL']),
                $L = this.findStickers(['LD', 'L', 'LU']),
                map = {
                    'U': 'R', 'R': 'D', 'D': 'L', 'L': 'U',
                    'UL': 'RU', 'RU': 'DR', 'DR': 'LD', 'LD': 'UL',
                    'UR': 'RD', 'RD': 'DL', 'DL': 'LU', 'LU': 'UR',
                };

            this.executeTurn($U, 'Y', direction ? 90 : -90);
            this.executeTurn($R, 'X', direction ? -90 : 90);
            this.executeTurn($D, 'Y', direction ? -90 : 90);
            this.executeTurn($L, 'X', direction ? 90 : -90);

            this.updateStickers('U', map, direction);
        },

        // The X, Y, and Z methods turn the entire cube, and they function
        // exactly the same as slice turns.
        turnX: function(direction) {
            var faces = this.findAllFaces(),
                map = {
                    'L': 'L', 'R': 'R',
                    'F': 'U', 'U': 'B', 'B': 'D', 'D': 'F',
                    'LF': 'LU', 'LD': 'LF', 'LB': 'LD', 'LU': 'LB',
                    'FL': 'UL', 'DL': 'FL', 'BL': 'DL', 'UL': 'BL',
                    'UB': 'BD', 'BD': 'DF', 'DF': 'FU', 'FU': 'UB',
                    'UF': 'BU', 'BU': 'DB', 'DB': 'FD', 'FD': 'UF',
                    'RU': 'RB', 'RB': 'RD', 'RD': 'RF', 'RF': 'RU',
                    'UR': 'BR', 'BR': 'DR', 'DR': 'FR', 'FR': 'UR',
                    'LUF': 'LBU', 'LFD': 'LUF', 'LDB': 'LFD', 'LBU': 'LDB',
                    'FDL': 'UFL', 'DBL': 'FDL', 'BUL': 'DBL', 'UFL': 'BUL',
                    'FLU': 'ULB', 'DLF': 'FLU', 'BLD': 'DLF', 'ULB': 'BLD',
                    'RFU': 'RUB', 'RUB': 'RBD', 'RBD': 'RDF', 'RDF': 'RFU',
                    'URF': 'BRU', 'BRU': 'DRB', 'DRB': 'FRD', 'FRD': 'URF',
                    'UBR': 'BDR', 'BDR': 'DFR', 'DFR': 'FUR', 'FUR': 'UBR',
                };

            this.executeTurn(faces['U'], 'X', direction ? 180 : 0);
            this.executeTurn(faces['L'], 'Z', direction ? -90 : 90);
            this.executeTurn(faces['F'], 'X', direction ? 90 : -90);
            this.executeTurn(faces['R'], 'Z', direction ? 90 : -90);
            this.executeTurn(faces['B'], 'X', direction ? -90 : 90);
            this.executeTurn(faces['D'], 'X', direction ? 0 : -180);

            this.updateStickers('U', map, direction);
        },

        turnY: function(direction) {
            var faces = this.findAllFaces(),
                map = {
                    'U': 'U', 'D': 'D',
                    'F': 'L', 'L': 'B', 'B': 'R', 'R': 'F',
                    'UB': 'UR', 'UR': 'UF', 'UF': 'UL', 'UL': 'UB',
                    'BU': 'RU', 'RU': 'FU', 'FU': 'LU', 'LU': 'BU',
                    'FL': 'LB', 'LB': 'BR', 'BR': 'RF', 'RF': 'FL',
                    'FR': 'LF', 'LF': 'BL', 'BL': 'RB', 'RB': 'FR',
                    'DR': 'DF', 'DB': 'DR', 'DL': 'DB', 'DF': 'DL',
                    'RD': 'FD', 'BD': 'RD', 'LD': 'BD', 'FD': 'LD',
                    'ULB': 'UBR', 'UBR': 'URF', 'URF': 'UFL', 'UFL': 'ULB',
                    'BUL': 'RUB', 'RUB': 'FUR', 'FUR': 'LUF', 'LUF': 'BUL',
                    'BRU': 'RFU', 'RFU': 'FLU', 'FLU': 'LBU', 'LBU': 'BRU',
                    'DFR': 'DLF', 'DRB': 'DFR', 'DBL': 'DRB', 'DLF': 'DBL',
                    'RDF': 'FDL', 'BDR': 'RDF', 'LDB': 'BDR', 'FDL': 'LDB',
                    'RBD': 'FRD', 'BLD': 'RBD', 'LFD': 'BLD', 'FRD': 'LFD',
                };

            this.executeTurn(faces['U'], 'Z', direction ? 90 : -90);
            this.executeTurn(faces['L'], 'Y', direction ? -180 : 0);
            this.executeTurn(faces['F'], 'Y', direction ? -90 : 90);
            this.executeTurn(faces['R'], 'Y', direction ? 0 : 180);
            this.executeTurn(faces['B'], 'Y', direction ? 90 : 270);
            this.executeTurn(faces['D'], 'Z', direction ? -90 : 90);

            this.updateStickers('U', map, direction);
        },

        turnZ: function(direction) {
            var faces = this.findAllFaces(),
                map = {
                    'F': 'F', 'B': 'B',
                    'U': 'R', 'R': 'D', 'D': 'L', 'L': 'U',
                    'UL': 'RU', 'RU': 'DR', 'DR': 'LD', 'LD': 'UL',
                    'UR': 'RD', 'RD': 'DL', 'DL': 'LU', 'LU': 'UR',

                    'FU': 'FR', 'FR': 'FD', 'FD': 'FL', 'FL': 'FU',
                    'UF': 'RF', 'RF': 'DF', 'DF': 'LF', 'LF': 'UF',
                    'FLU': 'FUR', 'FUR': 'FRD', 'FRD': 'FDL', 'FDL': 'FLU',
                    'UFL': 'RFU', 'RFU': 'DFR', 'DFR': 'LFD', 'LFD': 'UFL',
                    'URF': 'RDF', 'RDF': 'DLF', 'DLF': 'LUF', 'LUF': 'URF',

                    'BL': 'BU', 'BU': 'BR', 'BR': 'BD', 'BD': 'BL',
                    'UB': 'RB', 'RB': 'DB', 'DB': 'LB', 'LB': 'UB',
                    'BUL': 'BRU', 'BLD': 'BUL', 'BDR': 'BLD', 'BRU': 'BDR',
                    'LBU': 'UBR', 'DBL': 'LBU', 'RBD': 'DBL', 'UBR': 'RBD',
                    'LDB': 'ULB', 'DRB': 'LDB', 'RUB': 'DRB', 'ULB': 'RUB',
                };

            this.executeTurn(faces['U'], 'Y', direction ? 90 : -90);
            this.executeTurn(faces['L'], 'X', direction ? 90 : -90);
            this.executeTurn(faces['F'], 'Z', direction ? 90 : -90);
            this.executeTurn(faces['R'], 'X', direction ? -90 : 90);
            this.executeTurn(faces['B'], 'Z', direction ? -90 : 90);
            this.executeTurn(faces['D'], 'Y', direction ? -90 : 90);

            this.updateStickers('F', map, direction);
        },
    };

    /**
     * Initialize the cube
     */
    Cube.init();
});

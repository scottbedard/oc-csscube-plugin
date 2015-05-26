# CSS Cube

<a href="http://scottbedard.net/cube" style="display: block; text-align: center; padding: 10px 0">
    <img src="http://scottbedard.net/storage/app/media/cube.jpg">
</a>

This plugin was mostly just an excuse to experiment with 3D transforms and javascript, there are definitely more practical ways to make this kind of thing. But it was a fun project, and I hope you find it interesting.

### Browser support
Browser support actually [looks pretty good](http://caniuse.com/#feat=transforms3d), although in typical Internet Explorer fasion, they've completely dropped the ball on `transform-style: preserve-3d`. Their development version claims to support it, but I have not tested this yet.

#### Mobile controls
Touch gestures are supported, to move the cube on a mobile device simply touch a sticker and swipe in the direction you wish to turn. To rotate the entire cube, perform this action on a center sticker.

#### Keyboard Controls
To those not familiar with cube notation, [this might be a good place to start](https://www.speedsolving.com/wiki/index.php/3x3x3_notation).

| Key   | Result |
| :---: |:------:|
| J / F | U / U' |
| E / D | L / L' |
| H / G | F / F' |
| I / K | R / R' |
| Q / P | B / B' |
| S / L | D / D' |
| B / Y | M / M' |
| O / W | S / S' |
| . / Z | E / E' |
| U / T | X      |
| V / N | X'     |
| ; / A | Y / Y' |
| , / Z | Z / Z' |
